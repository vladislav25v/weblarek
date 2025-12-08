import { IEvents } from '@base/Events';
import { CardComponent, ICardComponent } from './CardComponent';
import { ensureElement } from '@utils/utils';
import { CDN_URL, categoryMap } from '@utils/constants';

export interface ICardPreview extends ICardComponent {
  category: string;
  image: string;
  description: string;
  addedToCart: boolean;
}

export class CardPreview extends CardComponent<ICardPreview> {
  protected descriptionElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected cardButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.categoryElement = ensureElement('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement('.card__text', this.container);
    this.cardButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.cardButtonElement.addEventListener('click', () => {
      this.events.emit('card:add-to-cart');
    });
  }

  render(data?: Partial<ICardPreview>): HTMLElement {
    super.render(data);

    if (!data) {
      return this.container;
    }

    if (data.category !== undefined) {
      this.categoryElement.textContent = data.category;
      this.categoryElement.classList.remove(...Object.values(categoryMap));

      const modified = categoryMap[data.category as keyof typeof categoryMap];
      if (modified) {
        this.categoryElement.classList.add(modified);
      }
    }

    if (data.image !== undefined) {
      this.setImage(this.imageElement, CDN_URL + data.image, data.title);
    }

    if (data.description !== undefined) {
      this.descriptionElement.textContent = data.description;
    }

    if (data.price === null) {
      this.cardButtonElement.textContent = 'Недоступно';
      this.cardButtonElement.disabled = true;
      return this.container;
    }

    if (data.addedToCart !== undefined) {
      if (data.addedToCart) {
        this.cardButtonElement.textContent = 'Удалить из корзины';
      } else {
        this.cardButtonElement.textContent = 'В корзину';
      }
      this.cardButtonElement.disabled = false;
    }

    return this.container;
  }
}
