export interface Book {
  authors: Author[];
  genres: Genre[];
  cover: string;
  name: string;
  path: string;
  id: number;
}

export interface Certificate {
  name: string;
  text: string;
  img: string;
  id: number;
}

export interface Author {
  name: string;
  id: number;
}

export interface Genre {
  name: string;
  id: number;
}
