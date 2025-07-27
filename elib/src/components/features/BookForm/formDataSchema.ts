import { z } from 'zod';

export const formDataSchemaAdd = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Название обязательно' }),
  authorIds: z
    .array(z.number())
    .min(1, { message: 'Выберите хотя бы одного автора' }),
  genreIds: z
    .array(z.number())
    .min(1, { message: 'Выберите хотя бы один жанр' }),
  cover: z
    .any()
    .refine(
      (fileList: FileList | undefined) => fileList && fileList.length > 0,
      {
        message: 'Обложка обязательна',
      },
    )
    .refine(
      (fileList: FileList | undefined) =>
        !fileList || ['image/jpeg', 'image/png'].includes(fileList[0]?.type),
      { message: 'Обложка должна быть в формате JPG или PNG' },
    )
    .transform(fileList => (fileList ? fileList[0] : undefined)),
  file: z
    .any()
    .refine(
      (fileList: FileList | undefined) => fileList && fileList.length > 0,
      {
        message: 'Файл книги обязателен',
      },
    )
    .refine(
      (fileList: FileList | undefined) =>
        !fileList || fileList[0]?.name.endsWith('.epub'),
      { message: 'Файл книги должен быть в формате EPUB' },
    )
    .transform(fileList => (fileList ? fileList[0] : undefined)),
});

// Схема для редактирования (id обязателен, остальные поля необязательны)
export const formDataSchemaEdit = z.object({
  id: z.string({ required_error: 'ID обязателен для редактирования' }),
  name: z.string().optional(),
  authorIds: z.array(z.number()).optional(),
  genreIds: z.array(z.number()).optional(),
  cover: z
    .any()
    .optional()
    .refine(
      (fileList: FileList | undefined) =>
        !fileList ||
        !fileList.length ||
        ['image/jpeg', 'image/png'].includes(fileList[0]?.type),
      { message: 'Обложка должна быть в формате JPG или PNG' },
    )
    .transform(fileList =>
      fileList && fileList.length > 0 ? fileList[0] : undefined,
    ),
  file: z
    .any()
    .optional()
    .refine(
      (fileList: FileList | undefined) =>
        !fileList || !fileList.length || fileList[0]?.name.endsWith('.epub'),
      { message: 'Файл книги должен быть в формате EPUB' },
    )
    .transform(fileList =>
      fileList && fileList.length > 0 ? fileList[0] : undefined,
    ),
});

export type FormDataAdd = z.infer<typeof formDataSchemaAdd>;
export type FormDataEdit = z.infer<typeof formDataSchemaEdit>;
