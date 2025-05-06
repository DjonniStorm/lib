export interface Book {
  id: number;
  name: string;
  authors: Author[];
  genres: Genre[];
  cover: string;
  path: string;
}

export interface Certificate {
  id: number;
  name: string;
  text: string;
  img: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  name: string;
}
