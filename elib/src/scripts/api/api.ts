import { SERVER_URL } from './consts';

export const getItems = async <T>(uri: string): Promise<T[]> => {
  try {
    const res = await fetch(`${SERVER_URL}${uri}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch ${uri}`);
    }

    return await res.json();
  } catch (e) {
    console.error(`Failed to load ${uri}`, e);

    return [];
  }
};

export const postItem = async <T>(
  uri: string,
  item: FormData | T,
): Promise<T> => {
  try {
    const options: RequestInit = { method: 'POST' };

    if (item instanceof FormData) {
      options.body = item; // Для multipart/form-data заголовок не нужен
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(item);
    }

    const res = await fetch(`${SERVER_URL}${uri}`, options);

    if (!res.ok) {
      throw new Error(`Failed to post ${uri}`);
    }

    return await res.json();
  } catch (e) {
    console.error(`Failed to post ${uri}`, e);
    throw e;
  }
};

export const deleteItem = async (uri: string, id: string): Promise<void> => {
  try {
    const res = await fetch(`${SERVER_URL}${uri}/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      throw new Error(`Failed to delete ${uri}`);
    }
  } catch (e) {
    console.error(`Failed to delete ${uri}`, e);
    throw e;
  }
};

export const updateItem = async <T>(
  uri: string,
  item: FormData | T,
): Promise<T> => {
  try {
    const options: RequestInit = { method: 'PUT' };

    if (item instanceof FormData) {
      options.body = item;
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(item);
    }

    const res = await fetch(`${SERVER_URL}${uri}`, options);

    if (!res.ok) {
      throw new Error(`Failed to update ${uri}`);
    }

    return await res.json();
  } catch (e) {
    console.error(`Failed to update ${uri}`, e);
    throw e;
  }
};

// Специфичные функции
export const getBooks = () => getItems<Book>('/books');

export const postBook = (book: FormData) => postItem<Book>('/add-book', book);

export const deleteBook = (id: string) => deleteItem('/delete-book', id);

export const updateBook = (book: FormData) =>
  updateItem<Book>('/update-book', book);

export const getUsers = () => getItems<User>('/users');

export const postUser = (user: User) => postItem<User>('/add-user', user);

export const deleteUser = (id: string) => deleteItem('/delete-user', id);

export const updateUser = (user: FormData) =>
  updateItem<User>('/update-user', user);

export const getCertificates = () => getItems<Certificate>('/certificates');

export const postCertificate = (certificate: FormData) =>
  postItem<Certificate>('/add-certificate', certificate);

export const deleteCertificate = (id: string) =>
  deleteItem('/delete-certificate', id);

export const updateCertificate = (certificate: FormData) =>
  updateItem<Certificate>('/update-certificate', certificate);
