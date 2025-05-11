import React from 'react';
import { BookForm } from '../BookForm/BookForm';
import type { Certificate, Book, List } from '../../../types';

type Props = {
  initialValue?: Book | Certificate;
  currentList: List;
};

export const AdminForm = ({
  initialValue,
  currentList,
}: Props): React.JSX.Element => {
  return <>{currentList == 'books' && <BookForm></BookForm>}</>;
};
