import { Kysely, sql, type Migration } from "kysely";
import type { DB } from "../model";

export default {
  up: async (db: Kysely<DB>) => {
    await db.schema
      .createTable("books")
      .addColumn("id", "text", (b) => b.primaryKey())
      .addColumn("name", "text", (b) => b.notNull())
      .addColumn("icon", "text", (b) => b.notNull())
      .addColumn("deleted", "boolean", (b) => b.notNull().defaultTo(false))
      .addColumn("is_encrypted", "boolean", (b) => b.notNull().defaultTo(false))
      .addColumn("frontmatter", "jsonb", (b) => b.notNull())
      .addColumn("sort_order", "integer", (b) => b.notNull().defaultTo(0))
      .addColumn("created_at", "timestamp", (b) =>
        b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
      )
      .addColumn("updated_at", "timestamp", (b) =>
        b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
      )
      .execute();

    await db.schema
      .createTable("folders")
      .addColumn("id", "text", (b) => b.primaryKey())
      .addColumn("book_id", "text", (b) => b.notNull().references("books.id"))
      .addColumn("parent_folder_id", "text", (b) => b.references("folders.id"))
      .addColumn("sort_order", "integer", (b) => b.notNull().defaultTo(0))
      .addColumn("name", "text", (b) => b.notNull())
      .addColumn("icon", "text", (b) => b.notNull())
      .addColumn("deleted", "boolean", (b) => b.notNull().defaultTo(false))
      .addColumn("created_at", "timestamp", (b) =>
        b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
      )
      .addColumn("updated_at", "timestamp", (b) =>
        b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
      )
      .execute();

    await db.schema
      .createTable("notes")
      .addColumn("id", "text", (b) => b.primaryKey())
      .addColumn("book_id", "text", (b) => b.notNull().references("books.id"))
      .addColumn("folder_id", "text", (b) => b.references("folders.id"))
      .addColumn("deleted", "boolean", (b) => b.notNull().defaultTo(false))
      .addColumn("frontmatter", "jsonb", (b) => b.notNull())
      .addColumn("type", "text", (b) => b.notNull())
      .addColumn("title", "text", (b) => b.notNull())
      .addColumn("is_secure", "boolean", (b) => b.notNull().defaultTo(false))
      .addColumn("sort_order", "integer", (b) => b.notNull().defaultTo(0))
      .addColumn("active_version", "integer", (b) => b.notNull().defaultTo(0))
      .addColumn("created_at", "timestamp", (b) =>
        b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
      )
      .addColumn("updated_at", "timestamp", (b) =>
        b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
      )
      .execute();

    await db.schema
      .createTable("nodes")
      .addColumn("id", "text", (b) => b.primaryKey())
      .addColumn("note_id", "text", (b) => b.notNull().references("notes.id"))
      .addColumn("type", "text", (b) => b.notNull())
      .addColumn("content", "text", (b) => b.notNull())
      .execute();

    await db.schema
      .createTable("files")
      .addColumn("id", "text", (b) => b.primaryKey())
      .addColumn("node_id", "text", (b) => b.notNull().references("nodes.id"))
      .addColumn("remote_file_path", "text", (b) => b.notNull())
      .addColumn("local_file_path", "text", (b) => b.notNull())
      .addColumn("type", "text", (b) => b.notNull())
      .addColumn("size", "integer", (b) => b.notNull())
      .addColumn("original_file_name", "text", (b) => b.notNull())
      .addColumn("mime_type", "text", (b) => b.notNull())
      .addColumn("hash", "text", (b) => b.notNull())
      .addColumn("deleted", "boolean", (b) => b.notNull().defaultTo(false))
      .addColumn("created_at", "timestamp", (b) =>
        b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
      )
      .addColumn("updated_at", "timestamp", (b) =>
        b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
      )
      .execute();

    await db.schema
      .createTable("event_logs")
      .addColumn("id", "text", (b) => b.primaryKey())
      .addColumn("type", "text", (b) => b.notNull())
      .addColumn("data", "jsonb", (b) => b.notNull())
      .addColumn("created_at", "timestamp", (b) =>
        b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
      )
      .execute();

    await db.schema
      .createTable("application_state")
      .addColumn("id", "integer", (b) => b.primaryKey().defaultTo(1))
      .addColumn("data", "jsonb", (b) => b.notNull())
      .execute();

    await db.schema
      .createTable("note_node_maps")
      .addColumn("note_id", "text", (b) => b.notNull().references("notes.id"))
      .addColumn("node_id", "text", (b) => b.notNull().references("nodes.id"))
      .addColumn("version", "integer", (b) => b.notNull())
      .addColumn("order", "integer", (b) => b.notNull())
      .execute();
  },
  down: async (db: Kysely<DB>) => {
    await db.schema.dropTable("books").execute();
    await db.schema.dropTable("folders").execute();
    await db.schema.dropTable("notes").execute();
    await db.schema.dropTable("nodes").execute();
    await db.schema.dropTable("files").execute();
    await db.schema.dropTable("event_logs").execute();
    await db.schema.dropTable("application_state").execute();
  },
} as Migration;
