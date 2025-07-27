import React from 'react';
import { useElibStore } from '../../store/store';
import { ProductCard } from '../features/ProductCard/ProductCard';
import type { Book } from '../../types';

export const MainPage = (): React.JSX.Element => {
  const books = useElibStore(store => store.books);

  const booksByGenre = React.useMemo(() => {
    console.log('Recalculating booksByGenre, books:', books);
    if (!books || books.length === 0) {
      return {};
    }

    return books.reduce((acc: Record<string, Book[]>, book: Book) => {
      if (!Array.isArray(book.genres) || book.genres.length === 0) {
        return acc;
      }

      book.genres.forEach(genre => {
        if (!genre?.name) {
          return;
        }
        if (!acc[genre.name]) {
          acc[genre.name] = [];
        }
        acc[genre.name].push(book);
      });
      return acc;
    }, {});
  }, [books]);

  React.useEffect(() => {
    const unsub = () => {
      if (books.length === 0) {
        const addBooks = useElibStore.getState().fetchBooks;
        addBooks();
      }
    };
    return unsub;
  }, []);

  return (
    <main className="flex-1 p-4">
      {Object.entries(booksByGenre).map(([genre, books]) => (
        <React.Fragment key={genre}>
          <div className="main-content__heading-block">
            <h2 className="text-3xl">{genre}</h2>
            <hr />
          </div>
          <div className="main-content__books">
            {books.map(book => (
              <ProductCard
                key={book.id}
                name={book.name}
                image={book.cover}
                link={`/books/${book.id}`}
                icon="/images/icons/add.svg"
              />
            ))}
          </div>
        </React.Fragment>
      ))}
    </main>
  );
};
