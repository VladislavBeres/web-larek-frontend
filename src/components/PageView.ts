import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

export class PageView {
  private cartButton: HTMLElement;
  private basketCounter: HTMLElement;
  private showcaseContainer: HTMLElement;

  private basketTemplate: HTMLTemplateElement;
  private cardBasketTemplate: HTMLTemplateElement;
  private cardTemplate: HTMLTemplateElement;
  private cardPreviewTemplate: HTMLTemplateElement;
  private checkoutStepOneTemplate: HTMLTemplateElement;
  private checkoutStepTwoTemplate: HTMLTemplateElement;
  private orderSuccessTemplate: HTMLTemplateElement;

  constructor(private emitter: EventEmitter) {
    const cartButton = document.querySelector<HTMLElement>('.header__basket');
    const basketCounter = document.querySelector<HTMLElement>('.header__basket-counter');
    const showcaseContainer = document.querySelector<HTMLElement>('.gallery');

    if (!cartButton) {
      throw new Error('Кнопка открытия корзины .header__basket не найдена');
    }
    if (!basketCounter) {
      throw new Error('Счётчик корзины .header__basket-counter не найден');
    }
    if (!showcaseContainer) {
      throw new Error('Контейнер витрины .gallery не найден');
    }

    this.cartButton = cartButton;
    this.basketCounter = basketCounter;
    this.showcaseContainer = showcaseContainer;

    // Шаблоны
    this.basketTemplate = cloneTemplate('#basket');
    this.cardBasketTemplate = cloneTemplate('#card-basket');
    this.cardTemplate = cloneTemplate('#card-catalog');
    this.cardPreviewTemplate = cloneTemplate('#card-preview');
    this.checkoutStepOneTemplate = cloneTemplate('#order');
    this.checkoutStepTwoTemplate = document.querySelector<HTMLTemplateElement>('#contacts')!;
    this.orderSuccessTemplate = cloneTemplate('#success');

    // Слушатель на кнопку корзины
    this.cartButton.addEventListener('click', () => {
      this.emitter.emit('basket:open');
    });

    // Обновление счётчика корзины по событию
    this.emitter.on('cart:updated', ({ count }: { count: number }) => {
      this.updateBasketCounter(count);
    });
  }

  // Обновление счётчика корзины
  updateBasketCounter(count: number) {
    this.basketCounter.textContent = count.toString();
  }

  // Геттеры
  getShowcaseContainer(): HTMLElement {
    return this.showcaseContainer;
  }

  getBasketTemplate(): HTMLTemplateElement {
    return this.basketTemplate;
  }

  getCardTemplate(): HTMLTemplateElement {
    return this.cardTemplate;
  }

  getCardBasketTemplate(): HTMLTemplateElement {
    return this.cardBasketTemplate;
  }

  getCardPreviewTemplate(): HTMLTemplateElement {
    return this.cardPreviewTemplate;
  }

  getCheckoutStepOneTemplate(): HTMLTemplateElement {
    return this.checkoutStepOneTemplate;
  }

  getCheckoutStepTwoTemplate(): HTMLTemplateElement {
    return this.checkoutStepTwoTemplate;
  }

  getOrderSuccessTemplate(): HTMLTemplateElement {
    return this.orderSuccessTemplate;
  }
}