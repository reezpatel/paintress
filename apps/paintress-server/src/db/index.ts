import SQLite from 'better-sqlite3';
import { Kysely, Migrator, SqliteDialect, type Migration, type MigrationProvider } from 'kysely';
import type { Database } from './db.js';
import { _0001_init_files } from './migrations/0001_init_files.js';

const dialect = new SqliteDialect({
	database: new SQLite(process.env.SQLITE_DB_PATH || 'db.sqlite'),
});

export const db = new Kysely<Database>({
	dialect,
});

class AppMigrator implements MigrationProvider {
	async getMigrations(): Promise<Record<string, Migration>> {
		return {
			'0001_init_files': _0001_init_files,
		};
	}
}

export const migrator = new Migrator({
	db,
	provider: new AppMigrator(),
});
