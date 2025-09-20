export type Database = {
	files: {
		file_id: string;
		workspace_id: string;

		file_size: number;
		file_path: string;

		s3_path: string;
		s3_hash: string;
		s3_size: number;

		deleted: 1 | 0;
		updated_at: number;
		deleted_at: number;
		created_at: number;
	};
};
