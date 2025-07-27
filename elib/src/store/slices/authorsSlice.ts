import type { StateCreator } from 'zustand';
import type { Author } from '../../types';
import { devtools } from 'zustand/middleware';
import { Store } from '../store';
import { getAuthors } from '../../api/api';

export type AuthorsSlice = {
  authors: Author[];
  fetchAuthors: () => Promise<void>;
};

export const createAuthorsSlice: StateCreator<
  Store,
  [],
  [['zustand/devtools', never]],
  AuthorsSlice
> = devtools(
  set => ({
    authors: [],
    fetchAuthors: async () => {
      const data = await getAuthors();
      set({ authors: data });
    },
  }),
  {
    name: 'authors-slice',
  },
);
