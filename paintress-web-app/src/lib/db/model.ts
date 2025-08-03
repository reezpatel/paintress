import type { Generated } from "kysely";
import type {
  ApplicationState,
  Book,
  Folder,
  EventLog,
  File,
  Note,
  Node,
} from "../repo/model";

type CommonColumns = {
  id: Generated<string>;
  created_at: Generated<string>;
  updated_at: Generated<string>;
};

export type DB = {
  books: Omit<Book, "frontmatter"> & CommonColumns & { frontmatter: string };
  folders: Folder & CommonColumns;
  notes: Omit<Note, "frontmatter"> & CommonColumns & { frontmatter: string };
  nodes: Node & CommonColumns;
  files: File & CommonColumns;
  event_logs: EventLog & CommonColumns;
  application_state: ApplicationState & CommonColumns;
};
