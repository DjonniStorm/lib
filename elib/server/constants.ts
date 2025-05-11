import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BOOKS_PATH = path.join(
  __dirname,
  '..',
  'src',
  'public',
  'books.json',
);

export const CERTIFICATES_PATH = path.join(
  __dirname,
  '..',
  'src',
  'public',
  'certificates.json',
);

export const GENRES_PATH = path.join(
  __dirname,
  '..',
  'src',
  'public',
  'genres.json',
);

export const AUTHORS_PATH = path.join(
  __dirname,
  '..',
  'src',
  'public',
  'authors.json',
);

export interface Book {
  authors: Author[];
  genres: Genre[];
  cover: string;
  name: string;
  path: string;
  id: number;
}

export interface Certificate {
  name: string;
  text: string;
  img: string;
  id: number;
}

export interface Author {
  name: string;
  id: number;
}

export interface Genre {
  name: string;
  id: number;
}
