import { IBuyer } from '@types';
import { IEvents } from '../base/Events';

type ValidationResult<T> = { [K in keyof T]: true | string };
type TValidated = ValidationResult<IBuyer>;

export class Customer {
  private customerData: Partial<IBuyer> = { payment: null };

  constructor(private events: IEvents) {}

  validateData(formData: Partial<IBuyer>, strict = false): Partial<TValidated> {
    const validatedData: Partial<TValidated> = {};

    if (formData.payment === 'online' || formData.payment === 'uponDelivery') {
      validatedData.payment = true;
    } else if (strict) {
      validatedData.payment = 'Выберите метод оплаты';
    }

    if (formData.address !== undefined) {
      if (formData.address.trim().length > 3) {
        validatedData.address = true;
      } else {
        validatedData.address = 'Введите корректный адрес';
      }
    } else if (strict) {
      validatedData.address = 'Введите адрес';
    }

    if (formData.email !== undefined) {
      const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (regex.test(formData.email.trim())) {
        validatedData.email = true;
      } else {
        validatedData.email = 'Введите корректный адрес электропочты';
      }
    } else if (strict) {
      validatedData.email = 'Введите адрес электропочты';
    }

    if (formData.phone !== undefined) {
      const regex = /^\+?\d[\d\s().-]{6,}$/;

      if (regex.test(formData.phone.trim())) {
        validatedData.phone = true;
      } else {
        validatedData.phone = 'Введите корректный номер телефона';
      }
    } else if (strict) {
      validatedData.phone = 'Введите номер телефона';
    }

    return validatedData;
  }

  addData(formData: Partial<IBuyer>): void {
    if (formData.payment !== undefined) {
      this.customerData.payment = formData.payment;
    }
    if (formData.address !== undefined) {
      this.customerData.address = formData.address;
    }
    if (formData.email !== undefined) {
      this.customerData.email = formData.email;
    }
    if (formData.phone !== undefined) {
      this.customerData.phone = formData.phone;
    }
    this.events.emit('customer:changed');
  }

  getData(): Partial<IBuyer> {
    return this.customerData;
  }

  clearData(): void {
    this.customerData = { payment: null };
  }
}
