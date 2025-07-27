import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactReader } from 'react-reader';

export const BookPage = (): React.JSX.Element => {
  const [searchParams] = useSearchParams();
  const [location, setLocation] = React.useState<string | number>(0);
  const bookPath = `/${searchParams.get('book')?.trim().replace('-', '')}.epub`;
  console.log(bookPath);
  return (
    <main className="flex-1">
      <div style={{ height: '100vh' }}>
        <ReactReader
          url={bookPath ?? ''}
          location={location}
          locationChanged={(epubcfi: string) => setLocation(epubcfi)}
        />
      </div>
    </main>
  );
};
