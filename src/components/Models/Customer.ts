import { IBuyer } from '@types';
import { IValidated } from '@types';

export class Customer {
    private customerData: Partial<IBuyer> = { payment: null };

    constructor() {}

    validateData(formData: Partial<IBuyer>): Partial<IValidated> {
        const validatedData: Partial<IValidated> = {};

        formData.payment === 'online' || formData.payment === 'uponDelivery'
            ? (validatedData.payment = true)
            : (validatedData.payment = 'Выберите метод оплаты');

        if (formData.address) {
            formData.address.trim().length > 3
                ? (validatedData.address = true)
                : (validatedData.address = 'Введите корректный адрес');
        } else {
            validatedData.address = 'Введите адрес';
        }

        if (formData.email) {
            const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

            regex.test(formData.email.trim())
                ? (validatedData.email = true)
                : (validatedData.email = 'Введите корректный адрес электропочты');
        } else {
            validatedData.email = 'Введите адрес электропочты';
        }

        if (formData.phone) {
            const regex = /^\+?\d[\d\s().-]{6,}$/;

            regex.test(formData.phone.trim())
                ? (validatedData.phone = true)
                : (validatedData.phone = 'Введите корректный номер телефона');
        } else {
            validatedData.phone = 'Введите номер телефона';
        }

        return validatedData;
    }

    addData(formData: Partial<IBuyer>): void {
        if (formData.payment) {
            this.customerData.payment = formData.payment;
        }
        if (formData.address) {
            this.customerData.address = formData.address;
        }
        if (formData.email) {
            this.customerData.email = formData.email;
        }
        if (formData.phone) {
            this.customerData.phone = formData.phone;
        }
    }

    getData(): Partial<IBuyer> {
        return this.customerData;
    }

    clearData(): void {
        this.customerData = {};
    }
}
