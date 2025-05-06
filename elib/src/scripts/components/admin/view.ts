import { AdminModel } from './model';
import { ItemsList } from './list';
import { Book, Certificate } from '../../../types';

export class AdminView {
  private _root: HTMLElement;
  private _model: AdminModel;
  private _list: ItemsList;
  private _formContainer: HTMLDivElement;
  private _onCategoryChange: (category: string) => void;
  private _onDelete: (id: number) => void;
  private _onSelect: (id: number) => void;
  private _onSubmit: (data: FormData, isUpdate: boolean) => void;

  constructor(
    root: HTMLElement,
    model: AdminModel,
    onCategoryChange: (category: string) => void,
    onDelete: (id: number) => void,
    onSelect: (id: number) => void,
    onSubmit: (data: FormData, isUpdate: boolean) => void,
  ) {
    this._root = root;
    this._model = model;
    this._onCategoryChange = onCategoryChange;
    this._onDelete = onDelete;
    this._onSelect = onSelect;
    this._onSubmit = onSubmit;
    this._list = new ItemsList();
  }

  render(): void {
    this._list.items = this._model.currentItems;
    this._root.innerHTML = `
      <div class="container-fluid">
        <div class="row">
          <div class="col-3">
            <select class="form-select mb-3" id="category">
              <option value="books" ${this._model.currentCategory === 'books' ? 'selected' : ''}>Книги</option>
              <option value="certificates" ${this._model.currentCategory === 'certificates' ? 'selected' : ''}>Сертификаты</option>
            </select>
            <div id="list-container"></div>
            <button class="btn btn-primary mt-3" id="addBtn">Создать</button>
          </div>
          <div class="col-9">
            <div id="formContainer"></div>
          </div>
        </div>
      </div>
    `;
    const listContainer = this._root.querySelector(
      '#list-container',
    ) as HTMLDivElement;
    listContainer.appendChild(this._list);
    this._formContainer = this._root.querySelector(
      '#formContainer',
    ) as HTMLDivElement;
    this.addEventListeners();
  }

  update(): void {
    console.log('Обновление списка, элементы:', this._model.currentItems);
    this._list.items = this._model.currentItems;
    this._list.update();
    const selectedItem = this._model.selectedItem;
    console.log('Выбранный элемент:', selectedItem);
    this.renderForm(selectedItem);
  }

  private renderForm(item?: Book | Certificate): void {
    const category = this._model.currentCategory;
    this._formContainer.innerHTML = `
      <form class="mt-4">
        <input type="hidden" name="id" id="id" value="${item?.id || ''}" />
        ${
          category === 'books'
            ? `
              <div class="mb-3">
                <label for="name" class="form-label">Название</label>
                <input type="text" class="form-control" name="name" id="name" value="${(item as Book)?.name || ''}" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Авторы</label>
                <div>
                  ${this._model.authors
                    .map(
                      author => `
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="authorIds" id="author-${author.id}" value="${author.id}" ${item && (item as Book)?.authors?.some(a => a.id === author.id) ? 'checked' : ''}>
                      <label class="form-check-label" for="author-${author.id}">${author.name}</label>
                    </div>
                  `,
                    )
                    .join('')}
                </div>
                ${
                  item && (item as Book)?.authors?.length
                    ? `
                  <div class="mt-2">
                    <small>Выбрано: ${(item as Book).authors.map(a => a.name).join(', ')}</small>
                  </div>
                `
                    : ''
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Жанры</label>
                <div>
                  ${this._model.genres
                    .map(
                      genre => `
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="genreIds" id="genre-${genre.id}" value="${genre.id}" ${item && (item as Book)?.genres?.some(g => g.id === genre.id) ? 'checked' : ''}>
                      <label class="form-check-label" for="genre-${genre.id}">${genre.name}</label>
                    </div>
                  `,
                    )
                    .join('')}
                </div>
                ${
                  item && (item as Book)?.genres?.length
                    ? `
                  <div class="mt-2">
                    <small>Выбрано: ${(item as Book).genres.map(g => g.name).join(', ')}</small>
                  </div>
                `
                    : ''
                }
              </div>
              <div class="mb-3">
                <label for="poster" class="form-label">Обложка (PNG/JPEG)</label>
                <input type="file" class="form-control" name="poster" id="poster" accept="image/png,image/jpeg" />
                ${item && (item as Book)?.cover ? `<div class="mt-2"><small>Текущий файл: ${(item as Book)?.cover}</small></div>` : ''}
              </div>
              <div class="mb-3">
                <label for="file" class="form-label">Файл книги (EPUB)</label>
                <input type="file" class="form-control" name="file" id="file" accept=".epub" />
                ${item && (item as Book)?.path ? `<div class="mt-2"><small>Текущий файл: ${(item as Book)?.path}</small></div>` : ''}
              </div>
            `
            : `
              <div class="mb-3">
                <label for="name" class="form-label">Название</label>
                <input type="text" class="form-control" name="name" id="name" value="${(item as Certificate)?.name || ''}" required />
              </div>
              <div class="mb-3">
                <label for="text" class="form-label">Текст</label>
                <input type="text" class="form-control" name="text" id="text" value="${(item as Certificate)?.text || ''}" required />
              </div>
              <div class="mb-3">
                <label for="img" class="form-label">Изображение (PNG/JPEG)</label>
                <input type="file" class="form-control" name="img" id="img" accept="image/png,image/jpeg" />
                ${item && (item as Certificate)?.img ? `<div class="mt-2"><small>Текущий файл: ${(item as Certificate)?.img}</small></div>` : ''}
              </div>
            `
        }
        <button type="submit" class="btn btn-primary">${item ? 'Сохранить' : 'Добавить'}</button>
      </form>
    `;
    const form = this._formContainer.querySelector('form') as HTMLFormElement;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = new FormData(form);
      const authorIds = Array.from(
        form.querySelectorAll('input[name="authorIds"]:checked'),
      ).map(input => (input as HTMLInputElement).value);
      const genreIds = Array.from(
        form.querySelectorAll('input[name="genreIds"]:checked'),
      ).map(input => (input as HTMLInputElement).value);
      if (authorIds.length) formData.set('authorIds', authorIds.join(','));
      if (genreIds.length) formData.set('genreIds', genreIds.join(','));
      const isUpdate = !!item;
      this._onSubmit(formData, isUpdate);
    });
  }

  private addEventListeners(): void {
    const categorySelect = this._root.querySelector(
      '#category',
    ) as HTMLSelectElement;
    categorySelect.addEventListener('change', () => {
      this._onCategoryChange(categorySelect.value);
    });
    const addBtn = this._root.querySelector('#addBtn') as HTMLButtonElement;
    addBtn.addEventListener('click', () => {
      this._model.selectedId = null;
      this.renderForm();
    });
    this._list.addEventListener('active-changed', (e: Event) => {
      const { active } = (e as CustomEvent).detail;
      const item = this._list.items[active];
      this._onSelect(item.id);
    });
    this._list.addEventListener('delete-item', (e: Event) => {
      const { id } = (e as CustomEvent).detail;
      this._onDelete(id);
    });
  }
}
