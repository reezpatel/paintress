import { mkdirSync } from 'fs';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { join } from 'path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

abstract class Storage {
	abstract uploadFile(workspaceId: string, fileId: string, file: ArrayBuffer): Promise<{ s3_path: string; s3_hash: string; file_size: number }>;
	abstract deleteFile(s3_path: string): Promise<void>;
	abstract downloadFile(s3_path: string): Promise<Buffer> | Promise<{ redirectTo: string }>;
}

export class S3Storage extends Storage {
	s3Client = new S3({
		forcePathStyle: false,
		endpoint: process.env.S3_ENDPOINT || '',
		region: process.env.S3_REGION || '',
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY || '',
			secretAccessKey: process.env.S3_SECRET_KEY || '',
		},
	});

	async uploadFile(workspaceId: string, fileId: string, file: ArrayBuffer): Promise<{ s3_path: string; s3_hash: string; file_size: number }> {
		const s3_path = join(workspaceId, fileId);
		const res = await this.s3Client.putObject({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: s3_path,
			Body: Buffer.from(file),
		});

		return { s3_path, s3_hash: res.ChecksumSHA256 || '', file_size: res.Size || 0 };
	}

	async deleteFile(s3_path: string): Promise<void> {
		await this.s3Client.deleteObject({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: s3_path,
		});
	}

	async downloadFile(s3_path: string): Promise<{ redirectTo: string }> {
		const res = await getSignedUrl(
			this.s3Client,
			new GetObjectCommand({
				Bucket: process.env.S3_BUCKET_NAME,
				Key: s3_path,
			}),
			{
				expiresIn: 60 * 60 * 24 * 30,
			},
		);

		return { redirectTo: res };
	}
}

export class LocalStorage extends Storage {
	constructor(private basePath: string) {
		super();

		mkdirSync(this.basePath, { recursive: true });
	}

	async uploadFile(workspaceId: string, fileId: string, file: ArrayBuffer): Promise<{ s3_path: string; s3_hash: string; file_size: number }> {
		await mkdir(join(this.basePath, workspaceId), { recursive: true });

		const filePath = join(this.basePath, workspaceId, fileId);
		await writeFile(filePath, Buffer.from(file));

		return { s3_path: filePath, s3_hash: `no-hash-for-local-storage-${fileId}`, file_size: file.byteLength };
	}

	deleteFile(s3_path: string): Promise<void> {
		return unlink(s3_path);
	}

	async downloadFile(s3_path: string): Promise<Buffer> {
		return await readFile(s3_path);
	}
}

export const storage = process.env.USE_S3_STORAGE === 'true' ? new S3Storage() : new LocalStorage(process.env.LOCAL_FS_ROOT || './temp-storage');
