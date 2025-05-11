import React from 'react';
import { useElibStore } from '../../store/store';
import { ProductCard } from '../features/ProductCard/ProductCard';

export const MainPage = (): React.JSX.Element => {
  const { books, addBooks } = useElibStore();

  const booksByGenre = React.useMemo(() => {
    return books.reduce((acc, book) => {
      const genre = book.genre || 'Unknown';
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(book);
      return acc;
    }, {} as Record<string, Book[]>);
  }, [books]);

  React.useEffect(() => {
    if (books.length === 0) {
      addBooks();
    }
  }, [books, addBooks]);

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
