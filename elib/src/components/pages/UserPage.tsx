import React from 'react';
import { ProductCard } from '../features/ProductCard/ProductCard';

export const UserPage = (): React.JSX.Element => {
  return (
    <main className="flex-1">
      <section>
        <div className="main-content__heading-block">
          <h2>
            Ваши книги, <span className="text-red-500">user</span>
          </h2>
          <hr />
        </div>
        <div className="main-content__books">
          <ProductCard
            link={'/book?book=harry-potter'}
            image={'/images/covers/harrypotter.jpg'}
            icon={'/images/icons/add.svg'}
            name={'Гарри Поттер и философский камень'}
          />
        </div>
      </section>
    </main>
  );
};
