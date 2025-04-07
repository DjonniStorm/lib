/* eslint-disable perfectionist/sort-classes */
import { AdminModel } from './model';
import { ItemsList } from './list';

export class AdminView {
  private onCategoryChange: (category: string) => void;
  private onDelete: (id: number) => void;
  private onSelect: (id: number) => void;
  private onUpdate: (item: any) => void;
  private onAdd: (item: any) => void;
  private onSubmit: (data: FormData | any, isUpdate: boolean) => void;
  private formContainer: HTMLDivElement;
  private root: HTMLElement;

  private model: AdminModel;
  private list: ItemsList;

  constructor(
    root: HTMLElement,
    model: AdminModel,
    onCategoryChange: (category: string) => void,
    onAdd: (item: any) => void,
    onUpdate: (item: any) => void,
    onDelete: (id: number) => void,
    onSelect: (id: number) => void,
    onSubmit: (data: FormData | any, isUpdate: boolean) => void,
  ) {
    this.root = root;
    this.model = model;
    this.onCategoryChange = onCategoryChange;
    this.onAdd = onAdd;
    this.onUpdate = onUpdate;
    this.onDelete = onDelete;
    this.onSelect = onSelect;
    this.onSubmit = onSubmit;

    this.list = new ItemsList();
    this.formContainer = document.createElement('div');
  }

  render(): void {
    this.list.items = this.model.getCurrentItems();

    this.root.innerHTML = `
      <div class="w-100 container-fluid">
        <div class="row">
          <div class="col-3">
            <select class="form-select mb-3" id="category">
              <option value="users">Юзеры</option>
              <option value="certificates">Сертификаты</option>
              <option value="books" selected>Книги</option>
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

    const listContainer = this.root.querySelector(
      '#list-container',
    ) as HTMLDivElement;
    listContainer.appendChild(this.list);

    this.formContainer = this.root.querySelector(
      '#formContainer',
    ) as HTMLDivElement;

    this.addEventListeners();
  }

  update(): void {
    this.list.items = this.model.getCurrentItems();
    this.list.update();

    const selectedItem = this.model.getSelectedItem();
    if (selectedItem) {
      this.renderForm(selectedItem);
    } else {
      this.formContainer.innerHTML = '';
    }
  }

  private renderForm(item?: Certificate | Book | User): void {
    const category = this.model.getCurrentCategory();

    this.formContainer.innerHTML = `
      <form class="mt-4">
        <input type="hidden" name="id" id="id" value="${item?.id || ''}" />
        ${
          category === 'books'
            ? `
              <div class="mb-3">
                <label for="name" class="form-label">Название</label>
                <input type="text" class="form-control" name="name" id="name" value="${(item as Book)?.name || ''}" />
              </div>
              <div class="mb-3">
                <label for="author" class="form-label">Автор</label>
                <input type="text" class="form-control" name="author" id="author" value="${(item as Book)?.author || ''}" />
              </div>
              <div class="mb-3">
                <label for="genre" class="form-label">Жанр</label>
                <input type="text" class="form-control" name="genre" id="genre" value="${(item as Book)?.genre || ''}" />
              </div>
              <div class="mb-3">
                <label for="poster" class="form-label">Обложка</label>
                <input type="file" class="form-control" name="poster" id="poster" accept="image/*" />
                ${(item as Book)?.cover ? `<div class="mt-2"><small>Текущий файл: ${(item as Book)?.cover}</small></div>` : ''}
              </div>
              <div class="mb-3">
                <label for="file" class="form-label">Файл книги</label>
                <input type="file" class="form-control" name="file" id="file" accept=".pdf,.epub,.djvu" />
                ${(item as Book)?.path ? `<div class="mt-2"><small>Текущий файл: ${(item as Book)?.path}</small></div>` : ''}
              </div>
            `
            : category === 'users'
              ? `
              <div class="mb-3">
                <label for="name" class="form-label">Имя</label>
                <input type="text" class="form-control" name="name" id="name" value="${(item as User)?.name || ''}" />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" name="email" id="email" value="${(item as User)?.email || ''}" />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input type="text" class="form-control" name="password" id="password" value="${(item as User)?.password || ''}" />
              </div>
              <div class="mb-3">
                <label for="card" class="form-label">Карта</label>
                <input type="text" class="form-control" name="card" id="card" value="${(item as User)?.card || ''}" />
              </div>
            `
              : `
              <div class="mb-3">
                <label for="name" class="form-label">Название</label>
                <input type="text" class="form-control" name="name" id="name" value="${(item as Certificate)?.name || ''}" />
              </div>
              <div class="mb-3">
                <label for="text" class="form-label">Текст</label>
                <input type="text" class="form-control" name="text" id="text" value="${(item as Certificate)?.text || ''}" />
              </div>
              <div class="mb-3">
                <label for="img" class="form-label">Изображение</label>
                <input type="file" class="form-control" name="img" id="img" accept="image/*" />
                ${(item as Certificate)?.img ? `<div class="mt-2"><small>Текущий файл: ${(item as Certificate)?.img}</small></div>` : ''}
              </div>
            `
        }
        <button type="submit" class="btn btn-primary">${item ? 'Сохранить' : 'Добавить'}</button>
      </form>
    `;

    const form = this.formContainer.querySelector('form') as HTMLFormElement;

    form.addEventListener('submit', e => {
      e.preventDefault();

      const formData = new FormData(form);
      const isUpdate = !!item;

      if (category === 'books' || category === 'certificates') {
        // Для категорий с файлами передаём FormData
        console.log(formData, isUpdate);
        this.onSubmit(formData, isUpdate);
      } else {
        // Для users собираем объект
        const data: any = {};
        for (const [key, value] of formData.entries()) {
          if (key === 'id') {
            data[key] = value ? parseInt(value as string) : 0;
          } else {
            data[key] = value;
          }
        }
        this.onSubmit(data, isUpdate);
      }
    });
  }

  private addEventListeners(): void {
    const categorySelect = this.root.querySelector(
      '#category',
    ) as HTMLSelectElement;
    categorySelect.addEventListener('change', () =>
      this.onCategoryChange(categorySelect.value),
    );

    const addBtn = this.root.querySelector('#addBtn') as HTMLButtonElement;
    addBtn.addEventListener('click', () => this.renderForm());

    this.list.addEventListener('active-changed', (e: Event) => {
      const { active } = (e as CustomEvent).detail;
      const item = this.list.items[active];
      this.onSelect(item.id);
    });

    this.list.addEventListener('delete-item', (e: Event) => {
      const { id } = (e as CustomEvent).detail;
      this.onDelete(id);
    });
  }
}
