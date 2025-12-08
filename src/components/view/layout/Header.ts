import { Component } from '@base/Component';
import { IEvents } from '@base/Events';
import { ensureElement } from '@utils/utils';

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.counterElement = ensureElement('.header__basket-counter', this.container);
    this.basketButtonElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.basketButtonElement.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
