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

export const USERS_PATH = path.join(
  __dirname,
  '..',
  'src',
  'public',
  'users.json',
);

export const CERTIFICATES_PATH = path.join(
  __dirname,
  '..',
  'src',
  'public',
  'certificates.json',
);

export type User = {
  certificates: Certificate[];
  password: string;
  email: string;
  books: Book[];
  name: string;
  card: string;
  id: number;
};

export type Book = {
  author: string;
  cover: string;
  genre: string;
  name: string;
  path: string;
  id: number;
};

export type Certificate = {
  name: string;
  text: string;
  img: string;
  id: number;
};

console.log(BOOKS_PATH);
