import { IProduct } from '@types';
import { IProductById } from '@types';
import { IProductOrNull } from '@types';
import { IProductOrString } from '@types';

export class Items {
    private activeItem: IProductOrNull = null;
    private items: IProduct[] = [];
    constructor() {}

    setItems(items: IProduct[]): void {
        this.items = items;
        if (this.activeItem && !this.items.some((p) => p.id === this.activeItem!.id)) {
            this.activeItem = null;
        }
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItemById(id: IProductById): IProductOrString {
        const item = this.items.find((item) => item.id === id);
        if (!item) {
            return `Товар ${id} закончился`;
        }
        return item;
    }

    setActiveItem(pickedCard: IProductById): void {
        if (!pickedCard) {
            this.activeItem = null;
            return;
        }
        this.activeItem = this.items.find((i) => i.id === pickedCard) ?? null;
    }

    getActiveItem(): IProductOrNull {
        return this.activeItem;
    }
}
