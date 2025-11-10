import { IProduct } from '@types';
import { IProductById } from '@types';

export class Cart {
    constructor(private cartItems: IProduct[] = []) {}

    addItem(item: IProduct): void {
        this.cartItems.push(item);
    }

    deleteItem(item: IProduct): void {
        this.cartItems = this.cartItems.filter((itemCart) => itemCart.id !== item.id);
    }

    deleteAll(): void {
        this.cartItems = [];
    }

    getCartList(): IProduct[] {
        return this.cartItems;
    }

    getQuantityItems(): number {
        return this.cartItems.length;
    }

    getAmount(): number {
        return this.cartItems.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    checkItem(item: IProductById): boolean {
        return this.cartItems.some((p) => p.id === item);
    }
}
