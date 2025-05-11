import React from 'react';
import { useElibStore } from '../../store/store';
import { ProductCard } from '../features/ProductCard/ProductCard';
import type { Book } from '../../types';

export const MainPage = (): React.JSX.Element => {
  const books = useElibStore(store => store.books);

  const booksByGenre = React.useMemo(() => {
    console.log('Recalculating booksByGenre, books:', books);
    if (!books || books.length === 0) {
      console.log('No books to process');
      return {};
    }

    return books.reduce((acc: Record<string, Book[]>, book: Book) => {
      console.log('Processing book:', book);
      if (!Array.isArray(book.genres) || book.genres.length === 0) {
        console.log(`Book ${book.name} has no valid genres:`, book.genres);
        return acc;
      }

      book.genres.forEach(genre => {
        if (!genre?.name) {
          console.log(`Invalid genre in book ${book.name}:`, genre);
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

  console.log(Object.entries(booksByGenre));

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
    <main className="flex-1">
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
