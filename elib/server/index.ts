import fileUpload from 'express-fileupload';
import express from 'express';
import path from 'node:path';
import cors from 'cors';
import {
  CERTIFICATES_PATH,
  Certificate,
  BOOKS_PATH,
  Book,
  GENRES_PATH,
  Genre,
  AUTHORS_PATH,
  Author,
} from './constants';
import {
  updateItemJson,
  updateJson,
  deleteItem,
  checkItem,
  readJson,
} from './IO';

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '..', 'src', 'public')));

// Books
app.get('/books', async (req, res) => {
  try {
    const books = await readJson(BOOKS_PATH);
    res.json(books);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при получении книг' });
  }
});

app.post('/books', async (req, res) => {
  if (!req.files || !req.files.file || !req.files.poster) {
    return res.status(400).json({ message: 'Файлы не загружены' });
  }

  const file = req.files.file as fileUpload.UploadedFile;
  const poster = req.files.poster as fileUpload.UploadedFile;

  if (!file.name.endsWith('.epub')) {
    return res.status(400).json({ message: 'Загрузите файл в формате EPUB' });
  }

  if (!poster.name.endsWith('.jpg') && !poster.name.endsWith('.png')) {
    return res
      .status(400)
      .json({ message: 'Загрузите обложку в формате JPG или PNG' });
  }

  const authorIds = req.body.authorIds
    ? typeof req.body.authorIds === 'string'
      ? req.body.authorIds.split(',').map(Number)
      : Array.isArray(req.body.authorIds)
        ? req.body.authorIds.map(Number)
        : []
    : [];
  const genreIds = req.body.genreIds
    ? typeof req.body.genreIds === 'string'
      ? req.body.genreIds.split(',').map(Number)
      : Array.isArray(req.body.genreIds)
        ? req.body.genreIds.map(Number)
        : []
    : [];
  const authors = await readJson(AUTHORS_PATH);
  const genres = await readJson(GENRES_PATH);

  const bookData: Book = {
    id: 0, // Will be set by updateJson
    cover: `/images/covers/${poster.name}`,
    authors: authors.filter((a: Author) => authorIds.includes(a.id)),
    genres: genres.filter((g: Genre) => genreIds.includes(g.id)),
    name: req.body.name,
    path: `/books/${file.name}`,
  };

  if (await checkItem(bookData, BOOKS_PATH)) {
    return res
      .status(400)
      .json({ message: 'Книга с таким названием уже существует' });
  }

  try {
    await file.mv(path.join(__dirname, '..', 'src', 'public', file.name));
    await poster.mv(
      path.join(
        __dirname,
        '..',
        'src',
        'public',
        'images',
        'covers',
        poster.name,
      ),
    );
    const newBook = await updateJson(bookData, BOOKS_PATH);
    res.status(200).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при сохранении книги' });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
      return res.status(400).json({ message: 'Некорректный ID книги' });
    }

    const existingBooks = await readJson(BOOKS_PATH);
    const existingBook = existingBooks.find((b: Book) => b.id === bookId);
    if (!existingBook) {
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    const file = req.files?.file as fileUpload.UploadedFile | undefined;
    const poster = req.files?.poster as fileUpload.UploadedFile | undefined;
    const authorIds = req.body.authorIds
      ? typeof req.body.authorIds === 'string'
        ? req.body.authorIds.split(',').map(Number)
        : Array.isArray(req.body.authorIds)
          ? req.body.authorIds.map(Number)
          : existingBook.authors.map((a: Author) => a.id)
      : existingBook.authors.map((a: Author) => a.id);
    const genreIds = req.body.genreIds
      ? typeof req.body.genreIds === 'string'
        ? req.body.genreIds.split(',').map(Number)
        : Array.isArray(req.body.genreIds)
          ? req.body.genreIds.map(Number)
          : existingBook.genres.map((g: Genre) => g.id)
      : existingBook.genres.map((g: Genre) => g.id);
    const authors = await readJson(AUTHORS_PATH);
    const genres = await readJson(GENRES_PATH);

    const updatedBook: Book = {
      ...existingBook,
      cover: poster ? `/images/covers/${poster.name}` : existingBook.cover,
      authors: authors.filter((a: Author) => authorIds.includes(a.id)),
      genres: genres.filter((g: Genre) => genreIds.includes(g.id)),
      path: file ? `/books/${file.name}` : existingBook.path,
      name: req.body.name || existingBook.name,
      id: bookId,
    };

    if (file) {
      await file.mv(path.join(__dirname, '..', 'src', 'public', file.name));
    }
    if (poster) {
      await poster.mv(
        path.join(
          __dirname,
          '..',
          'src',
          'public',
          'images',
          'covers',
          poster.name,
        ),
      );
    }

    const result = await updateItemJson(updatedBook, BOOKS_PATH);
    res.status(200).json(result);
  } catch (e) {
    console.error('Ошибка при обновлении книги:', e);
    res.status(500).json({ message: 'Ошибка при обновлении книги' });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    await deleteItem(req.params.id, BOOKS_PATH);
    res.status(200).json({ message: 'Книга удалена' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при удалении книги' });
  }
});

// Certificates
app.get('/certificates', async (req, res) => {
  try {
    const certificates = await readJson(CERTIFICATES_PATH);
    res.json(certificates);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при получении сертификатов' });
  }
});

app.post('/certificates', async (req, res) => {
  if (!req.files || !req.files.img) {
    return res.status(400).json({ message: 'Изображение не загружено' });
  }

  const img = req.files.img as fileUpload.UploadedFile;

  if (!img.name.endsWith('.jpg') && !img.name.endsWith('.png')) {
    return res
      .status(400)
      .json({ message: 'Загрузите изображение в формате JPG или PNG' });
  }

  const certData: Certificate = {
    id: 0, // Will be set by updateJson
    name: req.body.name,
    text: req.body.text,
    img: `/images/posters/${img.name}`,
  };

  if (await checkItem(certData, CERTIFICATES_PATH)) {
    return res
      .status(400)
      .json({ message: 'Сертификат с таким названием уже существует' });
  }

  try {
    await img.mv(
      path.join(
        __dirname,
        '..',
        'src',
        'public',
        'images',
        'posters',
        img.name,
      ),
    );
    const newCert = await updateJson(certData, CERTIFICATES_PATH);
    res.status(200).json(newCert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при добавлении сертификата' });
  }
});

app.put('/certificates/:id', async (req, res) => {
  try {
    const certId = parseInt(req.params.id);
    if (isNaN(certId)) {
      return res.status(400).json({ message: 'Некорректный ID сертификата' });
    }

    const existingCerts = await readJson(CERTIFICATES_PATH);
    const existingCert = existingCerts.find(
      (c: Certificate) => c.id === certId,
    );
    if (!existingCert) {
      return res.status(404).json({ message: 'Сертификат не найден' });
    }

    const img = req.files?.img as fileUpload.UploadedFile | undefined;
    const updatedCert: Certificate = {
      ...existingCert,
      name: req.body.name || existingCert.name,
      text: req.body.text || existingCert.text,
      img: img ? `/images/posters/${img.name}` : existingCert.img,
      id: certId,
    };

    if (img) {
      await img.mv(
        path.join(
          __dirname,
          '..',
          'src',
          'public',
          'images',
          'certificates',
          img.name,
        ),
      );
    }

    const result = await updateItemJson(updatedCert, CERTIFICATES_PATH);
    res.status(200).json(result);
  } catch (e) {
    console.error('Ошибка при обновлении сертификата:', e);
    res.status(500).json({ message: 'Ошибка при обновлении сертификата' });
  }
});

app.delete('/certificates/:id', async (req, res) => {
  try {
    await deleteItem(req.params.id, CERTIFICATES_PATH);
    res.status(200).json({ message: 'Сертификат удален' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при удалении сертификата' });
  }
});

// Genres
app.get('/genres', async (req, res) => {
  try {
    const genres = await readJson(GENRES_PATH);
    res.json(genres);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при получении жанров' });
  }
});

// Authors
app.get('/authors', async (req, res) => {
  try {
    const authors = await readJson(AUTHORS_PATH);
    res.json(authors);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при получении авторов' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
