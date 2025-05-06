import stylesString from './card.scss?inline';

export class Card extends HTMLElement {
  static get observedAttributes() {
    return ['img', 'name', 'link', 'icon'];
  }
  /* захардкоженная иконка на кнопке */
  private _icon: string = '/images/icons/add.svg';
  private _link: string = '';
  private _name: string = '';
  /* обложка */
  private _img: string = '';

  constructor() {
    super();
  }

  private render() {
    if (this._link !== '/') {
      this._icon = '/images/icons/resume.svg';
    }

    return `
    <style>
      ${stylesString}
    </style>
    
    <div class="card">
            <div class="card__cover">
                <img class="card__cover__img" src="${
                  this._img
                }" alt="${this._name} cover" lazy />
            </div>
            <div class="card__description">
                <span class="card__description__text">
                    ${this._name}
                </span>
                <button class="card__button">
                <a href="${this._link}">
                    <img src="${this._icon}" class="card__button__img" 
    alt="add icon" />
                </a>
                </button>
            </div>
          </div>
      `;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'img') {
      this._img = newValue;
    } else if (name === 'href') {
      this._link = newValue;
    } else if (name === 'name') {
      this._name = newValue;
    } else if (name === 'icon') {
      if (newValue) {
        this._icon = newValue;
      }
    }
  }

  updateData() {
    this._img = this.getAttribute('img') ?? '';
    this._link = this.getAttribute('link') ?? '';
    this._name = this.getAttribute('name') ?? '';
    this._icon = this.getAttribute('icon') ?? '/images/icons/add.svg';
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.updateData();
    this.shadowRoot!.innerHTML = this.render();
  }
}
