import { OrderSuccessComponentInterface } from '../types'; 
import { EventEmitter } from './base/events';
import { PageView } from './PageView'; 


export class OrderSuccess implements OrderSuccessComponentInterface { 
  public element: HTMLElement; 
  private totalText: HTMLElement; 
  private closeButton: HTMLButtonElement;

  constructor(
    private pageView: PageView,
    private emitter: EventEmitter
  ) { 
    this.element = this.pageView.getOrderSuccessTemplate(); 
    this.totalText = this.element.querySelector('.order-success__description')!; 
    this.closeButton = this.element.querySelector('.order-success__close')!; 
    this.setEventListeners(); 
  } 
 
  private setEventListeners(): void { 
    this.closeButton.addEventListener('click', () => { 
      this.emitter.emit('order:close');
    }); 
  } 
 
  public setTotal(total: number): void { 
    this.totalText.textContent = `Списано ${total} синапсов`; 
  } 
}
