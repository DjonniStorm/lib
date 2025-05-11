import { Certificate, Book } from '../../../types';

export class ItemsList extends HTMLElement {
  public set items(value: (Certificate | Book)[]) {
    this._listItems = value;
    this.update();
  }
  public get items(): (Certificate | Book)[] {
    return this._listItems;
  }

  public get activeItem(): number {
    return this._active;
  }

  private _listItems: (Certificate | Book)[] = [];

  private _active: number = -1;

  constructor() {
    super();
  }

  render(): string {
    if (!this._listItems || this._listItems.length === 0) {
      return `
        <style>
          .list-container {
            max-height: 400px;
            overflow-y: auto;
          }
        </style>
        <div class="list-container">
          <div class="list-group" id="list-tab">
            <p>Список пуст</p>
          </div>
        </div>
      `;
    }

    const alphabetSorted = this._listItems.sort((a, b) =>
      a.name.localeCompare(b.name, 'ru', {
        sensitivity: 'base',
        caseFirst: 'upper',
      }),
    );

    console.log('sorted', alphabetSorted, this._listItems);

    return `
      <style>
        .list-container {
          max-height: 400px;
          overflow-y: auto;
        }
        .list-group-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border: 1px solid #ddd;
          margin-bottom: 5px;
          cursor: pointer;
        }
        .list-group-item.active {
          background-color: #d9d9d9;
          color: #000;
          border-color: #d9d9d9;
        }
        .delete-btn {
          cursor: pointer;
          color: red;
          font-weight: bold;
        }
      </style>
      <div class="list-container">
        <div class="list-group" id="list-tab">
          ${alphabetSorted
            .map(
              (elem, index) => `
                <div 
                  class="list-group-item list-group-item-action ${index === this._active ? 'active' : ''}" 
                  id="list-${index}-list" 
                  data-id="${elem.id}">
                  <span>${elem.name}</span>
                  <span class="delete-btn" data-id="${elem.id}">×</span>
                </div>
              `,
            )
            .join('')}
        </div>
      </div>`;
  }

  addEventListeners(): void {
    const listItems = this.shadowRoot!.querySelectorAll('.list-group-item');

    listItems.forEach((item, index) => {
      item.addEventListener('click', e => {
        if ((e.target as HTMLElement).classList.contains('delete-btn')) {
          return;
        }

        listItems.forEach(elem => elem.classList.remove('active'));
        item.classList.add('active');
        this._active = index;
        this.dispatchEvent(
          new CustomEvent('active-changed', {
            detail: { active: this._active },
            composed: true,
            bubbles: true,
          }),
        );
      });
    });

    const deleteButtons = this.shadowRoot!.querySelectorAll('.delete-btn');

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id')!);

        this.dispatchEvent(
          new CustomEvent('delete-item', {
            detail: { id },
            composed: true,
            bubbles: true,
          }),
        );
      });
    });
  }

  update(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    this.shadowRoot!.innerHTML = this.render();
    this.addEventListeners();
  }

  connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = this.render();
    this.addEventListeners();
  }
}

customElements.define('items-list', ItemsList);
