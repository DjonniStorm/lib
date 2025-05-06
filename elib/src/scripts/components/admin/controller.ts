import { AdminModel } from './model';
import { AdminView } from './view';

export class AdminController extends HTMLElement {
  private view: AdminView;
  private model: AdminModel;

  constructor() {
    super();
    const toggleCategoryCallback = this.toggleCategory.bind(this);
    const deleteCallback = this.deleteItem.bind(this);
    const selectCallback = this.selectItem.bind(this);
    const submitCallback = this.submitForm.bind(this);
    this.model = new AdminModel();
    this.view = new AdminView(
      this,
      this.model,
      toggleCategoryCallback,
      deleteCallback,
      selectCallback,
      submitCallback,
    );
  }

  connectedCallback() {
    this.view.render();
    this.getAllItems();
  }

  async getAllItems() {
    await this.model.fetchAll();
    this.view.update();
  }

  toggleCategory(category: string) {
    this.model.currentCategory = category as 'certificates' | 'books';
    this.view.update();
  }

  selectItem(id: number) {
    this.model.selectedId = id;
    this.view.update();
  }

  async deleteItem(id: number) {
    const category = this.model.currentCategory;
    this.model.deleteItemOptimistic(id, category);
    this.view.update();
    try {
      await this.model.deleteItem(id, category);
      await this.getAllItems();
    } catch (err) {
      console.error('Ошибка удаления:', err);
      this.model.rollbackOptimistic(category);
      this.view.update();
    }
  }

  async submitForm(data: FormData, isUpdate: boolean) {
    const category = this.model.currentCategory;
    this.model.addItemOptimistic(data, category);
    this.view.update();
    try {
      if (isUpdate) {
        await this.model.updateItem(data, category);
      } else {
        await this.model.addItem(data, category);
      }
      await this.getAllItems();
    } catch (err) {
      console.error('Ошибка операции:', err);
      this.model.rollbackOptimistic(category);
      this.view.update();
    }
  }
}
