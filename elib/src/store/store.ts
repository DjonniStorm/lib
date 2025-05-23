import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { AuthorsSlice } from './slices/authorsSlice';
import type { GenresSlice } from './slices/genresSlice';
import type { BooksSlice } from './slices/booksSlice';
import type { CertificatesSlice } from './slices/certificatesSlice';
import type { SharedSlice } from './slices/sharedSlice';

export type Store = AuthorsSlice &
  GenresSlice &
  BooksSlice &
  CertificatesSlice &
  SharedSlice;

import { createAuthorsSlice } from './slices/authorsSlice';
import { createGenresSlice } from './slices/genresSlice';
import { createBooksSlice } from './slices/booksSlice';
import { createCertificatesSlice } from './slices/certificatesSlice';
import { createSharedSlice } from './slices/sharedSlice';

export const useElibStore = create<Store>()(
  subscribeWithSelector((...args) => ({
    ...createAuthorsSlice(...args),
    ...createGenresSlice(...args),
    ...createBooksSlice(...args),
    ...createCertificatesSlice(...args),
    ...createSharedSlice(...args),
  })),
);
