import { EventEmitter } from "../base/events";
import { BasketItemView } from "../BasketItemView";
import { BasketView } from "../BasketView";
import { CartModel } from "../cartModel";
import { Modal } from "../Modal/Modal";
import { PageView } from "../PageView";


export class BasketPresenter {
  constructor(
    private cartModel: CartModel,
    private basketView: BasketView,
    private pageView: PageView,
    private emitter: EventEmitter,
    private modal: Modal,
  ) {
    this.pageView.updateBasketCounter(this.cartModel.getAll().length);
    this.emitter.on('cart:changed', () => this.updateCounter());
    this.emitter.on('basket:open', () => this.openBasket());
  }

  private openBasket() {
    const items = this.cartModel.getAll();

    const views = items.map((item, i) =>
      new BasketItemView(item, i, this.removeItem.bind(this), this.pageView).render()
    );

    this.basketView.setBasketContent(views, this.cartModel.getTotalPrice());
    this.modal.open(this.basketView.getContainer());
  }

  private removeItem(id: string) {
    this.cartModel.remove(id);
    this.emitter.emit('cart:changed');
    this.openBasket();
  }

  private updateCounter() {
  this.pageView.updateBasketCounter(this.cartModel.getAll().length);
}
}