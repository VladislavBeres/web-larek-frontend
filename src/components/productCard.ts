import { Product } from "../types";
import { CATEGORY_CLASSES, CDN_URL } from "../utils/constants";
import { EventEmitter } from "./base/events";
import { CartModel } from "./cartModel";
import { Modal } from "./Modal/Modal";
import { PageView } from "./PageView";

export class ProductCard {
  private product: Product;
  private element: HTMLElement;
  private cartModel: CartModel;
  private modal: Modal;
  private events: EventEmitter;
  private pageView: PageView;

  constructor(
    product: Product,
    cartModel: CartModel,
    modal: Modal,
    events: EventEmitter,
    pageView: PageView
  ) {
    this.product = product;
    this.cartModel = cartModel;
    this.modal = modal;
    this.events = events;
    this.pageView = pageView;

    this.element = this.renderCatalogCard();
    this.setEventListeners();
  }

  private renderCatalogCard(): HTMLElement {
    const template = this.pageView.getCardTemplate();
    const card = template.cloneNode(true) as HTMLElement;

    card.querySelector(".card__title")!.textContent = this.product.title;
    card.querySelector(".card__price")!.textContent = `${this.product.price}`;

    const img = card.querySelector(".card__image") as HTMLImageElement;
    img.src = `${CDN_URL}/${this.product.image}`;
    img.alt = this.product.title;

    const categoryEl = card.querySelector(".card__category");
    if (categoryEl) {
      categoryEl.textContent = this.product.category;

      const categoryKey = CATEGORY_CLASSES[this.product.category.toLowerCase()];
      if (categoryKey) {
        categoryEl.classList.add(`card__category_${categoryKey}`);
      }
    }

    return card;
  }

private renderPreviewCard(): HTMLElement {
  const template = this.pageView.getCardPreviewTemplate();
  const preview = template.cloneNode(true) as HTMLElement;

  preview.querySelector(".card__title")!.textContent = this.product.title;
  preview.querySelector(".card__price")!.textContent = `${this.product.price ?? 0}`;

  const img = preview.querySelector(".card__image") as HTMLImageElement;
  img.src = `${CDN_URL}/${this.product.image}`;
  img.alt = this.product.title;

  const categoryEl = preview.querySelector(".card__category");
  if (categoryEl) {
    categoryEl.textContent = this.product.category;
    categoryEl.className = "card__category"; // сброс классов

    const categoryKey = CATEGORY_CLASSES[this.product.category.toLowerCase()];
    if (categoryKey) {
      categoryEl.classList.add(`card__category_${categoryKey}`);
    }
  }

  const btn = preview.querySelector(".card__button") as HTMLButtonElement;
  if (this.product.price === null) {
    btn.textContent = "Бесценен";
    btn.disabled = true;
  } else {
    btn.textContent = this.cartModel.has(this.product.id) ? "Удалить из корзины" : "В корзину";
    btn.disabled = false;
  }

  return preview;
}

  private updateButtonText(button: HTMLButtonElement) {
    if (this.cartModel.has(this.product.id)) {
      button.textContent = "Удалить из корзины";
    } else {
      button.textContent = "В корзину";
    }
  }

  private setEventListeners() {
    this.element.addEventListener("click", (evt) => {
      if (!(evt.target instanceof HTMLElement)) return;
      if (!evt.target.closest(".card__button")) {
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
      }
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
}