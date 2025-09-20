import { mkdirSync } from 'fs';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';

abstract class Storage {
	abstract uploadFile(workspaceId: string, fileId: string, file: ArrayBuffer): Promise<{ s3_path: string; s3_hash: string; file_size: number }>;
	abstract deleteFile(s3_path: string): Promise<void>;
	abstract downloadFile(s3_path: string): Promise<Buffer>;
}

export class LocalStorage extends Storage {
	constructor(private basePath: string) {
		super();

		mkdirSync(this.basePath, { recursive: true });
	}

	async uploadFile(workspaceId: string, fileId: string, file: ArrayBuffer): Promise<{ s3_path: string; s3_hash: string; file_size: number }> {
		await mkdir(this.basePath + '/' + workspaceId, { recursive: true });

		const filePath = this.basePath + '/' + workspaceId + '/' + fileId;
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

export const storage = new LocalStorage('./temp-storage');
