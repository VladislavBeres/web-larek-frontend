import { Product } from "../types";
import { CATEGORY_CLASSES, CDN_URL } from "../utils/constants";
import { EventEmitter } from "./base/events";
import { PageView } from "./PageView";

export class ProductCard {
  private product: Product;
  private events: EventEmitter;
  private pageView: PageView;

  private element: HTMLElement;
  private previewElement: HTMLElement;

  // DOM-элементы каталожной карточки
  private cardTitle: HTMLElement;
  private cardPrice: HTMLElement;
  private cardImage: HTMLImageElement;
  private cardCategory: HTMLElement;

  // DOM-элементы карточки-превью
  private previewTitle: HTMLElement;
  private previewPrice: HTMLElement;
  private previewImage: HTMLImageElement;
  private previewCategory: HTMLElement;
  private previewButton: HTMLButtonElement;

  constructor(product: Product, events: EventEmitter, pageView: PageView) {
    this.product = product;
    this.events = events;
    this.pageView = pageView;

    // Каталожная карточка
    const cardTemplate = this.pageView.getCardTemplate();
    this.element = cardTemplate.cloneNode(true) as HTMLElement;

    this.cardTitle = this.element.querySelector(".card__title")!;
    this.cardPrice = this.element.querySelector(".card__price")!;
    this.cardImage = this.element.querySelector(".card__image")!;
    this.cardCategory = this.element.querySelector(".card__category")!;

    // Превью карточка
    const previewTemplate = this.pageView.getCardPreviewTemplate();
    this.previewElement = previewTemplate.cloneNode(true) as HTMLElement;

    this.previewTitle = this.previewElement.querySelector(".card__title")!;
    this.previewPrice = this.previewElement.querySelector(".card__price")!;
    this.previewImage = this.previewElement.querySelector(".card__image")!;
    this.previewCategory = this.previewElement.querySelector(".card__category")!;
    this.previewButton = this.previewElement.querySelector(".card__button")!;

    // Инициализация контента
    this.setTitleAndPrice(this.cardTitle, this.cardPrice);
    this.setupImage(this.cardImage);
    this.setupCategory(this.cardCategory);

    this.setTitleAndPrice(this.previewTitle, this.previewPrice);
    this.setupImage(this.previewImage);
    this.setupCategory(this.previewCategory);

    this.setupPreviewButton();
    this.setEventListeners();

    // Подписка на обновление корзины
    this.events.on("cart:updated", () => {
      this.updatePreviewButtonText();
    });
  }

  private setTitleAndPrice(titleEl: HTMLElement, priceEl: HTMLElement) {
    titleEl.textContent = this.product.title;
    priceEl.textContent = `${this.product.price ?? 0}`;
  }

  private setupImage(imageEl: HTMLImageElement) {
    imageEl.src = `${CDN_URL}/${this.product.image}`;
    imageEl.alt = this.product.title;
  }

  private setupCategory(categoryEl: HTMLElement) {
    categoryEl.textContent = this.product.category;
    categoryEl.className = "card__category";

    const categoryKey = CATEGORY_CLASSES[this.product.category.toLowerCase()];
    if (categoryKey) {
      categoryEl.classList.add(`card__category_${categoryKey}`);
    }
  }

  private setupPreviewButton() {
    if (this.product.price === null) {
      this.previewButton.textContent = "Бесценен";
      this.previewButton.disabled = true;
    } else {
      this.previewButton.disabled = false;
      this.updatePreviewButtonText();
    }
  }

  private updatePreviewButtonText() {
    this.events.emit("cart:check", {
      productId: this.product.id,
      callback: (inCart: boolean) => {
        this.previewButton.textContent = inCart ? "Удалить из корзины" : "В корзину";
      },
    });
  }

  private setEventListeners() {
    // Клик по каталожной карточке (открытие превью)
    this.element.addEventListener("click", (evt) => {
      if (!(evt.target instanceof HTMLElement)) return;
      if (!evt.target.closest(".card__button")) {
        this.events.emit("product:open-preview", this.previewElement);
        this.events.emit("card:open", this.product);
      }
    });

    // Клик по кнопке в превью
    this.previewButton.addEventListener("click", () => {
      this.events.emit("product:add-to-cart", this.product);
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}