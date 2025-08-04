import type { Selectable } from "kysely";
import { db } from "../db";
import type { DB } from "../db/model";
import type { Book, Folder, Note, Repo } from "./model";
import { v4 as uuid } from "uuid";

const flush = async () => {
  await db.deleteFrom("books").execute();
  await db.deleteFrom("folders").execute();
  await db.deleteFrom("notes").execute();
  await db.deleteFrom("nodes").execute();
  await db.deleteFrom("files").execute();
  await db.deleteFrom("event_logs").execute();
  await db.deleteFrom("application_state").execute();
};

const mapBook = (book: Selectable<DB["books"]>): Book => {
  return {
    ...book,
    id: `${book.id}` as string,
    frontmatter: JSON.parse(book.frontmatter),
  };
};

const getBooks = async () => {
  const books = await db.selectFrom("books").selectAll().execute();
  return books.map(mapBook);
};

const getBook = async (id: string) => {
  const book = await db
    .selectFrom("books")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
  return book ? mapBook(book) : null;
};

const createBook = async (book: Parameters<Repo["books"]["createBook"]>[0]) => {
  return await db
    .insertInto("books")
    .values({
      id: uuid(),
      name: book.name,
      icon: book.icon,
      is_encrypted: book.is_encrypted,
      frontmatter: JSON.stringify({}),
    })
    .returning(["id"])
    .executeTakeFirstOrThrow();
};

// const updateBook = async (book: Parameters<Repo["books"]["updateBook"]>[0]) => {
//   return await db
//     .updateTable("books")
//     .set({
//       ...book,
//       updated_at: new Date().toISOString(),
//     })
//     .where("id", "=", book.id)
//     .returning(["id"])
//     .executeTakeFirstOrThrow();
// };

const deleteBook = async (id: string) => {
  await db.deleteFrom("books").where("id", "=", id).execute();
};

const mapNote = (note: Selectable<DB["notes"]>): Note => {
  return {
    ...note,
    id: `${note.id}` as string,
    frontmatter: JSON.parse(note.frontmatter),
  };
};

const getNotes = async (bookId: string) => {
  const notes = await db
    .selectFrom("notes")
    .where("book_id", "=", bookId)
    .selectAll()
    .execute();
  return notes.map(mapNote);
};

const getNote = async (bookId: string, noteId: string) => {
  const note = await db
    .selectFrom("notes")
    .where("book_id", "=", bookId)
    .where("id", "=", noteId)
    .selectAll()
    .executeTakeFirst();
  return note ? mapNote(note) : null;
};

const createNote = async (opt: Parameters<Repo["notes"]["createNote"]>[0]) => {
  return await db
    .insertInto("notes")
    .values({
      id: uuid(),
      book_id: opt.bookId,
      title: opt.type === "note" ? "New Note" : "New Todo",
      is_secure: false,
      type: opt.type || "note",
      folder_id: opt.folderId,
      frontmatter: JSON.stringify({}),
      deleted: false,
      active_version: 0,
    })
    .returning(["id"])
    .executeTakeFirstOrThrow();
};

const createFolder = async (bookId: string, parentFolderId: string) => {
  return await db
    .insertInto("folders")
    .values({
      id: uuid(),
      book_id: bookId,
      parent_folder_id: parentFolderId,
      name: "New Folder",
      icon: "💰",
    })
    .returning(["id"])
    .executeTakeFirstOrThrow();
};

const mapFolder = (folder: Selectable<DB["folders"]>): Folder => {
  return {
    ...folder,
    id: `${folder.id}` as string,
  };
};

const getFolders = async (bookId: string) => {
  const folders = await db
    .selectFrom("folders")
    .where("book_id", "=", bookId)
    .selectAll()
    .execute();
  return folders.map(mapFolder);
};

const updateFolderIdForNotes = async (noteIds: string[], folderId: string) => {
  await db
    .updateTable("notes")
    .set({ folder_id: folderId })
    .where("id", "in", noteIds)
    .execute();
};

const updateFolderIdForFolders = async (
  folderIds: string[],
  parentFolderId: string
) => {
  await db
    .updateTable("folders")
    .set({ parent_folder_id: parentFolderId })
    .where("id", "in", folderIds)
    .execute();
};

const updateNote = async (noteId: string, note: Partial<Pick<Note, "title" | "frontmatter">>) => {
  await db
    .updateTable("notes")
    .set({ ...note, updated_at: new Date().toISOString() } as Record<string, unknown>)
    .where("id", "=", noteId)
    .execute();
};

const updateFolder = async (folderId: string, folder: Partial<Pick<Folder, "name" | "icon">>) => {
  await db
    .updateTable("folders")
    .set({ ...folder, updated_at: new Date().toISOString() } as Record<string, unknown>)
    .where("id", "=", folderId)
    .execute();
};

const updateBook = async (bookId: string, book: Partial<Pick<Book, "name" | "icon">>) => {
  await db
    .updateTable("books")
    .set({ ...book, updated_at: new Date().toISOString() } as Record<string, unknown>)
    .where("id", "=", bookId)
    .execute();
};

export const createLocalRepo = (): Repo => {
  return {
    flush,
    init: async () => {
      // TODO: implement sync
    },
    books: {
      getBooks,
      getBook,
      createBook,
      deleteBook,
      updateBook,
    },
    notes: {
      getNotes,
      getNote,
      createNote,
      updateFolderIdForNotes,
      updateNote,
    },
    folder: {
      createFolder,
      getFolders,
      updateFolderIdForFolders,
      updateFolder,
    },
  };
};
