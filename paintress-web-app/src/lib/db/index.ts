import { SQLocalKysely } from "sqlocal/kysely";
import { Kysely, Migrator } from "kysely";
import { migrationProvider } from "./migrations";
import type { DB } from "./model";

const { dialect } = new SQLocalKysely("paintress-0.0.4.sqlite3");
export const db = new Kysely<DB>({ dialect, log: console.log });

export const migrate = async () => {
  const migrator = new Migrator({
    db,
    provider: migrationProvider,
  });

  const { error } = await migrator.migrateToLatest();

  if (error) {
    console.error(error);
    return false;
  }

  return true;
};
