"""Storage abstraction layer supporting both local and S3 storage."""

import os
import uuid
from abc import ABC, abstractmethod
from typing import BinaryIO, Optional, Tuple
from urllib.parse import urlparse

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
import aiofiles

from .config import settings


class StorageError(Exception):
    """Custom exception for storage operations."""

    pass


class BaseStorage(ABC):
    """Abstract base class for storage backends."""

    @abstractmethod
    async def upload_file(
        self, file_content: BinaryIO, filename: str, content_type: str
    ) -> Tuple[str, str]:
        """
        Upload a file and return (file_path, file_url).

        Args:
            file_content: File content to upload
            filename: Original filename
            content_type: MIME type of the file

        Returns:
            Tuple of (storage_path, accessible_url)
        """
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from storage.

        Args:
            file_path: Path to the file in storage

        Returns:
            True if deletion was successful
        """
        pass

    @abstractmethod
    async def get_file_url(self, file_path: str) -> str:
        """
        Get accessible URL for a file.

        Args:
            file_path: Path to the file in storage

        Returns:
            Accessible URL for the file
        """
        pass


class LocalStorage(BaseStorage):
    """Local file system storage implementation."""

    def __init__(self, base_path: str):
        self.base_path = base_path
        os.makedirs(base_path, exist_ok=True)

    async def upload_file(
        self, file_content: BinaryIO, filename: str, content_type: str
    ) -> Tuple[str, str]:
        """Upload file to local storage."""
        try:
            # Generate unique filename
            file_extension = os.path.splitext(filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(self.base_path, unique_filename)

            # Write file to disk
            async with aiofiles.open(file_path, "wb") as f:
                content = file_content.read()
                await f.write(content)

            # Return relative path and URL
            relative_path = os.path.relpath(file_path, self.base_path)
            file_url = f"/api/v1/attachments/file/{relative_path}"

            return relative_path, file_url

        except Exception as e:
            raise StorageError(f"Failed to upload file to local storage: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from local storage."""
        try:
            full_path = os.path.join(self.base_path, file_path)
            if os.path.exists(full_path):
                os.remove(full_path)
                return True
            return False
        except Exception as e:
            raise StorageError(f"Failed to delete file from local storage: {str(e)}")

    async def get_file_url(self, file_path: str) -> str:
        """Get URL for local file."""
        return f"/api/v1/attachments/file/{file_path}"


class S3Storage(BaseStorage):
    """AWS S3 compatible storage implementation."""

    def __init__(
        self,
        access_key: str,
        secret_key: str,
        bucket_name: str,
        region: str = "us-east-1",
        endpoint_url: Optional[str] = None,
    ):
        self.bucket_name = bucket_name
        self.region = region
        self.endpoint_url = endpoint_url

        try:
            self.s3_client = boto3.client(
                "s3",
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
                region_name=region,
                endpoint_url=endpoint_url,
            )

            # Test connection
            self._test_connection()

        except NoCredentialsError:
            raise StorageError("S3 credentials not provided or invalid")
        except Exception as e:
            raise StorageError(f"Failed to initialize S3 client: {str(e)}")

    def _test_connection(self):
        """Test S3 connection and bucket access."""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "404":
                raise StorageError(f"S3 bucket '{self.bucket_name}' does not exist")
            elif error_code == "403":
                raise StorageError(f"Access denied to S3 bucket '{self.bucket_name}'")
            else:
                raise StorageError(f"S3 connection error: {str(e)}")

    async def upload_file(
        self, file_content: BinaryIO, filename: str, content_type: str
    ) -> Tuple[str, str]:
        """Upload file to S3."""
        try:
            # Generate unique filename
            file_extension = os.path.splitext(filename)[1]
            unique_filename = f"attachments/{uuid.uuid4()}{file_extension}"

            # Upload to S3
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=unique_filename,
                Body=file_content.read(),
                ContentType=content_type,
                ServerSideEncryption="AES256",  # Enable server-side encryption
            )

            # Generate accessible URL
            file_url = f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{unique_filename}"

            # If using custom endpoint (like DigitalOcean Spaces), construct URL differently
            if self.endpoint_url:
                parsed_url = urlparse(self.endpoint_url)
                file_url = f"{parsed_url.scheme}://{self.bucket_name}.{parsed_url.netloc}/{unique_filename}"

            return unique_filename, file_url

        except ClientError as e:
            raise StorageError(f"Failed to upload file to S3: {str(e)}")
        except Exception as e:
            raise StorageError(f"Unexpected error uploading to S3: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from S3."""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_path)
            return True
        except ClientError as e:
            raise StorageError(f"Failed to delete file from S3: {str(e)}")
        except Exception as e:
            raise StorageError(f"Unexpected error deleting from S3: {str(e)}")

    async def get_file_url(self, file_path: str) -> str:
        """Get URL for S3 file."""
        # For public files, return direct URL
        file_url = (
            f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{file_path}"
        )

        # If using custom endpoint, construct URL differently
        if self.endpoint_url:
            parsed_url = urlparse(self.endpoint_url)
            file_url = f"{parsed_url.scheme}://{self.bucket_name}.{parsed_url.netloc}/{file_path}"

        return file_url


def get_storage() -> BaseStorage:
    """Factory function to get appropriate storage backend."""
    if settings.enable_s3_storage:
        # Extract bucket name from S3 URL if provided
        bucket_name = settings.s3_bucket_name
        if not bucket_name and settings.s3_url:
            # Try to extract bucket name from URL
            parsed_url = urlparse(settings.s3_url)
            hostname_parts = parsed_url.hostname.split(".")
            if len(hostname_parts) > 0:
                bucket_name = hostname_parts[0]

        if not bucket_name:
            raise StorageError(
                "S3 bucket name must be provided when S3 storage is enabled"
            )

        # Determine endpoint URL for S3-compatible services
        endpoint_url = None
        if settings.s3_url and "amazonaws.com" not in settings.s3_url:
            # Custom S3-compatible service (like DigitalOcean Spaces)
            parsed_url = urlparse(settings.s3_url)
            endpoint_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

        return S3Storage(
            access_key=settings.s3_access_key,
            secret_key=settings.s3_secret_key,
            bucket_name=bucket_name,
            region=settings.s3_region,
            endpoint_url=endpoint_url,
        )
    else:
        return LocalStorage(settings.local_file_path)


# Global storage instance
storage = None


def get_storage_instance() -> BaseStorage:
    """Get or create storage instance."""
    global storage
    if storage is None:
        storage = get_storage()
    return storage
