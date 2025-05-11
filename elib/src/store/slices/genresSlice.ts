import type { StateCreator } from 'zustand';
import type { Genre } from '../../types';
import { devtools } from 'zustand/middleware';
import { Store } from '../store';
import { getGenres } from '../../api/api';

export type GenresSlice = {
  genres: Genre[];
  fetchGenres: () => Promise<void>;
  isGenresLoaded: boolean;
};

export const createGenresSlice: StateCreator<
  Store,
  [],
  [['zustand/devtools', never]],
  GenresSlice
> = devtools(
  set => ({
    isGenresLoaded: false,
    genres: [],
    fetchGenres: async () => {
      set({ isGenresLoaded: false });
      const data = await getGenres();
      set({ genres: data, isGenresLoaded: true });
    },
  }),
  {
    name: 'genres-slice',
  },
);
