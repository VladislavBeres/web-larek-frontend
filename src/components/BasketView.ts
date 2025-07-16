import { EventEmitter } from "./base/events";
import { PageView } from "./PageView";

export class BasketView {
  private container: HTMLElement;

  constructor(private emitter: EventEmitter, private pageView: PageView) {
    this.container = this.pageView.getBasketTemplate().cloneNode(true) as HTMLElement;
  }

  getContainer(): HTMLElement {
    return this.container;
  }

  setBasketContent(items: HTMLElement[], price: number) {
    const list = this.container.querySelector('.basket__list')!;
    const total = this.container.querySelector('.basket__price')!;
    const button = this.container.querySelector('.basket__button') as HTMLButtonElement;

    list.replaceChildren(...items);
    total.textContent = `${price} синапсов`;
    button.disabled = items.length === 0;

    button.onclick = () => {
      this.emitter.emit('checkout:start');
    };
  }
}