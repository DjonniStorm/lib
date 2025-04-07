import fs from 'fs';

import { Certificate, Book, User } from './constants';

const BOOKS_PATH = './books.json';
const USERS_PATH = './users.json';
const CERTIFICATES_PATH = './certificates.json';

export async function updateItemJson<T>(item: T, path: string): Promise<T> {
  try {
    const data = await readJson<T>(path);
    console.log('Текущие данные в файле:', data);

    // Получаем ID из item
    const itemId = (item as any).id;
    console.log('ID для обновления:', itemId);

    // Проверяем ID
    if (typeof itemId !== 'number' || isNaN(itemId)) {
      throw new Error('Некорректный ID объекта');
    }

    // Ищем индекс элемента
    const indexToUpdate = data.findIndex((i: any) => i.id === itemId);
    console.log('Индекс для обновления:', indexToUpdate);

    if (indexToUpdate === -1) {
      throw new Error(`Элемент с ID ${itemId} не найден`);
    }

    // Обновляем данные
    const oldItem = data[indexToUpdate];
    console.log('Старые данные:', oldItem);
    console.log('Новые данные:', item);

    data[indexToUpdate] = item;

    // Записываем в файл
    const jsonString = JSON.stringify(data, null, 2);
    console.log('Записываем в файл:', jsonString);

    await fs.promises.writeFile(path, jsonString, 'utf8');

    return data[indexToUpdate] as T;
  } catch (error) {
    console.error('Ошибка при обновлении файла:', error);
    throw error;
  }
}

export async function updateJson<T>(item: Omit<T, 'id'>): Promise<boolean> {
  try {
    const path = getPathForType(item);
    const data = await readJson<T>(path);

    console.log('data', data);
    data.push({
      id: data.length + 1,
      ...item,
    });

    await fs.promises.writeFile(path, JSON.stringify(data, null, 2), 'utf8');

    return true;
  } catch (error) {
    console.error('Ошибка при обновлении файла', error);

    return false;
  }
}

export async function readJson<T>(path: string): Promise<T[]> {
  try {
    const data = await fs.promises.readFile(path, 'utf8');
    const jsonData = JSON.parse(data) as T[];

    console.log(jsonData);

    return jsonData;
  } catch (error) {
    console.error('Ошибка при чтении файла', error);

    return [];
  }
}

export async function checkItem<T>(item: Omit<T, 'id'>): Promise<boolean> {
  const items = await readJson<T>(getPathForType(item));

  return Array.isArray(items) && items.some(b => b.name === item.name);
}

function getPathForType<T>(item: T): string {
  if (isBook(item)) {
    return BOOKS_PATH;
  } else if (isUser(item)) {
    return USERS_PATH;
  } else if (isCertificate(item)) {
    return CERTIFICATES_PATH;
  }

  throw new Error('Unknown type');
}

function isUser(item: any): item is User {
  return (
    typeof item === 'object' &&
    item !== null &&
    'email' in item &&
    'card' in item &&
    typeof (item as any).email === 'string' &&
    typeof (item as any).card === 'string'
  );
}

function isCertificate(item: unknown): item is Certificate {
  return (
    typeof item === 'object' &&
    item !== null &&
    'img' in item &&
    typeof (item as any).img === 'string'
  );
}

function isBook(item: any): item is Book {
  return (
    typeof item === 'object' &&
    item !== null &&
    'genre' in item &&
    typeof (item as any).genre === 'string'
  );
}

export const deleteItem = async (id: string, path: string) => {
  try {
    const data = await readJson(path);

    console.log(
      id,
      'all data: ',
      data,
      data.filter(item => {
        console.log(
          'items:',
          item,
          id,
          typeof item,
          typeof id,
          typeof item.id,
          item.id === +id,
        );

        return item.id === +id;
      }),
    );
    await fs.promises.writeFile(
      path,
      JSON.stringify(
        data.filter(item => item.id !== +id),
        null,
        2,
      ),
      'utf8',
    );

    return true;
  } catch (e) {
    return false;
  }
};
