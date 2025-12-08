import { Component } from '@base/Component';
import { IEvents } from '@base/Events';
import { ensureElement } from '@utils/utils';

export interface IForm {
  valid?: boolean;
}

export abstract class FormComponent<T extends IForm> extends Component<T> {
  protected readonly formElement: HTMLFormElement;
  protected readonly submitButtonElement: HTMLButtonElement;
  protected readonly errorsElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected submitName: string,
  ) {
    super(container);

    this.formElement = this.container as HTMLFormElement;
    this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.formElement);
    this.errorsElement = ensureElement('.form__errors', this.formElement);

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(this.submitName);
    });
  }

  protected setError(validated?: (string | true | undefined)[]) {
    const messages = (validated ?? []).filter((msg): msg is string => typeof msg === 'string' && msg.length > 0);

    this.errorsElement.textContent = messages.join('. ');
  }

  protected setValid(valid?: boolean) {
    if (valid === undefined) return;

    this.submitButtonElement.disabled = !valid;
  }
}
