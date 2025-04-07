type User = {
  certificates: Certificate[];
  password: string;
  email: string;
  books: Book[];
  name: string;
  card: string;
  id: number;
};

type Book = {
  author: string;
  cover: string;
  genre: string;
  name: string;
  path: string;
  id: number;
};

type Certificate = {
  name: string;
  text: string;
  img: string;
  id: number;
};
