import fileUpload from 'express-fileupload';
import express from 'express';
import path from 'node:path';
import cors from 'cors';

import type { Book } from './constants';

import { updateJson, readJson } from './bookIO';

const app = express();

app.use(cors());
app.use(fileUpload());

app.post('/add-book', async (request: express.Request, response: any) => {
  if (!request.files || !request.files.file) {
    return response.status(400).send('Файл не загружен');
  }

  const file = request.files.file as fileUpload.UploadedFile;
  const poster = request.files.poster as fileUpload.UploadedFile;

  if (!file.name.endsWith('.epub')) {
    return response.status(400).json({
      message: 'Пожалуйста, загрузите файл в формате EPUB',
    });
  }

  if (!(poster.name.endsWith('.jpg') || poster.name.endsWith('.png'))) {
    return response.status(400).json({
      message: 'Пожалуйста, загрузите обложку в формате JPG или PNG',
    });
  }

  if (
    await checkBook({
      author: request.body.author,
      title: request.body.title,
      genre: request.body.genre,
      cover: poster.name,
      path: file.name,
    })
  ) {
    return response.status(400).json({
      message: 'Книга с таким названием уже существует',
    });
  }

  file.mv(path.join(__dirname, '..', 'src', 'public', file.name), err => {
    if (err) {
      console.error(err);

      return response.status(500).json({
        message: 'Ошибка при сохранении файла',
      });
    }
  });
  console.log(
    '1',
    path.join(
      __dirname,
      '..',
      'src',
      'public',
      'images',
      'covers',
      `/images/covers/${poster.name}`,
    ),
  );
  poster.mv(
    path.join(
      __dirname,
      '..',
      'src',
      'public',
      'images',
      'covers',
      `${poster.name}`,
    ),
    err => {
      if (err) {
        console.error(err);

        return response.status(500).json({
          message: 'Ошибка при сохранении обложки',
        });
      }
    },
  );

  await updateJson({
    cover: `/images/covers/${poster.name}`,
    author: request.body.author,
    title: request.body.title,
    genre: request.body.genre,
    path: file.name,
  });

  return response.status(200).json({
    message: 'Книга успешно загружена',
  });
});

app.get('/books', async (_request: express.Request, response: any) => {
  const books = await readJson();

  console.log('get books: books to send', books);

  return response.status(200).json(books);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

async function checkBook(book: Book) {
  const books = await readJson();

  return Array.isArray(books) && books.some(b => b.title === book.title);
}
