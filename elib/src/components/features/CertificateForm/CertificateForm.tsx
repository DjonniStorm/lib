import React from 'react';
import { useForm } from 'react-hook-form';
import type { Certificate } from '../../../types';
import {
  formDataSchemaEdit,
  FormDataEdit,
  formDataSchemaAdd,
  FormDataAdd,
} from './formDataSchema';
import { useElibStore } from '../../../store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../ui/Button';

type Props = {
  initialValue?: Certificate;
};

export const CertificateForm = ({ initialValue }: Props): React.JSX.Element => {
  const isEditing = !!initialValue;

  // Форма для редактирования
  const {
    register: registerEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    handleSubmit: handleSubmitEdit,
  } = useForm<FormDataEdit>({
    resolver: zodResolver(formDataSchemaEdit),
  });

  // Форма для добавления
  const {
    register: registerAdd,
    formState: { errors: errorsAdd },
    reset: resetAdd,
    handleSubmit: handleSubmitAdd,
  } = useForm<FormDataAdd>({
    resolver: zodResolver(formDataSchemaAdd),
  });

  const register = isEditing ? registerEdit : registerAdd;
  const errors = isEditing ? errorsEdit : errorsAdd;
  const reset = isEditing ? resetEdit : resetAdd;

  React.useEffect(() => {
    if (initialValue) {
      console.log('Начальные данные сертификата:', initialValue);
      resetEdit({
        id: initialValue.id.toString(),
        name: initialValue.name,
        text: initialValue.text,
        img: undefined,
      });
    } else {
      resetAdd({
        id: Date.now().toString(),
        name: '',
        text: '',
        img: undefined,
      });
    }
  }, [initialValue, resetEdit, resetAdd]);

  const updateCertificate = useElibStore(store => store.updateCertificate);
  const createCertificate = useElibStore(store => store.addCertificate);

  // Общий обработчик для подготовки данных формы
  const processFormData = (data: FormDataEdit | FormDataAdd) => {
    console.log('Данные формы перед отправкой:', data);

    const formData = new FormData();
    formData.append('id', data.id || Date.now().toString());
    if (data.name) formData.append('name', data.name);
    if (data.text) formData.append('text', data.text);
    if (data.img) formData.append('img', data.img);

    console.log(
      'FormData для отправки:',
      Object.fromEntries(formData.entries()),
    );

    return formData;
  };

  // Обработчик для редактирования
  const handleSubmitEditForm = async (data: FormDataEdit) => {
    try {
      const formData = processFormData(data);
      await updateCertificate(+data.id, formData);
      console.log('Сертификат успешно обновлен');
      refreshCertificatesList();
      reset();
    } catch (error) {
      console.error('Ошибка при сохранении сертификата:', error);
      alert(error);
    }
  };

  // Обработчик для добавления
  const handleSubmitAddForm = async (data: FormDataAdd) => {
    try {
      const formData = processFormData(data);
      const newCertificate = await createCertificate(formData);
      console.log('Сертификат успешно создан:', newCertificate);
      refreshCertificatesList();
      reset();
    } catch (error) {
      console.error('Ошибка при сохранении сертификата:', error);
      alert(error);
    }
  };

  const refreshCertificatesList = async () => {
    const fetchCertificates = useElibStore.getState().fetchCertificates;
    if (typeof fetchCertificates === 'function') {
      try {
        await fetchCertificates();
        console.log('Список сертификатов обновлен');
      } catch (refreshError) {
        console.error(
          'Ошибка при обновлении списка сертификатов:',
          refreshError,
        );
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
      className="flex flex-col gap-4 border rounded p-4 w-[700px] h-[600px] mx-auto shadow-lg space-y-6"
      autoComplete="on"
    >
      <input type="hidden" {...register('id')} />
      <div>
        <label className="flex flex-col">
          <span className="pl-2">Название:</span>
          <input
            type="text"
            {...register('name')}
            placeholder="Название"
            className="border p-2 rounded"
            required={!isEditing}
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.name.message}
            </span>
          )}
        </label>
      </div>
      <div>
        <label className="flex flex-col">
          <span className="pl-2">Текст:</span>
          <textarea
            {...register('text')}
            placeholder="Текст"
            className="border rounded p-2 resize-none"
            rows={4}
            required={!isEditing}
          />
          {errors.text && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.text.message}
            </span>
          )}
        </label>
      </div>
      <div>
        <label className="flex flex-col">
          <span className="pl-2">Изображение:</span>
          {initialValue?.img && (
            <div className="text-sm text-gray-500 mb-2">
              Текущий файл: {initialValue.img.split('/').pop()}
            </div>
          )}
          <input
            type="file"
            {...register('img')}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray file:text-gray-700 hover:file:bg-main"
            required={!isEditing}
          />
          {errors.img && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.img.message?.toString()}
            </span>
          )}
        </label>
      </div>
      <div className="mx-auto">
        <Button className="max-w-[200px] w-50" type="submit">
          {isEditing ? 'Обновить' : 'Добавить'}
        </Button>
      </div>
    </form>
  );
};
