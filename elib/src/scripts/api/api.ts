import { getAllItems, createItem, updateItem, deleteItem } from './client';
import { Book, Certificate, Genre, Author } from '../../types';

export const getBooks = async (): Promise<Book[]> => getAllItems('books');
export const postBook = async (data: FormData): Promise<Book> =>
  createItem('books', data);
export const updateBook = async (data: FormData): Promise<Book> =>
  updateItem('books', data.get('id') as string, data);
export const deleteBook = async (id: string): Promise<void> =>
  deleteItem('books', id);

export const getCertificates = async (): Promise<Certificate[]> =>
  getAllItems('certificates');
export const postCertificate = async (data: FormData): Promise<Certificate> =>
  createItem('certificates', data);
export const updateCertificate = async (data: FormData): Promise<Certificate> =>
  updateItem('certificates', data.get('id') as string, data);
export const deleteCertificate = async (id: string): Promise<void> =>
  deleteItem('certificates', id);

export const getGenres = async (): Promise<Genre[]> => getAllItems('genres');
export const getAuthors = async (): Promise<Author[]> => getAllItems('authors');
