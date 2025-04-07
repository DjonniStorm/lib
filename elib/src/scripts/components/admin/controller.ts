// src/Admin.ts
import { AdminModel } from './model';
import { AdminView } from './view';

export class AdminController extends HTMLElement {
  private model: AdminModel;
  private view: AdminView;

  constructor() {
    super();
    this.model = new AdminModel();
    this.view = new AdminView(
      this,
      this.model,
      this.handleCategoryChange.bind(this),
      this.handleAdd.bind(this),
      this.handleUpdate.bind(this),
      this.handleDelete.bind(this),
      this.handleSelect.bind(this),
      this.handleSubmit.bind(this), // Добавляем колбэк onSubmit
    );
  }

  connectedCallback(): void {
    this.style.display = 'block';
    this.style.width = '100%';
    this.style.minHeight = '100%';
    this.style.padding = '20px';
    this.model
      .fetchAll()
      .then(() => {
        this.view.render();
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
        this.innerHTML = '<p>Не удалось загрузить данные.</p>';
      });
  }

  private handleCategoryChange(category: string): void {
    this.model.setCurrentCategory(
      category as 'certificates' | 'books' | 'users',
    );
    this.model.setSelectedId(null);
    this.view.update();
  }

  private async handleAdd(item: any): Promise<void> {
    try {
      await this.model.addItem(item, this.model.getCurrentCategory());
      this.model.setSelectedId(null);
      this.view.update();
    } catch (error) {
      console.error('Ошибка при добавлении:', error);
      alert('Не удалось добавить элемент.');
    }
  }

  private async handleUpdate(item: any): Promise<void> {
    try {
      await this.model.updateItem(item, this.model.getCurrentCategory());
      this.view.update();
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
      alert('Не удалось обновить элемент.');
    }
  }

  private async handleDelete(id: number): Promise<void> {
    try {
      await this.model.deleteItem(id, this.model.getCurrentCategory());
      this.view.update();
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('Не удалось удалить элемент.');
    }
  }

  private handleSelect(id: number): void {
    this.model.setSelectedId(id);
    this.view.update();
  }

  // Новый колбэк для отправки данных через модель
  private async handleSubmit(
    data: FormData | any,
    isUpdate: boolean,
  ): Promise<void> {
    const category = this.model.getCurrentCategory();
    try {
      if (isUpdate) {
        // Если это FormData, убедимся что ID присутствует
        if (data instanceof FormData) {
          const selectedItem = this.model.getSelectedItem();
          if (selectedItem && !data.get('id')) {
            data.append('id', selectedItem.id.toString());
          }
        }
        await this.model.updateItem(data, category);
      } else {
        await this.model.addItem(data, category);
      }
      this.model.setSelectedId(null);
      this.view.update();
    } catch (error) {
      console.error(
        `Ошибка при ${isUpdate ? 'обновлении' : 'добавлении'} (${category}):`,
        error,
      );
      alert(`Не удалось ${isUpdate ? 'обновить' : 'добавить'} элемент.`);
    }
  }
}

customElements.define('admin-controller', AdminController);
