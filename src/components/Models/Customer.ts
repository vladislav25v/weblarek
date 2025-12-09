import { IBuyer } from '@types';
import { IEvents } from '../base/Events';

type ValidationResult<T> = { [K in keyof T]: true | string };
type TValidated = ValidationResult<IBuyer>;

export class Customer {
  private customerData: Partial<IBuyer> = { payment: null };

  constructor(private events: IEvents) {}

  validateData(formData: Partial<IBuyer>): Partial<TValidated> {
    const validatedData: Partial<TValidated> = {};

    // payment
    if (formData.payment === 'online' || formData.payment === 'uponDelivery') {
      validatedData.payment = true;
    } else {
      validatedData.payment = 'Выберите метод оплаты';
    }

    // address
    if (formData.address) {
      if (formData.address.trim().length > 3) {
        validatedData.address = true;
      } else {
        validatedData.address = 'Введите корректный адрес';
      }
    } else {
      validatedData.address = 'Введите адрес';
    }

    // email
    if (formData.email) {
      const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

      if (regex.test(formData.email.trim())) {
        validatedData.email = true;
      } else {
        validatedData.email = 'Введите корректный адрес электропочты';
      }
    } else {
      validatedData.email = 'Введите адрес электропочты';
    }

    // phone
    if (formData.phone) {
      const regex = /^\+?\d[\d\s().-]{6,}$/;

      if (regex.test(formData.phone.trim())) {
        validatedData.phone = true;
      } else {
        validatedData.phone = 'Введите корректный номер телефона';
      }
    } else {
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
