import { create } from "zustand";
import type { Book } from "../repo/model";

type BookStore = {
  showCreateBook: boolean;
  setShowCreateBook: (show: boolean) => void;

  books: Book[];
  setBooks: (books: Book[]) => void;
};

export const bookStore = create<BookStore>((set) => ({
  showCreateBook: false,
  setShowCreateBook: (show) => set({ showCreateBook: show }),

  books: [],
  setBooks: (books) => set({ books }),
}));
