import { OrderSuccessComponentInterface } from '../types';
import { PageView } from './PageView';

export class OrderSuccess implements OrderSuccessComponentInterface {
  element: HTMLElement;
  private totalText: HTMLElement;
  private closeButton: HTMLButtonElement;
  private onCloseCallback: () => void = () => {};

  constructor(pageView: PageView) {
    this.element = pageView.getOrderSuccessTemplate();
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
