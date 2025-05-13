import { z } from 'zod';

export const formDataSchemaAdd = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Укажите название' }),
  text: z.string().min(1, { message: 'Укажите текст сертификата' }),
  img: z
    .any()
    .refine(
      (fileList: FileList | undefined) => fileList && fileList.length > 0,
      {
        message: 'Изображение обязательно',
      },
    )
    .refine(
      (fileList: FileList | undefined) =>
        !fileList ||
        ['image/jpeg', 'image/png', 'image/svg+xml'].includes(
          fileList[0]?.type,
        ),
      { message: 'Изображение должно быть в формате JPG/PNG/SVG' },
    )
    .transform(fileList =>
      fileList && fileList.length > 0 ? fileList[0] : undefined,
    ),
});

// Схема для редактирования (id обязателен, остальные поля необязательны)
export const formDataSchemaEdit = z.object({
  id: z.string({ required_error: 'ID обязателен для редактирования' }),
  name: z.string().optional(),
  text: z.string().optional(),
  img: z
    .any()
    .optional()
    .refine(
      (fileList: FileList | undefined) =>
        !fileList ||
        !fileList.length ||
        ['image/jpeg', 'image/png', 'image/svg+xml'].includes(
          fileList[0]?.type,
        ),
      { message: 'Изображение должно быть в формате JPG/PNG/SVG' },
    )
    .transform(fileList =>
      fileList && fileList.length > 0 ? fileList[0] : undefined,
    ),
});

export type FormDataAdd = z.infer<typeof formDataSchemaAdd>;
export type FormDataEdit = z.infer<typeof formDataSchemaEdit>;

// Для совместимости со старым кодом
export const formDataSchema = formDataSchemaAdd;
export type CertificateFormData = FormDataAdd;
