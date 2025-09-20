import type { Kysely } from 'kysely';
import type { Database } from '../db.js';

const up = async (db: Kysely<Database>) => {
	await db.schema
		.createTable('files')
		.addColumn('file_id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('workspace_id', 'text')
		.addColumn('file_path', 'text')
		.addColumn('file_size', 'integer')
		.addColumn('s3_path', 'text')
		.addColumn('s3_hash', 'text')
		.addColumn('s3_size', 'integer')
		.addColumn('deleted', 'boolean', (col) => col.notNull().defaultTo(false))
		.addColumn('updated_at', 'integer', (col) => col.notNull())
		.addColumn('deleted_at', 'integer', (col) => col.notNull())
		.addColumn('created_at', 'integer', (col) => col.notNull())
		.execute();
};

const down = async (db: Kysely<Database>) => {
	await db.schema.dropTable('files').execute();
};

export const _0001_init_files = {
	up,
	down,
};
