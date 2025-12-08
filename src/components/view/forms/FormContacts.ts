import { IEvents } from '@base/Events';
import { ensureElement } from '@utils/utils';
import { FormComponent, IForm } from './FormComponent';

export interface IFormContacts extends IForm {
  email: string;
  phone: string;
  validated?: {
    email?: string | true;
    phone?: string | true;
  };
}

export class FormContacts extends FormComponent<IFormContacts> {
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, 'form:contacts-submit');

    this.emailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.formElement);
    this.phoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.formElement);

    this.emailInputElement.addEventListener('input', () => {
      this.events.emit('form:contacts-change', {
        field: 'email',
        value: this.emailInputElement.value,
      });
    });

    this.phoneInputElement.addEventListener('input', () => {
      this.events.emit('form:contacts-change', {
        field: 'phone',
        value: this.phoneInputElement.value,
      });
    });
  }

  render(data?: Partial<IFormContacts>): HTMLElement {
    if (data) {
      if (data.email !== undefined) {
        this.emailInputElement.value = data.email;
      }

      if (data.phone !== undefined) {
        this.phoneInputElement.value = data.phone;
      }

      if (data.validated) {
        this.setError([data.validated.email, data.validated.phone]);
      }

      if (data.valid !== undefined) {
        this.setValid(data.valid);
      }
    }

    return this.container;
  }
}
