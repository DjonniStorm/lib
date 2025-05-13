import { Config } from '../lib/config';
import type { Book, Certificate } from '../types';

const envConfig = new Config();

const SERVER_URL = envConfig.loadUrl();

const API_PATHS = ['books', 'authors', 'genres', 'certificates'];

const requestCounts = {
  books: 0,
  authors: 0,
  genres: 0,
  certificates: 0,
  other: 0,
};

const makeRequest = async (
  path: string,
  params?: string,
  vars?: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data: FormData | null = null,
): Promise<Book[] | Certificate[] | Book | Certificate | void> => {
  try {
    const apiPath = API_PATHS.find(p => path.startsWith(p)) || 'other';
    requestCounts[apiPath as keyof typeof requestCounts]++;

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
      throw new Error(`Response status: ${response.status}`);
    }
    if (method === 'DELETE') return;
    const json = await response.json();
    console.log(`API Response for ${path}:`, json);
    return json;
  } catch (error) {
    console.error(`API Error for ${path}:`, error);
    if (error instanceof SyntaxError) {
      throw new Error(`There was a SyntaxError: ${error.message}`);
    } else if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    } else {
      throw new Error(`Unknown API error`);
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
