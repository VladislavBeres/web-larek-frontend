import { Product } from "../types";
import { CDN_URL, TEMPLATE_SELECTORS } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { CartModel } from "./cartModel";
import { Modal } from "./Modal/Modal";

export class ProductCard {
  private product: Product;
  private element: HTMLElement;
  private cartModel: CartModel;
  private modal: Modal;
  private events: EventEmitter;

  constructor(product: Product, cartModel: CartModel, modal: Modal, events: EventEmitter) {
    this.product = product;
    this.cartModel = cartModel;
    this.modal = modal;
    this.element = this.renderCatalogCard();
    this.setEventListeners();
    this.events = events;
  }

  renderCatalogCard(): HTMLElement {
    const card = cloneTemplate<HTMLElement>(TEMPLATE_SELECTORS.Templatecard);
    card.querySelector(".card__title")!.textContent = this.product.title;
    card.querySelector(".card__price")!.textContent = `${this.product.price}`;
    const img = card.querySelector(".card__image") as HTMLImageElement;
    img.src = `${CDN_URL}/${this.product.image}`;
    img.alt = this.product.title;
    return card;
  }

renderPreviewCard(): HTMLElement {
  const preview = cloneTemplate<HTMLElement>("#card-preview");
  preview.querySelector(".card__title")!.textContent = this.product.title;
  preview.querySelector(".card__price")!.textContent = `${this.product.price ?? 0}`;
  
  const img = preview.querySelector(".card__image") as HTMLImageElement;
  img.src = `${CDN_URL}/${this.product.image}`;
  img.alt = this.product.title;

  const btn = preview.querySelector(".card__button") as HTMLButtonElement;

  if (this.product.price === null) {
    btn.textContent = "Бесценен";
    btn.disabled = true;
  } else {
    btn.textContent = this.cartModel.has(this.product.id) ? "Удалить из корзины" : "В корзину";
  }

  return preview;
}

  updateButtonText(button: HTMLButtonElement) {
    if (this.cartModel.has(this.product.id)) {
      button.textContent = "Удалить из корзины";
    } else {
      button.textContent = "В корзину";
    }
  }

  setEventListeners() {
      this.element.addEventListener("click", (evt) => {
        if ((evt.target as HTMLElement).closest(".card__button")) return;

        const previewCard = this.renderPreviewCard();
        const btn = previewCard.querySelector(".card__button") as HTMLButtonElement;

      btn.addEventListener("click", () => {
        if (this.cartModel.has(this.product.id)) {
          this.cartModel.remove(this.product.id);
        } else {
          this.cartModel.add(this.product);
        }
        this.updateButtonText(btn);
        this.events.emit("cart:changed", this.cartModel.getAll());
      });

      this.modal.open(previewCard);
      this.events.emit("cart:changed", this.cartModel.getAll());
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
