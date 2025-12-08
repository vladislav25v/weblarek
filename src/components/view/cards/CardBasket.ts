import { CardComponent, ICardComponent } from './CardComponent';
import { ensureElement } from '@utils/utils';

export interface ICardBasket extends ICardComponent {
  index: number;
}

export type TBasketRemove = {
  toRemove?: () => void;
};

export class CardBasket extends CardComponent<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected action?: TBasketRemove,
  ) {
    super(container);

    this.indexElement = ensureElement('.basket__item-index', this.container);
    this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (this.action?.toRemove) {
      this.deleteButtonElement.addEventListener('click', (event) => {
        event.stopPropagation();
        if (this.action?.toRemove) {
          this.action.toRemove();
        }
      });
    }
  }

  render(data?: Partial<ICardBasket>): HTMLElement {
    super.render(data);

    if (data?.index !== undefined) {
      this.indexElement.textContent = String(data.index);
    }

    return this.container;
  }
}
