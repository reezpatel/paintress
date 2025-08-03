export interface Book {
  id: string;
  name: string;
  icon: string;

  is_encrypted: boolean;

  frontmatter: Record<string, string>;

  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  book_id: string;
  parent_folder_id: string | null;

  name: string;
  icon: string;

  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  book_id: string;
  folder_id: string;

  deleted: boolean;

  frontmatter: Record<string, string>;

  type: "note" | "todo";

  title: string;

  active_version: number;
  is_secure: boolean;

  created_at: string;
  updated_at: string;
}

export interface NoteNodeMap {
  note_id: string;
  node_id: string;

  version: number;
  order: number;
}

export interface Node {
  id: string;
  note_id: string;

  type: string;
  content: string;
}

export interface File {
  id: string;
  node_id: string;

  remoteFilePath: string;
  localFilePath: string;
}

export interface EventLog {
  id: string;
  type: string;
  data: Record<string, string>;
}

export interface ApplicationState {
  id: number;
  data: Record<string, unknown>;
}

export interface Repo {
  books: {
    getBooks: () => Promise<Book[]>;
    getBook: (id: string) => Promise<Book | undefined | null>;
    createBook: (
      book: Pick<Book, "name" | "icon" | "is_encrypted">
    ) => Promise<{ id: string }>;
    updateBook: (
      book: Pick<Book, "id" | "name" | "icon" | "is_encrypted">
    ) => Promise<{ id: string }>;
    deleteBook: (id: string) => Promise<void>;
  };
  notes: {
    getNotes: (bookId: string) => Promise<Note[]>;
    getNote: (
      bookId: string,
      noteId: string
    ) => Promise<Note | undefined | null>;
    createNote: (opt: {
      bookId: string;
      folderId: string;
      type: "note" | "todo";
    }) => Promise<{ id: string }>;
    updateFolderIdForNotes: (
      noteIds: string[],
      folderId: string
    ) => Promise<void>;
  };
  folder: {
    createFolder: (
      bookId: string,
      parentFolderId: string
    ) => Promise<{ id: string }>;
    getFolders: (bookId: string) => Promise<Folder[]>;
    updateFolderIdForFolders: (
      folderIds: string[],
      parentFolderId: string
    ) => Promise<void>;
  };
  // folders: {
  //   getFolders: () => Promise<Folder[]>;
  //   getFolder: (id: string) => Promise<Folder>;
  //   createFolder: (
  //     folder: Pick<Folder, "name" | "icon" | "parentFolderId">
  //   ) => Promise<Folder>;
  //   updateFolder: (
  //     folder: Pick<Folder, "id" | "name" | "icon" | "parentFolderId">
  //   ) => Promise<Folder>;
  //   deleteFolder: (id: string) => Promise<void>;
  // };
  // notes: {
  //   getNotes: () => Promise<Note[]>;
  //   getNote: (id: string) => Promise<Note>;
  //   createNote: (
  //     note: Pick<
  //       Note,
  //       "title" | "content" | "secure" | "type" | "folderId" | "frontmatter"
  //     >
  //   ) => Promise<Note>;
  //   updateNote: (
  //     note: Pick<
  //       Note,
  //       "id" | "title" | "content" | "secure" | "folderId" | "frontmatter"
  //     >
  //   ) => Promise<Note>;
  //   deleteNote: (id: string) => Promise<void>;
  // };
  flush: () => Promise<void>;
  init: () => Promise<void>;
}
