import { SERVER_URL } from './constants';
import { Book, Certificate } from '../../types';

const makeRequest = async (
  path: string,
  params?: string,
  vars?: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data: FormData | null = null,
): Promise<Book[] | Certificate[] | Book | Certificate | void> => {
  try {
    const requestParams = params ? `?${params}` : '';
    const pathVariables = vars ? `/${vars}` : '';
    const options: RequestInit = { method };
    if ((method === 'POST' || method === 'PUT') && data) {
      options.body = data;
    }
    const response = await fetch(
      `${SERVER_URL}${path}${pathVariables}${requestParams}`,
      options,
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response?.status}`);
    }
    if (method === 'DELETE') return;
    const json = await response.json();
    console.debug(path, json);
    return json;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`There was a SyntaxError', { cause: ${error} }`);
    } else {
      throw new Error(`There was an error', { cause: ${error} }`);
    }
  }
};

export const getAllItems = (path: string, params?: string) =>
  makeRequest(path, params) as Promise<Book[] | Certificate[]>;

export const createItem = (path: string, data: FormData) =>
  makeRequest(path, undefined, undefined, 'POST', data) as Promise<
    Book | Certificate
  >;

export const updateItem = (path: string, id: string, data: FormData) =>
  makeRequest(path, undefined, id, 'PUT', data) as Promise<Book | Certificate>;

export const deleteItem = (path: string, id: string) =>
  makeRequest(path, undefined, id, 'DELETE') as Promise<void>;
