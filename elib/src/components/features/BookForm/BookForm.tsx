import React from 'react';
import { useForm } from 'react-hook-form';
import { useElibStore } from '../../../store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormDataEdit,
  formDataSchemaEdit,
  FormDataAdd,
  formDataSchemaAdd,
} from './formDataSchema';
import type { Book } from '../../../types';
import { Button } from '../../ui/Button';
import {
  AuthorsCheckboxesEdit,
  AuthorsCheckboxesAdd,
} from './AuthorCheckboxes';
import { GenresCheckboxesEdit, GenresCheckboxesAdd } from './GenreCheckboxes';

type Props = {
  initialValue?: Book;
  handleEditAndAdd: () => void;
};

export const BookForm = ({
  initialValue,
  handleEditAndAdd,
}: Props): React.JSX.Element => {
  const isEditing = !!initialValue;
  console.log('rerender BookForm', initialValue);
  const {
    control: controlEdit,
    register: registerEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
    handleSubmit: handleSubmitEdit,
  } = useForm<FormDataEdit>({
    resolver: zodResolver(formDataSchemaEdit),
  });

  const {
    control: controlAdd,
    register: registerAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
    handleSubmit: handleSubmitAdd,
  } = useForm<FormDataAdd>({
    resolver: zodResolver(formDataSchemaAdd),
  });

  const register = isEditing ? registerEdit : registerAdd;
  const errors = isEditing ? errorsEdit : errorsAdd;
  const reset = isEditing ? resetEdit : resetAdd;

  const authors = useElibStore(state => state.authors);
  const genres = useElibStore(state => state.genres);
  const updateBook = useElibStore(state => state.updateBook);
  const createBook = useElibStore(state => state.addBook);

  React.useEffect(() => {
    console.log('rerender, initial: ', initialValue);

    if (initialValue) {
      const authorIds = Array.isArray(initialValue.authors)
        ? initialValue.authors.map(author => author.id)
        : [];

      const genreIds = Array.isArray(initialValue.genres)
        ? initialValue.genres.map(genre => genre.id)
        : [];

      console.log('Извлеченные ID авторов:', authorIds);
      console.log('Извлеченные ID жанров:', genreIds);

      resetEdit({
        id: initialValue.id.toString(),
        name: initialValue.name,
        authorIds,
        genreIds,
        cover: undefined,
        file: undefined,
      });
    } else {
      resetAdd({
        id: Date.now().toString(),
        name: '',
        authorIds: [],
        genreIds: [],
        cover: undefined,
        file: undefined,
      });
    }
  }, [initialValue, resetEdit, resetAdd]);

  const processFormData = (data: FormDataEdit | FormDataAdd) => {
    console.log('Данные формы перед отправкой:', data);

    const formData = new FormData();
    formData.append('id', data.id || Date.now().toString());
    if (data.name) formData.append('name', data.name);

    if (data.authorIds && data.authorIds.length > 0) {
      const authorObjects = data.authorIds.map(authorId => {
        const author = authors.find(a => a.id === authorId);
        return {
          id: authorId,
          name: author ? author.name : 'Неизвестный автор',
        };
      });
      formData.append('authors', JSON.stringify(authorObjects));
    } else {
      formData.append('authors', JSON.stringify([]));
    }

    if (data.genreIds && data.genreIds.length > 0) {
      const genreObjects = data.genreIds.map(genreId => {
        const genre = genres.find(g => g.id === genreId);
        return {
          id: genreId,
          name: genre ? genre.name : 'Неизвестный жанр',
        };
      });
      formData.append('genres', JSON.stringify(genreObjects));
    } else {
      formData.append('genres', JSON.stringify([]));
    }

    if (data.cover) formData.append('poster', data.cover);
    if (data.file) formData.append('file', data.file);

    console.log(
      'FormData для отправки:',
      Object.fromEntries(formData.entries()),
    );

    return formData;
  };

  const handleSubmitEditForm = async (data: FormDataEdit) => {
    try {
      const formData = processFormData(data);
      await updateBook(+data.id, formData);
      // console.log('Книга успешно обновлена');
      // refreshBooksList();
      reset({
        id: Date.now().toString(),
        name: '',
        authorIds: [],
        genreIds: [],
        cover: undefined,
        file: undefined,
      });

      handleEditAndAdd();
    } catch (error) {
      console.error('Ошибка при обновлении книги:', error);
      alert(error);
    }
  };

  const handleSubmitAddForm = async (data: FormDataAdd) => {
    try {
      const formData = processFormData(data);
      await createBook(formData);
      // refreshBooksList();
      reset({
        id: Date.now().toString(),
        name: '',
        authorIds: [],
        genreIds: [],
        cover: undefined,
        file: undefined,
      });
      handleEditAndAdd();
    } catch (error) {
      console.error('Ошибка при создании книги:', error);
      alert(error);
    }
  };

  const refreshBooksList = async () => {
    const fetchBooks = useElibStore.getState().fetchBooks;
    if (typeof fetchBooks === 'function') {
      try {
        await fetchBooks();
        console.log('Список книг обновлен');
      } catch (refreshError) {
        console.error('Ошибка при обновлении списка книг:', refreshError);
      }
    }
  };

  return (
    <form
      onSubmit={
        isEditing
          ? handleSubmitEdit(handleSubmitEditForm)
          : handleSubmitAdd(handleSubmitAddForm)
      }
      className="flex flex-col gap-4 border rounded p-4 w-[700px] mx-auto shadow-lg space-y-6"
    >
      <input type="hidden" {...register('id')} />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Название:
        </label>
        <input
          {...register('name')}
          placeholder="Введите название"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required={!isEditing}
        />
        {errors.name && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.name.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Авторы:
        </label>
        {isEditing ? (
          <AuthorsCheckboxesEdit control={controlEdit} authors={authors} />
        ) : (
          <AuthorsCheckboxesAdd control={controlAdd} authors={authors} />
        )}
        {errors.authorIds && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.authorIds.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Жанры:
        </label>
        {isEditing ? (
          <GenresCheckboxesEdit control={controlEdit} genres={genres} />
        ) : (
          <GenresCheckboxesAdd control={controlAdd} genres={genres} />
        )}
        {errors.genreIds && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.genreIds.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Обложка:
        </label>
        {initialValue?.cover && (
          <div className="text-sm text-gray-500 mb-2">
            Текущая обложка: {initialValue.cover.split('/').pop()}
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png"
          {...register('cover')}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray file:text-gray-700 hover:file:bg-main"
          required={!isEditing}
        />
        {errors.cover && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.cover.message?.toString()}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Файл книги:
        </label>
        {initialValue?.path && (
          <div className="text-sm text-gray-500 mb-2">
            Текущий файл: {initialValue.path.split('/').pop()}
          </div>
        )}
        <input
          type="file"
          accept=".epub"
          {...register('file')}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray file:text-gray-700 hover:file:bg-main"
          required={!isEditing}
        />
        {errors.file && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.file.message?.toString()}
          </span>
        )}
      </div>

      <div className="mx-auto">
        <Button className="max-w-[200px] w-50" type="submit">
          {isEditing ? 'Обновить' : 'Добавить'}
        </Button>
      </div>
    </form>
  );
};
