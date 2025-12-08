import { Component } from '@components/base/Component';
import { IEvents } from '@base/Events';
import { ensureElement } from '@utils/utils';

export interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.descriptionElement = ensureElement('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:success-close', {});
    });
  }

  render(data?: Partial<ISuccess>): HTMLElement {
    if (data && data.total !== undefined) {
      this.descriptionElement.textContent = `Списано ${data.total} синапсов`;
    }
    return this.container;
  }
}
