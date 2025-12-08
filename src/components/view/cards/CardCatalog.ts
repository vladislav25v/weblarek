import { ICardComponent, CardComponent } from './CardComponent';
import { ensureElement } from '@utils/utils';
import { CDN_URL, categoryMap } from '@utils/constants';

export interface ICardCatalog extends ICardComponent {
  category: string;
  image: string;
}

export class CardCatalog extends CardComponent<ICardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(
    container: HTMLElement,
    private selected?: () => void,
  ) {
    super(container);

    this.categoryElement = ensureElement('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (this.selected) {
      this.container.addEventListener('click', () => {
        if (this.selected) {
          this.selected();
        }
      });
    }
  }

  render(data?: Partial<ICardCatalog>): HTMLElement {
    super.render(data);

    if (!data) {
      return this.container;
    }

    if (data.category !== undefined) {
      this.categoryElement.textContent = data.category;
      this.categoryElement.classList.remove(...Object.values(categoryMap));

      const modifier = categoryMap[data.category as keyof typeof categoryMap];
      if (modifier) {
        this.categoryElement.classList.add(modifier);
      }
    }

    if (data.image !== undefined) {
      this.setImage(this.imageElement, CDN_URL + data.image, data.title);
    }

    return this.container;
  }
}
