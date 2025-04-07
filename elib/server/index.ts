// src/server.ts
import fileUpload from 'express-fileupload';
import express from 'express';
import path from 'node:path';
import cors from 'cors';

import {
  CERTIFICATES_PATH,
  Certificate,
  BOOKS_PATH,
  USERS_PATH,
  Book,
  User,
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
app.use(express.json()); // Для обработки JSON в PUT-запросах

// Books
app.get('/books', async (req, res) => {
  try {
    const books = await readJson<Book>(BOOKS_PATH);

    res.json(books);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при получении книг' });
  }
});

app.post('/add-book', async (req, res) => {
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

  const bookData: Omit<Book, 'id'> = {
    cover: `/images/covers/${poster.name}`,
    author: req.body.author,
    genre: req.body.genre,
    name: req.body.name,
    path: file.name,
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

    const newBook = await updateJson<Book>(bookData);

    res.status(200).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при сохранении книги' });
  }
});

app.delete('/delete-book/:id', async (req, res) => {
  try {
    await deleteItem(req.params.id, BOOKS_PATH);
    console.log('delete: ', req.params);
    res.status(200).json({ message: 'Книга удалена' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при удалении книги' });
  }
});

app.put('/update-book', async (req, res) => {
  try {
    console.log('=== Начало обработки запроса update-book ===');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    console.log('typeof req.body.id:', typeof req.body.id);
    console.log('req.body.id:', req.body.id);

    // Проверяем наличие ID в запросе
    const bookId = parseInt(req.body.id);
    console.log('parsed bookId:', bookId);

    if (isNaN(bookId)) {
      console.log('ID некорректный, отправляем bad request');
      return res.status(400).json({ message: 'Некорректный ID книги' });
    }

    // Получаем существующую книгу
    const existingBooks = await readJson<Book>(BOOKS_PATH);
    console.log('Существующие книги:', existingBooks);

    const existingBook = existingBooks.find(b => b.id === bookId);
    console.log('Найденная книга:', existingBook);

    if (!existingBook) {
      console.log('Книга не найдена, отправляем 404');
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    // Получаем файлы из FormData, если они есть
    const file = req.files?.file as fileUpload.UploadedFile | undefined;
    const poster = req.files?.poster as fileUpload.UploadedFile | undefined;

    // Создаем объект обновленной книги, сохраняя существующие значения
    const updatedBook: Book = {
      ...existingBook,
      // Обновляем обложку, только если пришел новый постер
      cover: poster ? `/images/covers/${poster.name}` : existingBook.cover,
      author: req.body.author || existingBook.author,
      genre: req.body.genre || existingBook.genre,
      // Обновляем путь к файлу, только если пришел новый файл
      path: file ? file.name : existingBook.path,
      // Обновляем только те поля, которые пришли в запросе
      name: req.body.name || existingBook.name,
      id: bookId, // Гарантируем, что ID останется тем же
    };

    // Сохраняем новые файлы, если они есть
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

    console.log('Обновление книги:', {
      существующая: existingBook,
      обновленная: updatedBook,
    });

    // Обновляем запись в JSON
    const result = await updateItemJson(updatedBook, BOOKS_PATH);

    res.status(200).json(result);
  } catch (e) {
    console.error('Ошибка при обновлении книги:', e);
    res.status(500).json({ message: 'Ошибка при обновлении книги' });
  }
});

// Users
app.get('/users', async (req, res) => {
  try {
    const users = await readJson<User>(USERS_PATH);

    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
});

app.post('/add-user', async (req, res) => {
  const userData: Omit<User, 'id'> = {
    certificates: req.body.certificates || [],
    password: req.body.password,
    books: req.body.books || [],
    email: req.body.email,
    name: req.body.name,
    card: req.body.card,
  };

  if (await checkItem(userData, USERS_PATH)) {
    return res
      .status(400)
      .json({ message: 'Пользователь с таким именем уже существует' });
  }

  try {
    const newUser = await updateJson<User>(userData, USERS_PATH);

    res.status(200).json(newUser);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при добавлении пользователя' });
  }
});

app.delete('/delete-user/:id', async (req, res) => {
  try {
    await deleteItem(req.params.id, USERS_PATH);
    res.status(200).json({ message: 'Пользователь удален' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при удалении пользователя' });
  }
});

app.put('/update-user', async (req, res) => {
  try {
    const userId = parseInt(req.body.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Некорректный ID пользователя' });
    }

    // Получаем существующего пользователя
    const existingUsers = await readJson<User>(USERS_PATH);
    const existingUser = existingUsers.find(u => u.id === userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновляем только те поля, которые пришли в запросе
    const updatedUser: User = {
      ...existingUser,
      id: userId,
      name: req.body.name || existingUser.name,
      email: req.body.email || existingUser.email,
      card: req.body.card || existingUser.card,
      password: req.body.password || existingUser.password,
      books: req.body.books ? JSON.parse(req.body.books) : existingUser.books,
      certificates: req.body.certificates
        ? JSON.parse(req.body.certificates)
        : existingUser.certificates,
    };

    const result = await updateItemJson(updatedUser, USERS_PATH);
    res.status(200).json(result);
  } catch (e) {
    console.error('Ошибка при обновлении пользователя:', e);
    res.status(500).json({ message: 'Ошибка при обновлении пользователя' });
  }
});

// Certificates
app.get('/certificates', async (req, res) => {
  try {
    const certificates = await readJson<Certificate>(CERTIFICATES_PATH);

    res.json(certificates);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при получении сертификатов' });
  }
});

app.post('/add-certificate', async (req, res) => {
  const certData: Omit<Certificate, 'id'> = {
    name: req.body.name,
    text: req.body.text,
    img: req.body.img,
  };

  if (await checkItem(certData, CERTIFICATES_PATH)) {
    return res
      .status(400)
      .json({ message: 'Сертификат с таким названием уже существует' });
  }

  try {
    const newCert = await updateJson<Certificate>(certData, CERTIFICATES_PATH);

    res.status(200).json(newCert);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при добавлении сертификата' });
  }
});

app.delete('/delete-certificate/:id', async (req, res) => {
  try {
    await deleteItem(req.params.id, CERTIFICATES_PATH);
    res.status(200).json({ message: 'Сертификат удален' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при удалении сертификата' });
  }
});

app.put('/update-certificate', async (req, res) => {
  try {
    const certId = parseInt(req.body.id);
    if (isNaN(certId)) {
      return res.status(400).json({ message: 'Некорректный ID сертификата' });
    }

    // Получаем существующий сертификат
    const existingCerts = await readJson<Certificate>(CERTIFICATES_PATH);
    const existingCert = existingCerts.find(c => c.id === certId);

    if (!existingCert) {
      return res.status(404).json({ message: 'Сертификат не найден' });
    }

    // Обрабатываем загруженное изображение, если оно есть
    let imgPath = existingCert.img;
    if (req.files && req.files.img) {
      const img = req.files.img as fileUpload.UploadedFile;
      imgPath = `/images/certificates/${img.name}`;
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

    // Обновляем только те поля, которые пришли в запросе
    const updatedCert: Certificate = {
      ...existingCert,
      id: certId,
      name: req.body.name || existingCert.name,
      text: req.body.text || existingCert.text,
      img: imgPath,
    };

    const result = await updateItemJson(updatedCert, CERTIFICATES_PATH);
    res.status(200).json(result);
  } catch (e) {
    console.error('Ошибка при обновлении сертификата:', e);
    res.status(500).json({ message: 'Ошибка при обновлении сертификата' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
