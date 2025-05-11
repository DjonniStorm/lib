import type { StateCreator } from 'zustand';
import { Store } from '../store';

export type SharedSlice = {
  getBoth: () => Promise<void>;
};

export const createSharedSlice: StateCreator<Store, [], [], SharedSlice> = (
  _,
  get,
) => ({
  getBoth: async () => {
    const store = get();
    await store.fetchAuthors();
    await store.fetchGenres();
    await store.fetchBooks();
    await store.fetchCertificates();
  },
});
