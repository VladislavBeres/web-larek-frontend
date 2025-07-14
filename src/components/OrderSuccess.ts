import { OrderSuccessComponentInterface } from '../types';
import { TEMPLATE_SELECTORS } from '../utils/constants';
import { cloneTemplate } from '../utils/utils';

export class OrderSuccess implements OrderSuccessComponentInterface {
  element: HTMLElement;
  private totalText: HTMLElement;
  private closeButton: HTMLButtonElement;
  private onCloseCallback: () => void = () => {};

  constructor() {
    this.element = cloneTemplate<HTMLDivElement>(TEMPLATE_SELECTORS.TemplateOrderSuccess);
    this.totalText = this.element.querySelector('.order-success__description')!;
    this.closeButton = this.element.querySelector('.order-success__close')!;
    this.setEventListeners();
  }

  setEventListeners(): void {
    this.closeButton.addEventListener('click', () => {
      this.onCloseCallback();
    });
  }

  setTotal(total: number): void {
    this.totalText.textContent = `Списано ${total} синапсов`;
  }

  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

}