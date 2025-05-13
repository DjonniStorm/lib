import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Genre } from '../../../types';
import { FormDataEdit, FormDataAdd } from './formDataSchema';

// Компонент для отображения флажков жанров в режиме редактирования
export const GenresCheckboxesEdit = ({
  control,
  genres,
}: {
  control: Control<FormDataEdit>;
  genres: Genre[];
}) => (
  <Controller
    name="genreIds"
    control={control}
    defaultValue={[]}
    render={({ field }) => (
      <div className="mt-2 space-y-2 h-32 overflow-y-scroll">
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
                console.log('Выбранные жанры:', newValue);
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
);

// Компонент для отображения флажков жанров в режиме добавления
export const GenresCheckboxesAdd = ({
  control,
  genres,
}: {
  control: Control<FormDataAdd>;
  genres: Genre[];
}) => (
  <Controller
    name="genreIds"
    control={control}
    defaultValue={[]}
    render={({ field }) => (
      <div className="mt-2 space-y-2 h-32 overflow-y-scroll">
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
                console.log('Выбранные жанры:', newValue);
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
);
