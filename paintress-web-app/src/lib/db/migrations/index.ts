import type { MigrationProvider } from "kysely";
import init from "./001-init";

export const migrationProvider: MigrationProvider = {
  getMigrations: async () => {
    return {
      "001-init": init,
    };
  },
};
