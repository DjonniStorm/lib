import {
  getBooks,
  postBook,
  updateBook,
  deleteBook,
  getCertificates,
  postCertificate,
  updateCertificate,
  deleteCertificate,
  getGenres,
  getAuthors,
} from '../../api/api';
import { Book, Certificate, Genre, Author } from '../../../types';

export class AdminModel extends EventTarget {
  private _currentCategory: 'certificates' | 'books' = 'books';
  private _certificates: Certificate[] = [];
  private _books: Book[] = [];
  private _genres: Genre[] = [];
  private _authors: Author[] = [];
  private _selectedId: number | null = null;
  private _optimisticState: {
    books: Book[];
    certificates: Certificate[];
  } | null = null;

  async fetchAll(): Promise<void> {
    this._books = await getBooks();
    this._certificates = await getCertificates();
    this._genres = await getGenres();
    this._authors = await getAuthors();
    this.dispatchEvent(new Event('update'));
  }

  async addItem(
    item: FormData,
    category: 'certificates' | 'books',
  ): Promise<void> {
    if (category === 'books') {
      const newBook = await postBook(item);
      this._books.push(newBook);
    } else {
      const newCert = await postCertificate(item);
      this._certificates.push(newCert);
    }
    this.dispatchEvent(new Event('update'));
  }

  async updateItem(
    item: FormData,
    category: 'certificates' | 'books',
  ): Promise<void> {
    if (category === 'books') {
      const updatedBook = await updateBook(item);
      const index = this._books.findIndex(
        b => b.id === parseInt(item.get('id') as string),
      );
      if (index !== -1) this._books[index] = updatedBook;
    } else {
      const updatedCert = await updateCertificate(item);
      const index = this._certificates.findIndex(
        c => c.id === parseInt(item.get('id') as string),
      );
      if (index !== -1) this._certificates[index] = updatedCert;
    }
    this.dispatchEvent(new Event('update'));
  }

  async deleteItem(
    id: number,
    category: 'certificates' | 'books',
  ): Promise<void> {
    if (category === 'books') {
      await deleteBook(id.toString());
      this._books = this._books.filter(b => b.id !== id);
    } else {
      await deleteCertificate(id.toString());
      this._certificates = this._certificates.filter(c => c.id !== id);
    }
    if (this._selectedId === id) this._selectedId = null;
    this.dispatchEvent(new Event('update'));
  }

  addItemOptimistic(item: FormData, category: 'certificates' | 'books'): void {
    this._optimisticState = {
      books: [...this._books],
      certificates: [...this._certificates],
    };
    if (category === 'books') {
      const authorIds =
        (item.get('authorIds') as string)
          ?.split(',')
          .map(Number)
          .filter(id => !isNaN(id)) || [];
      const genreIds =
        (item.get('genreIds') as string)
          ?.split(',')
          .map(Number)
          .filter(id => !isNaN(id)) || [];
      const newBook: Book = {
        id: Date.now(),
        name: item.get('name') as string,
        authors: this._authors.filter(a => authorIds.includes(a.id)),
        genres: this._genres.filter(g => genreIds.includes(g.id)),
        cover: item.get('poster')
          ? `/images/covers/${(item.get('poster') as File).name}`
          : '',
        path: item.get('file')
          ? `/books/${(item.get('file') as File).name}`
          : '',
      };
      this._books.push(newBook);
    } else {
      const newCert: Certificate = {
        id: Date.now(),
        name: item.get('name') as string,
        text: item.get('text') as string,
        img: item.get('img')
          ? `/images/certificates/${(item.get('img') as File).name}`
          : '',
      };
      this._certificates.push(newCert);
    }
    this.dispatchEvent(new Event('update'));
  }

  updateItemOptimistic(
    item: FormData,
    category: 'certificates' | 'books',
  ): void {
    this._optimisticState = {
      books: [...this._books],
      certificates: [...this._certificates],
    };
    if (category === 'books') {
      const id = parseInt(item.get('id') as string);
      const index = this._books.findIndex(b => b.id === id);
      if (index !== -1) {
        const authorIds =
          (item.get('authorIds') as string)
            ?.split(',')
            .map(Number)
            .filter(id => !isNaN(id)) ||
          this._books[index].authors.map(a => a.id);
        const genreIds =
          (item.get('genreIds') as string)
            ?.split(',')
            .map(Number)
            .filter(id => !isNaN(id)) ||
          this._books[index].genres.map(g => g.id);
        this._books[index] = {
          ...this._books[index],
          name: item.get('name') as string,
          authors: this._authors.filter(a => authorIds.includes(a.id)),
          genres: this._genres.filter(g => genreIds.includes(g.id)),
          cover: item.get('poster')
            ? `/images/covers/${(item.get('poster') as File).name}`
            : this._books[index].cover,
          path: item.get('file')
            ? `/books/${(item.get('file') as File).name}`
            : this._books[index].path,
        };
      }
    } else {
      const id = parseInt(item.get('id') as string);
      const index = this._certificates.findIndex(c => c.id === id);
      if (index !== -1) {
        this._certificates[index] = {
          ...this._certificates[index],
          name: item.get('name') as string,
          text: item.get('text') as string,
          img: item.get('img')
            ? `/images/certificates/${(item.get('img') as File).name}`
            : this._certificates[index].img,
        };
      }
    }
    this.dispatchEvent(new Event('update'));
  }

  deleteItemOptimistic(id: number, category: 'certificates' | 'books'): void {
    this._optimisticState = {
      books: [...this._books],
      certificates: [...this._certificates],
    };
    if (category === 'books') {
      this._books = this._books.filter(b => b.id !== id);
    } else {
      this._certificates = this._certificates.filter(c => c.id !== id);
    }
    if (this._selectedId === id) this._selectedId = null;
    this.dispatchEvent(new Event('update'));
  }

  rollbackOptimistic(category: 'certificates' | 'books'): void {
    if (this._optimisticState) {
      this._books = [...this._optimisticState.books];
      this._certificates = [...this._optimisticState.certificates];
      this._optimisticState = null;
      this.dispatchEvent(new Event('update'));
    }
  }

  get currentItems(): (Book | Certificate)[] {
    return this._currentCategory === 'books' ? this._books : this._certificates;
  }

  get selectedItem(): Book | Certificate | undefined {
    return this.currentItems.find(item => item.id === this._selectedId);
  }

  get genres(): Genre[] {
    return this._genres;
  }

  get authors(): Author[] {
    return this._authors;
  }

  get currentCategory(): 'certificates' | 'books' {
    return this._currentCategory;
  }

  set currentCategory(category: 'certificates' | 'books') {
    this._currentCategory = category;
    this._selectedId = null;
    this.dispatchEvent(new Event('update'));
  }

  set selectedId(id: number | null) {
    this._selectedId = id;
    this.dispatchEvent(new Event('update'));
  }
}
