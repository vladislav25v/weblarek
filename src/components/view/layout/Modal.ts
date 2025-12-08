import { Component } from '@base/Component';
import { IEvents } from '@base/Events';
import { ensureElement } from '@utils/utils';

export interface IModal {
  contentElement?: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.contentElement = ensureElement('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.close();
    });
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }
  setContent(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }

  open(content?: HTMLElement) {
    if (content) {
      this.setContent(content);
    }
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }

  render(data?: Partial<IModal>): HTMLElement {
    if (data?.contentElement) {
      this.setContent(data.contentElement);
    }
    return this.container;
  }
}
