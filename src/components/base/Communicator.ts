import { IApi, IBuyer, IProduct } from '@types';
import { IRequest } from '@types';

export class Communicator {
    constructor(private response: IApi) {}

    getProducts(): Promise<IProduct[]> {
        return this.response.get<IRequest>('/product').then((r) => r.items);
    }

    sendOrder(customer: IBuyer) {
        this.response.post('/order', customer);
    }
}
