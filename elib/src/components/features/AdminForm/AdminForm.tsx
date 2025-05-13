import React from 'react';
import { BookForm } from '../BookForm/BookForm';
import type { Certificate, Book, List } from '../../../types';
import { CertificateForm } from '../CertificateForm/CertificateForm';

type Props = {
  initialValue?: Book | Certificate;
  currentList: List;
};

export const AdminForm = ({
  initialValue,
  currentList,
}: Props): React.JSX.Element => {
  console.log(initialValue);
  return (
    <>
      {currentList == 'books' && <BookForm initialValue={initialValue} />}
      {currentList == 'certificates' && (
        <CertificateForm initialValue={initialValue} />
      )}
      {currentList !== 'books' && currentList !== 'certificates' && (
        <p>не знаю что это такое</p>
      )}
    </>
  );
};
