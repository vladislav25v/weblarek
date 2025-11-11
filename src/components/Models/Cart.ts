import { IProduct } from '@types';
import { IProductById } from '@types';

export class Cart {
    private cartItems: IProductById[] = [];

    constructor() {}

    addItem(item: IProduct): void {
        if (!this.cartItems.includes(item.id)) this.cartItems.push(item.id);
    }

    deleteItem(item: IProduct): void {
        this.cartItems = this.cartItems.filter((itemCart) => itemCart !== item.id);
    }

    deleteAll(): void {
        this.cartItems = [];
    }

    getCartList(): IProductById[] {
        return this.cartItems;
    }

    getQuantityItems(): number {
        return this.cartItems.length;
    }

    getAmount(products: IProduct[]): number {
        return this.cartItems.reduce((sum, id) => {
            const product = products.find((p) => p.id === id);
            return sum + (product?.price ?? 0);
        }, 0);
    }

    checkItem(item: IProductById): boolean {
        return this.cartItems.includes(item);
    }
}
