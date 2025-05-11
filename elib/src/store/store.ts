import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Импортируем типы слайсов
import type { AuthorsSlice } from './slices/authorsSlice';
import type { GenresSlice } from './slices/genresSlice';
import type { BooksSlice } from './slices/booksSlice';
import type { CertificatesSlice } from './slices/certificatesSlice';
import type { SharedSlice } from './slices/sharedSlice';

// Определяем тип Store как комбинацию всех слайсов
export type Store = AuthorsSlice &
  GenresSlice &
  BooksSlice &
  CertificatesSlice &
  SharedSlice;

// Импортируем функции создания слайсов
import { createAuthorsSlice } from './slices/authorsSlice';
import { createGenresSlice } from './slices/genresSlice';
import { createBooksSlice } from './slices/booksSlice';
import { createCertificatesSlice } from './slices/certificatesSlice';
import { createSharedSlice } from './slices/sharedSlice';

// Создаем хранилище, соблюдая порядок инициализации слайсов
export const useElibStore = create<Store>()(
  subscribeWithSelector((...args) => ({
    // Сначала базовые слайсы
    ...createAuthorsSlice(...args),
    ...createGenresSlice(...args),
    // Затем слайсы, зависящие от базовых
    ...createBooksSlice(...args),
    ...createCertificatesSlice(...args),
    // В конце общий слайс
    ...createSharedSlice(...args),
  })),
);
