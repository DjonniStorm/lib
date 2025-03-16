import fs from 'node:fs';

import { BOOKS_PATH, Book } from './constants';

export async function updateJson(book: Book) {
  try {
    const data = await readJson();

    console.log('data', data);
    data.push(book);

    await fs.promises.writeFile(
      BOOKS_PATH,
      JSON.stringify(data, null, 2),
      'utf8',
    );

    return true;
  } catch (error) {
    console.error('Ошибка при обновлении файла', error);

    return false;
  }
}

export async function readJson() {
  try {
    const data = await fs.promises.readFile(BOOKS_PATH, 'utf8');
    const jsonData = JSON.parse(data) as Book[];

    console.log(jsonData);

    return jsonData;
  } catch (error) {
    console.error('Ошибка при чтении файла', error);

    return [];
  }
}
