import { create } from "zustand";
import type { Book } from "../repo/model";

type BookStore = {
  showCreateBook: boolean;
  bookIdToUpdate: string | null;
  setShowCreateBook: (show: boolean, bookId?: string) => void;

  books: Book[];
  setBooks: (books: Book[]) => void;
};

export const bookStore = create<BookStore>((set) => ({
  showCreateBook: false,
  bookIdToUpdate: null,
  setShowCreateBook: (show, bookId) => set({ showCreateBook: show, bookIdToUpdate: bookId || null }),
  books: [],
  setBooks: (books) => set({ books }),
}));
