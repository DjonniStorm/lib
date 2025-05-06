import type { Book } from '../../types';
import { getBooks, getGenres } from '../api/api';

document.addEventListener('DOMContentLoaded', async () => {
  const books = await getBooks();
  const genres = await getGenres();

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

    card.setAttribute('name', book.name);
    card.setAttribute('link', '/');
    card.setAttribute('img', book.cover);

    // Для каждой книги перебираем все её жанры
    book.genres.forEach(genre => {
      const genreObj = genres.find(g => g.id === genre.id);
      if (!genreObj) return;
      if (!booksByGenre[genreObj.name]) {
        booksByGenre[genreObj.name] = [card];
      } else {
        booksByGenre[genreObj.name].push(card);
      }
    });
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
