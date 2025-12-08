import { Component } from '@components/base/Component';
import { IEvents } from '@base/Events';
import { ensureElement } from '@utils/utils';

export interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected listElements: HTMLElement;
  protected totalElements: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.listElements = ensureElement('.basket__list', this.container);
    this.totalElements = ensureElement('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.orderButton.addEventListener('click', () => {
      this.events.emit('basket:order', {});
    });
  }

  set items(items: HTMLElement[]) {
    this.listElements.replaceChildren(...items);
    this.orderButton.disabled = items.length === 0;
  }

  set total(value: number) {
    this.totalElements.textContent = `${value} синапсов`;
  }
}
