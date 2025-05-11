import fs from 'fs/promises';

import type { Certificate, Author, Genre, Book } from './constants';

export async function updateItemJson(
  item: Certificate | Book,
  path: string,
): Promise<Certificate | Book> {
  try {
    console.log(
      `Updating entity of type: ${getEntityType(item)} at path: ${path}`,
    );

    const data = await readJson(path);
    const itemId = item.id;

    if (typeof itemId !== 'number' || isNaN(itemId)) {
      throw new Error('Некорректный ID объекта');
    }

    const indexToUpdate = data.findIndex(
      (i: Certificate | Book) => i.id === itemId,
    );

    if (indexToUpdate === -1) {
      throw new Error(`Элемент с ID ${itemId} не найден`);
    }

    data[indexToUpdate] = item;
    await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8');

    return data[indexToUpdate];
  } catch (error) {
    console.error('Ошибка при обновлении файла:', error);
    throw error;
  }
}

export async function updateJson(
  item: Certificate | Book,
  path: string,
): Promise<Certificate | Book> {
  try {
    console.log(
      `Adding entity of type: ${getEntityType(item)} at path: ${path}`,
    );

    const data = await readJson(path);

    const newItem = {
      id: data.length
        ? Math.max(...data.map((i: Certificate | Book) => i.id)) + 1
        : Math.random() * 10,
      ...item,
    };
    data.push(newItem);
    await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8');

    return newItem;
  } catch (error) {
    console.error('Ошибка при обновлении файла:', error);
    throw error;
  }
}

export async function deleteItem(id: string, path: string): Promise<void> {
  try {
    const data = await readJson(path);

    const filteredData = data.filter(
      (item: Certificate | Book) => item.id !== parseInt(id),
    );
    await fs.writeFile(path, JSON.stringify(filteredData, null, 2), 'utf8');
  } catch (error) {
    console.error('Ошибка при удалении элемента:', error);
    throw error;
  }
}

export async function readJson(
  path: string,
): Promise<(Certificate | Author | Genre | Book)[]> {
  try {
    const data = await fs.readFile(path, 'utf8');

    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);

    return [];
  }
}

export async function checkItem(
  item: Certificate | Book,
  path: string,
): Promise<boolean> {
  const items = await readJson(path);

  return items.some((i: Certificate | Book) => i.name === item.name);
}

function getEntityType(item: Certificate | Book): string {
  if ('authors' in item && 'genres' in item) {
    return 'Book';
  }

  if ('img' in item && 'text' in item) {
    return 'Certificate';
  }

  return 'Unknown';
}
