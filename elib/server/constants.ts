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

console.log(BOOKS_PATH);

export type Book = {
  author: string;
  title: string;
  cover: string;
  genre: string;
  path: string;
};
