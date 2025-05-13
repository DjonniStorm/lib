import express, { type Request, type RequestHandler } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
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
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Books
app.get('/books', async (req, res) => {
  try {
    const books = (await readJson(BOOKS_PATH)) as Book[];
    const authors = await readJson(AUTHORS_PATH);
    const genres = await readJson(GENRES_PATH);

    const booksWithFullData = books.map(book => ({
      ...book,
      authors: book.authors
        .map(({ id: authorId }) =>
          authors.find((a: Author) => a.id === authorId),
        )
        .filter(Boolean),
      genres: book.genres
        .map(({ id: genreId }) => genres.find((g: Genre) => g.id === genreId))
        .filter(Boolean),
    }));

    res.json(booksWithFullData);
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

  let authors = [];
  let genres = [];

  // Пытаемся распарсить JSON-строки с авторами и жанрами
  if (req.body.authors) {
    try {
      authors = JSON.parse(req.body.authors);
      console.log('Parsed authors:', authors);
    } catch (e) {
      console.error('Error parsing authors:', e);
    }
  }

  if (req.body.genres) {
    try {
      genres = JSON.parse(req.body.genres);
      console.log('Parsed genres:', genres);
    } catch (e) {
      console.error('Error parsing genres:', e);
    }
  }

  const bookData: Book = {
    id: +(Math.random() * 1000).toFixed(0), // Will be set by updateJson
    cover: `/images/covers/${poster.name}`,
    authors,
    genres,
    name: req.body.name,
    path: `/books/${file.name}`,
  };

  if (await checkItem(bookData, BOOKS_PATH)) {
    return res
      .status(400)
      .json({ message: 'Книга с таким названием уже существует' });
  }

  try {
    await file.mv(path.join(__dirname, '..', 'public', file.name));
    await poster.mv(
      path.join(__dirname, '..', 'public', 'images', 'covers', poster.name),
    );
    const newBook = await updateJson(bookData, BOOKS_PATH);
    res.status(200).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при сохранении книги' });
  }
});

interface FileUploadRequest extends Request {
  files?: {
    [key: string]: fileUpload.UploadedFile | fileUpload.UploadedFile[];
  };
}

const putBookHandler: RequestHandler = async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) {
      res.status(400).json({ error: 'Invalid book ID' });
      return;
    }

    const existingBooks = (await readJson(BOOKS_PATH)) as Book[];
    const existingBook = existingBooks.find(b => b.id === bookId);

    if (!existingBook) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    const typedReq = req as FileUploadRequest;
    const coverFile = typedReq.files?.cover as
      | fileUpload.UploadedFile
      | undefined;

    let authors = existingBook.authors;
    let genres = existingBook.genres;

    if (req.body.authors) {
      try {
        authors = JSON.parse(req.body.authors);
        console.log('Parsed authors:', authors);
      } catch (e) {
        console.error('Error parsing authors:', e);
      }
    }

    if (req.body.genres) {
      try {
        genres = JSON.parse(req.body.genres);
        console.log('Parsed genres:', genres);
      } catch (e) {
        console.error('Error parsing genres:', e);
      }
    }

    const updatedBook: Book = {
      id: bookId,
      name: req.body.name || existingBook.name,
      authors,
      genres,
      cover: coverFile
        ? `/images/covers/${coverFile.name}`
        : existingBook.cover,
      path: existingBook.path,
    };

    if (coverFile) {
      await coverFile.mv(
        path.join(
          __dirname,
          '..',
          'public',
          'images',
          'covers',
          coverFile.name,
        ),
      );
    }

    const result = await updateItemJson(updatedBook, BOOKS_PATH);
    res.json(result);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};

app.put('/books/:id', putBookHandler);

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
      path.join(__dirname, '..', 'public', 'images', 'posters', img.name),
    );
    const newCert = await updateJson(certData, CERTIFICATES_PATH);
    res.status(200).json(newCert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при добавлении сертификата' });
  }
});

const getCertificateHandler: RequestHandler = async (req, res) => {
  try {
    const certificateId = parseInt(req.params.id);
    if (isNaN(certificateId)) {
      res.status(400).json({ error: 'Invalid certificate ID' });
      return;
    }

    const certificates = (await readJson(CERTIFICATES_PATH)) as Certificate[];
    const certificate = certificates.find(
      (c: Certificate) => c.id === certificateId,
    );

    if (!certificate) {
      res.status(404).json({ error: 'Certificate not found' });
      return;
    }

    res.json({
      id: certificate.id,
      text: certificate.text,
      img: certificate.img,
    });
  } catch (error) {
    console.error('Error getting certificate:', error);
    res.status(500).json({ error: 'Failed to get certificate' });
  }
};

app.get('/certificates/:id', getCertificateHandler);

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
