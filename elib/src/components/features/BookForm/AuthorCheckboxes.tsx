import { Controller, Control } from 'react-hook-form';
import { Author } from '../../../types';
import { FormDataEdit, FormDataAdd } from './formDataSchema';

export const AuthorsCheckboxesEdit = ({
  control,
  authors,
}: {
  control: Control<FormDataEdit>;
  authors: Author[];
}) => (
  <Controller
    name="authorIds"
    control={control}
    defaultValue={[]}
    render={({ field }) => (
      <div className="mt-2 space-y-2 h-32 overflow-y-scroll">
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
                console.log('Выбранные авторы:', newValue);
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
);

// Компонент для отображения флажков авторов в режиме добавления
export const AuthorsCheckboxesAdd = ({
  control,
  authors,
}: {
  control: Control<FormDataAdd>;
  authors: Author[];
}) => (
  <Controller
    name="authorIds"
    control={control}
    defaultValue={[]}
    render={({ field }) => (
      <div className="mt-2 space-y-2 h-32 overflow-y-scroll">
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
                console.log('Выбранные авторы:', newValue);
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
);
