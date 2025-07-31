"""Application configuration settings."""

import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings."""

    # Database
    database_url: str = "sqlite:///./notes_app.db"

    # JWT Settings
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""

    # Application Settings
    app_name: str = "Notes App API"
    app_version: str = "1.0.0"
    debug: bool = False

    # File Upload Settings
    max_file_size: int = 10485760  # 10MB
    allowed_file_types: List[str] = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
        "application/pdf",
    ]
    upload_directory: str = "./uploads"

    # Storage Settings
    enable_s3_storage: bool = False
    s3_access_key: str = ""
    s3_secret_key: str = ""
    s3_bucket_name: str = ""
    s3_region: str = "us-east-1"
    s3_url: str = ""
    local_file_path: str = "./data"

    # CORS Settings
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:8080"]

    model_config = {"env_file": ".env", "case_sensitive": False}


settings = Settings()
