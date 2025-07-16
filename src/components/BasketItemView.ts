import { CartItem } from "../types";
import { PageView } from "./PageView";


export class BasketItemView {
  private element: HTMLElement;

  constructor(
    private item: CartItem,
    private index: number,
    private onRemove: (id: string) => void,
    private pageView: PageView
  ) {
    this.element = this.pageView.getCardBasketTemplate().cloneNode(true) as HTMLElement;
  }

  render(): HTMLElement {
    this.element.querySelector('.basket__item-index')!.textContent = String(this.index + 1);
    this.element.querySelector('.card__title')!.textContent = this.item.title;
    this.element.querySelector('.card__price')!.textContent = `${this.item.price * this.item.quantity} синапсов`;

    this.element.querySelector('.basket__item-delete')!.addEventListener('click', () => {
      this.onRemove(this.item.id);
    });

    return this.element;
  }
}