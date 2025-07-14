import { TEMPLATE_SELECTORS } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { CartModel } from "./cartModel";
import { Modal } from "./Modal/Modal";

export class BasketView {
  private element: HTMLElement;

  constructor(
    private cartModel: CartModel,
    private modal: Modal,
    private events: EventEmitter
  ) {
    this.element = document.querySelector(".header__basket")!;
    this.setEventListeners();
    this.events.on("cart:changed", this.render.bind(this));
  }

  setEventListeners() {
    this.element.addEventListener("click", () => {
      this.modal.open(this.renderBasket());
    });
  }

renderBasket(): HTMLElement {
  const basket = cloneTemplate<HTMLElement>(TEMPLATE_SELECTORS.Templatebasket);
  const list = basket.querySelector(".basket__list")!;
  const price = basket.querySelector(".basket__price")!;
  const checkoutBtn = basket.querySelector(".basket__button") as HTMLButtonElement;

  const items = this.cartModel.getAll();

  list.innerHTML = "";

  items.forEach((item, index) => {
    const itemEl = cloneTemplate<HTMLElement>("#card-basket");
    itemEl.querySelector(".basket__item-index")!.textContent = String(index + 1);
    itemEl.querySelector(".card__title")!.textContent = item.title;
    itemEl.querySelector(".card__price")!.textContent = `${item.price * item.quantity} синапсов`;

    itemEl.querySelector(".basket__item-delete")!.addEventListener("click", () => {
      this.cartModel.remove(item.id);
      this.events.emit("cart:changed", this.cartModel.getAll());
      const newBasketContent = this.renderBasket();
      this.modal.setContent(newBasketContent);
    });

    list.appendChild(itemEl);
  });

  price.textContent = `${this.cartModel.getTotalPrice()} синапсов`;

  // отключить кнопку если корзина пуста
  checkoutBtn.disabled = items.length === 0;

  if (items.length > 0) {
  checkoutBtn.onclick = () => {
  this.events.emit("checkout:start");
};
  }

  return basket;
}

  render() {
    const counter = this.element.querySelector(".header__basket-counter")!;
    counter.textContent = this.cartModel.getAll().length.toString();
  }
}