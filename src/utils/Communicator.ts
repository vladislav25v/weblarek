import { IApi, IBuyer, IOrderResult, IProduct } from '@types';

export class Communicator {
  constructor(private response: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.response.get<{ total: number; items: IProduct[] }>('/product').then((r) => r.items);
  }

  sendOrder(customer: IBuyer): Promise<IOrderResult> {
    return this.response.post<IOrderResult>('/order', customer);
  }
}
