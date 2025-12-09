import { Component } from '@base/Component';
import { ensureElement } from '@utils/utils';

export interface ICardComponent {
  title: string;
  price: number | null;
}

export abstract class CardComponent<T extends ICardComponent> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  render(data?: Partial<T>): HTMLElement {
    super.render(data);

    if (data?.price !== undefined) {
      this.priceElement.textContent = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
    }

    return this.container;
  }
}
