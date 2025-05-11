import type { StateCreator } from 'zustand';
import type { Book } from '../../types';
import {
  deleteBook,
  getBooks,
  postBook,
  updateBook as updateBookAPI,
} from '../../api/api';
import { devtools } from 'zustand/middleware';
import { Store } from '../store';

export type BooksSlice = {
  books: Book[];
  fetchBooks: () => Promise<void>;
  addBook: (book: FormData) => Promise<Book>;
  updateBook: (id: number, book: FormData) => Promise<void>;
  removeBook: (id: string) => Promise<void>;
};

export const createBooksSlice: StateCreator<
  Store,
  [],
  [['zustand/devtools', never]],
  BooksSlice
> = devtools(
  (set, get) => ({
    books: [],
    fetchBooks: async () => {
      const data = await getBooks();
      set({ books: data });
    },
    addBook: async (book: FormData) => {
      const newBook = await postBook(book);
      set(state => ({
        books: [...state.books, newBook],
      }));
      await get().fetchBooks();
      return newBook;
    },
    updateBook: async (id: number, book: FormData) => {
      const data = await updateBookAPI(book);
      set(state => ({
        books: state.books.map(b => (b.id === +id ? data : b)),
      }));
    },
    removeBook: async (id: string) => {
      set(state => ({
        books: state.books.filter(b => b.id !== +id),
      }));
      await deleteBook(id);
    },
  }),
  {
    name: 'books-slice',
  },
);
