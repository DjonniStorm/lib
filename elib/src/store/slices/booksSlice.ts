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
  removeBook: (id: number) => Promise<void>;
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
      console.log('adding new book', Object.entries(book));
      const data = Object.fromEntries(book) as any;
      const newBook: Book = {
        id: data.id,
        name: data.name,
        authors: JSON.parse(data.authors),
        genres: JSON.parse(data.genres),
        cover: data.poster.name,
        path: data.file.name,
      };
      set(state => ({
        books: [...state.books, newBook],
      }));
      // await get().fetchBooks();

      // await postBook(book);

      return Promise.resolve(newBook);
    },
    updateBook: async (id: number, book: FormData) => {
      const data = Object.fromEntries(book) as any;
      set(state => ({
        books: state.books.map(b => {
          if (b.id === id) {
            const newBookVersion: Book = {
              id: id,
              name: data.name || b.name,
              authors: JSON.parse(data.authors) || b.authors,
              genres: JSON.parse(data.genres) || b.genres,
              cover: data.poster || b.cover,
              path: data.file || b.path,
            };

            return newBookVersion;
          }
          return b;
        }),
      }));

      // await updateBookAPI(book);
    },
    removeBook: async (id: number) => {
      set(state => ({
        books: state.books.filter(b => b.id !== id),
      }));
      // await deleteBook(id.toFixed());
    },
  }),
  {
    name: 'books-slice',
  },
);
