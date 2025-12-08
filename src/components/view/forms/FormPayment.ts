import { IEvents } from '@base/Events';
import { ensureElement } from '@utils/utils';
import { FormComponent, IForm } from './FormComponent';
import { TPayment } from '@types';

export interface IFormPayment extends IForm {
  payment: TPayment;
  address: string;
  validated?: {
    payment?: string | true;
    address?: string | true;
  };
}

export class FormPayment extends FormComponent<IFormPayment> {
  protected addressInputElement: HTMLInputElement;
  protected cardButtonElement: HTMLButtonElement;
  protected cashButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, 'form:payment-submit');

    this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.formElement);
    this.cardButtonElement = ensureElement<HTMLButtonElement>('button[name="card"]', this.formElement);
    this.cashButtonElement = ensureElement<HTMLButtonElement>('button[name="cash"]', this.formElement);

    this.addressInputElement.addEventListener('input', () => {
      this.events.emit('form:payment-change', {
        field: 'address',
        value: this.addressInputElement.value,
      });
    });

    this.cardButtonElement.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('form:payment-change', {
        field: 'payment',
        value: 'online',
      });
    });

    this.cashButtonElement.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('form:payment-change', {
        field: 'payment',
        value: 'uponDelivery',
      });
    });
  }

  protected setPayment(payment: TPayment) {
    this.cardButtonElement.classList.remove('button_alt-active');
    this.cashButtonElement.classList.remove('button_alt-active');

    if (payment === 'online') {
      this.cardButtonElement.classList.add('button_alt-active');
    } else if (payment === 'uponDelivery') {
      this.cashButtonElement.classList.add('button_alt-active');
    }
  }

  render(data?: Partial<IFormPayment>): HTMLElement {
    if (data) {
      if (data.address !== undefined) {
        this.addressInputElement.value = data.address;
      }

      if (data.payment !== undefined) {
        this.setPayment(data.payment);
      }

      if (data.validated) {
        this.setError([data.validated.payment, data.validated.address]);
      }

      if (data.valid !== undefined) {
        this.setValid(data.valid);
      }
    }

    return this.container;
  }
}
