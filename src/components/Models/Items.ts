import { IProduct } from '@types';
import { TProductById } from '@types';
import { TProductOrNull } from '@types';
import { IEvents } from '../base/Events';

export class Items {
  private activeItem: TProductOrNull = null;
  private items: IProduct[] = [];
  constructor(private events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('gallery: updated');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: TProductById): IProduct {
    const product = this.items.find((item) => item.id === id);
    if (!product) {
      throw new Error("Item isn't found");
    }

    return product;
  }

  setActiveItem(pickedCard: TProductById): void {
    if (!pickedCard) {
      this.activeItem = null;
      return;
    }
    this.activeItem = this.items.find((i) => i.id === pickedCard) ?? null;
    this.events.emit('gallery:picked');
  }

  getActiveItem(): TProductOrNull {
    return this.activeItem;
  }
}
