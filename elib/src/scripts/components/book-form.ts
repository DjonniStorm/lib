import styles from '../../styles/style.scss?inline';
import { useDumbState } from '../utils';

type BookFormT = 'edit' | 'add';

export class BookForm extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'id'];
  }

  private _id: number | null = null;
  private _type: BookFormT = 'add';

  constructor() {
    super();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: BookFormT,
  ) {
    if (name === 'type') {
      this._type = newValue;
    }

    if (name === 'id') {
      this._id = +newValue;
    }
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = this.render();
    this.addSubmitListener();
  }

  public updateData() {
    this.shadowRoot!.innerHTML = this.render();
  }

  private render() {
    const [data, setData] = useDumbState<BookFormT>('add', () => {});

    return `
    <style>
    ${styles}
    </style>
        <section class="container">
              <div class="row align-items-center mt-0 mt-md-4 mt-lg-4">
                <h1 class="text-center fs-2 mb-0">${this._type === 'add' ? 'Добавление' : 'Редактирование'} книги:</h1>
              </div>
            </section>
            <form
              id="bookForm"
              class="container mt-0 mt-md-4 mt-lg-4 max-width-500"
            >
              <div class="mb-0 mb-md-2 mb-lg-4">
                <label for="genre" class="form-label">Жанр</label>
                <select class="form-select" id="genre" name="genre" required>
                  <option value="" selected disabled>Выберите жанр</option>
                  <option value="Фэнтези">Фэнтези</option>
                  <option value="Научная фантастика">Научная фантастика</option>
                  <option value="Детектив">Детектив</option>
                  <option value="Роман">Роман</option>
                  <option value="Ужасы">Ужасы</option>
                  <option value="Триллер">Триллер</option>
                  <option value="Классика">Классика</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
              <div class="mb-0 mb-md-2 mb-lg-4">
                <label for="title" class="form-label">Название книги</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  name="title"
                  placeholder="Название книги"
                />
              </div>
              <div class="mb-0 mb-md-2 mb-lg-4">
                <label for="author" class="form-label">Автор</label>
                <input
                  type="text"
                  class="form-control"
                  id="author"
                  name="author"
                  placeholder="Автор"
                />
              </div>
              <div class="mb-0 mb-md-2 mb-lg-4">
                <label for="poster">Обложка (png, jpg)</label>
                <input
                  type="file"
                  class="form-control"
                  id="poster"
                  name="poster"
                  accept=".jpg, .jpeg, .png"
                  required
                />
              </div>
              <div class="mb-2 mb-md-4 mb-lg-6">
                <label for="file" class="form-label">Файл книги (EPUB)</label>
                <input
                  type="file"
                  class="form-control"
                  name="file"
                  id="file"
                  accept=".epub"
                  required
                />
              </div>
              <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-primary">
                    ${this._type === 'add' ? 'Загрузить' : 'Сохранить'} книгу
                </button>
              </div>
            </form>
    `;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const url = `http://localhost:3000${
      this._type === 'add' ? `/add-book` : `/edit-book/${this._id ?? ''}`
    }`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert(`Книга успешно ${this._type === 'add' ? 'добавлена' : 'изменена'}`);
      form.reset();
    } else {
      alert(
        `Ошибка при ${this._type === 'add' ? 'добавлении' : 'изменении'} книги`,
      );
    }
  }

  private addSubmitListener() {
    const form = this.shadowRoot!.querySelector('form');

    form?.addEventListener('submit', this.handleSubmit);
  }
}
