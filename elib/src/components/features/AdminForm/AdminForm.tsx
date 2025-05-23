import React from 'react';
import { BookForm } from '../BookForm/BookForm';
import type { Certificate, Book, List } from '../../../types';
import { CertificateForm } from '../CertificateForm/CertificateForm';

type Props = {
  initialValue?: Book | Certificate;
  currentList: List;
  handleEditAndAdd: () => void;
};

export const AdminForm = ({
  initialValue,
  currentList,
  handleEditAndAdd,
}: Props): React.JSX.Element => {
  console.log(initialValue);
  return (
    <>
      {currentList == 'books' && (
        <BookForm
          handleEditAndAdd={handleEditAndAdd}
          initialValue={initialValue}
        />
      )}
      {currentList == 'certificates' && (
        <CertificateForm initialValue={initialValue} />
      )}
      {currentList !== 'books' && currentList !== 'certificates' && (
        <p>не знаю что это такое</p>
      )}
    </>
  );
};
