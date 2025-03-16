import { Book } from '../../../server/constants';

document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('http://localhost:3000/books');

  console.log(response);

  if (!response.ok) {
    console.warn('Ошибка при получении книг', await response.text());

    return;
  }

  const books = await response.json();

  console.log(books, Object.keys(books).length);

  if (!books || Object.keys(books).length === 0) {
    console.warn('Книги не найдены');

    return;
  }

  const container = document.querySelector('.main-content');

  const booksByGenre: Record<string, HTMLElement[]> = {};

  console.log(container);
  books.forEach((book: Book) => {
    const card = document.createElement('product-card');

    card.setAttribute('name', book.title);
    card.setAttribute('link', '/');
    card.setAttribute('img', book.cover);

    if (!booksByGenre[book.genre]) {
      booksByGenre[book.genre] = [card];

      return;
    }

    booksByGenre[book.genre].push(card);
  });

  console.log(booksByGenre);

  Object.entries(booksByGenre).forEach(([genre, books]) => {
    const genreContainer = document.createElement('section');

    genreContainer.innerHTML = `
      <div class="main-content__heading-block">
        <h2>${genre}</h2>
        <hr />
      </div>
      <div class="main-content__books">
        ${books.map(book => book.outerHTML).join('')}
      </div>
    `;
    console.log(genre, books);

    container?.appendChild(genreContainer);
  });
});
