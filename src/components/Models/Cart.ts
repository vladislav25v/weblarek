import { IProduct } from '@types';
import { TProductById } from '@types';
import { IEvents } from '../base/Events';

export class Cart {
  private cartItems: TProductById[] = [];

  constructor(private events: IEvents) {}

  addItem(item: IProduct): void {
    if (!this.cartItems.includes(item.id)) this.cartItems.push(item.id);
    this.events.emit('cart:changed', {});
  }

  deleteItem(item: IProduct): void {
    this.cartItems = this.cartItems.filter((itemCart) => itemCart !== item.id);
    this.events.emit('cart:changed', {});
  }

  deleteAll(): void {
    this.cartItems = [];
    this.events.emit('cart:changed', {});
  }

  getCartList(): TProductById[] {
    return this.cartItems;
  }

  getQuantityItems(): number {
    return this.cartItems.length;
  }

  getAmount(products: IProduct[] | undefined): number {
    if (!products) {
      return 0;
    }

    return this.cartItems.reduce((sum, id) => {
      const product = products.find((p) => p.id === id);
      return sum + (product?.price ?? 0);
    }, 0);
  }

  checkItem(item: TProductById): boolean {
    return this.cartItems.includes(item);
  }
}
