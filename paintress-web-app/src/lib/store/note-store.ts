import { create } from "zustand";
import type { Folder, Note } from "../repo/model";
import { repoStore } from "./repo.store";

type NoteStore = {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  folders: Folder[];
  fetchFolders: () => Promise<void>;
  showUpdateFolder: boolean;
  folderIdToUpdate: string | null;
  setShowUpdateFolder: (show: boolean, folderId?: string) => void;
};

export const noteStore = create<NoteStore>((set) => {
  return {
    notes: [],
    folders: [],
    showUpdateFolder: false,
    folderIdToUpdate: null,
    fetchNotes: async () => {
      const bookId = window.location.pathname.split("/").filter(Boolean).at(0) ?? "";

      const notes = await repoStore.getState().repo.notes.getNotes(bookId);
      set({ notes });
    },
    fetchFolders: async () => {
      const bookId = window.location.pathname.split("/").filter(Boolean).at(0) ?? "";
      const folders = await repoStore.getState().repo.folder.getFolders(bookId);
      set({ folders });
    },
    setShowUpdateFolder: (show: boolean, folderId?: string) => {
      set({ showUpdateFolder: show, folderIdToUpdate: folderId || null });
    },
  };
});
