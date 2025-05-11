import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useElibStore } from '../../../store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDataEdit, formDataSchemaEdit } from './formDataSchema';
import type { Book } from '../../../types';

type Props = {
  initialValue?: Book;
};

export const BookForm = ({ initialValue }: Props): React.JSX.Element => {
  const {
    control,
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<FormDataEdit>({
    resolver: zodResolver(formDataSchemaEdit),
    defaultValues: initialValue
      ? {
          id: initialValue.id.toFixed(),
          name: initialValue.name,
          authorIds: initialValue.authors.map(author => author.id),
          genreIds: initialValue.genres.map(genre => genre.id),
          cover: undefined,
          file: undefined,
        }
      : {
          id: undefined,
          name: '',
          authorIds: [],
          genreIds: [],
          cover: undefined,
          file: undefined,
        },
  });

  const authors = useElibStore(state => state.authors);
  const genres = useElibStore(state => state.genres);
  const updateBook = useElibStore(state => state.updateBook);
  const createBook = useElibStore(state => state.addBook);

  const handleSubmitForm = async (data: FormDataEdit) => {
    console.log('Form submitted', data);

    const formData = new FormData();
    formData.append('id', data.id?.toString() || Date.now().toFixed()); // id обязателен
    if (data.name) formData.append('name', data.name);
    if (data.authorIds) formData.append('authorIds', data.authorIds.join(','));
    if (data.genreIds) formData.append('genreIds', data.genreIds.join(','));
    if (data.cover) formData.append('poster', data.cover);
    if (data.file) formData.append('file', data.file);

    try {
      if (initialValue) {
        await updateBook(+data.id, formData);
        console.log('Book updated successfully');
      } else {
        const newBook = await createBook(formData);
        console.log('Book created successfully:', newBook);
      }

      const fetchBooks = useElibStore.getState().fetchBooks;
      if (typeof fetchBooks === 'function') {
        try {
          await fetchBooks();
          console.log('Books list refreshed');
        } catch (refreshError) {
          console.error('Failed to refresh books list:', refreshError);
        }
      }

      reset();
    } catch (error) {
      console.error('Error saving book:', error);

      let errorMessage = 'Произошла ошибка при сохранении книги';

      if (error instanceof Error) {
        errorMessage += ': ' + error.message;
      } else if (typeof error === 'string') {
        errorMessage += ': ' + error;
      }

      alert(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6"
    >
      {/* Скрытое поле ID */}
      <input type="hidden" {...register('id')} />

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Название:
        </label>
        <input
          {...register('name')}
          placeholder="Введите название"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
        <Controller
          name="authorIds"
          control={control}
          render={({ field }) => (
            <div className="mt-2 space-y-2">
              {authors?.map(author => (
                <label
                  key={author.id}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    value={author.id}
                    checked={field.value?.includes(author.id) || false}
                    onChange={e => {
                      const newValue = e.target.checked
                        ? [...(field.value || []), author.id]
                        : (field.value || []).filter(id => id !== author.id);
                      field.onChange(newValue);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span>{author.name}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.authorIds && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.authorIds.message}
          </span>
        )}
      </div>

      {/* Жанры */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Жанры:
        </label>
        <Controller
          name="genreIds"
          control={control}
          render={({ field }) => (
            <div className="mt-2 space-y-2">
              {genres?.map(genre => (
                <label
                  key={genre.id}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    value={genre.id}
                    checked={field.value?.includes(genre.id) || false}
                    onChange={e => {
                      const newValue = e.target.checked
                        ? [...(field.value || []), genre.id]
                        : (field.value || []).filter(id => id !== genre.id);
                      field.onChange(newValue);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span>{genre.name}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.genreIds && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.genreIds.message}
          </span>
        )}
      </div>

      {/* Обложка */}
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
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.cover && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.cover.message?.toString()}
          </span>
        )}
      </div>

      {/* Файл книги */}
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
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.file && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.file.message?.toString()}
          </span>
        )}
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Сохранить
      </button>
    </form>
  );
};
