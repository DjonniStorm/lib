// src/models/AdminModel.ts
import {
  updateCertificate,
  deleteCertificate,
  getCertificates,
  postCertificate,
  updateBook,
  deleteBook,
  updateUser,
  deleteUser,
  getBooks,
  postBook,
  getUsers,
  postUser,
} from '../../api/api';

export class AdminModel {
  private currentCategory: 'certificates' | 'books' | 'users' = 'books';
  private certificates: Certificate[] = [];
  private selectedId: number | null = null;
  private books: Book[] = [];
  private users: User[] = [];

  async updateItem<T>(
    item: FormData | T,
    category: 'certificates' | 'books' | 'users',
  ): Promise<void> {
    console.log('Updating item:', item);

    if (category === 'books') {
      // Если пришел объект Book, преобразуем его в FormData
      let formData: FormData;
      if (!(item instanceof FormData)) {
        const book = item as Book;
        formData = new FormData();
        formData.append('id', book.id.toString()); // Важно! Преобразуем id в строку
        formData.append('name', book.name);
        formData.append('author', book.author);
        formData.append('genre', book.genre);
        if (book.path) formData.append('path', book.path);
        if (book.cover) formData.append('cover', book.cover);
      } else {
        formData = item;
      }

      const updatedBook = await updateBook(formData);
      this.books = this.books.map(b =>
        b.id === updatedBook.id ? updatedBook : b,
      );
    } else if (category === 'users') {
      const updatedUser = await updateUser(item as User); // Для юзеров — объект

      this.users = this.users.map(u =>
        u.id === updatedUser.id ? updatedUser : u,
      );
    } else if (category === 'certificates') {
      const updatedCert = await updateCertificate(item as Certificate); // Для сертификатов — объект (можно доработать)

      this.certificates = this.certificates.map(c =>
        c.id === updatedCert.id ? updatedCert : c,
      );
    }
  }

  async deleteItem(
    id: number,
    category: 'certificates' | 'books' | 'users',
  ): Promise<void> {
    if (category === 'books') {
      await deleteBook(id.toString());
      this.books = this.books.filter(b => b.id !== id);
    } else if (category === 'users') {
      await deleteUser(id.toString());
      this.users = this.users.filter(u => u.id !== id);
    } else if (category === 'certificates') {
      await deleteCertificate(id.toString());
      this.certificates = this.certificates.filter(c => c.id !== id);
    }

    if (this.selectedId === id) {
      this.selectedId = null;
    }
  }

  async addItem<T>(
    item: FormData | T,
    category: 'certificates' | 'books' | 'users',
  ): Promise<void> {
    if (category === 'books') {
      const newBook = await postBook(item as FormData); // Для книг ожидается FormData

      this.books.push(newBook);
    } else if (category === 'users') {
      const newUser = await postUser(item as User); // Для юзеров — объект

      this.users.push(newUser);
    } else if (category === 'certificates') {
      const newCert = await postCertificate(item as FormData); // Для сертификатов — FormData

      this.certificates.push(newCert);
    }
  }

  getCurrentItems(): Certificate[] | Book[] | User[] {
    switch (this.currentCategory) {
      case 'certificates':
        return this.certificates;
      case 'books':
        return this.books;
      case 'users':
        return this.users;
      default:
        return this.books;
    }
  }

  getSelectedItem(): Certificate | undefined | Book | User {
    return this.getCurrentItems().find(
      (item: any) => item.id === this.selectedId,
    );
  }

  async fetchAll(): Promise<void> {
    this.books = await getBooks();
    this.users = await getUsers();
    this.certificates = await getCertificates();
  }

  setCurrentCategory(category: 'certificates' | 'books' | 'users'): void {
    this.currentCategory = category;
  }

  getCurrentCategory(): 'certificates' | 'books' | 'users' {
    return this.currentCategory;
  }

  setSelectedId(id: number | null): void {
    this.selectedId = id;
  }
}
