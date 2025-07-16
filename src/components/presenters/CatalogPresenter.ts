import { Product } from '../../types';
import { ProductCard } from '../productCard';
import { ProductModel } from '../productModel';
import { CartModel } from '../cartModel';
import { Modal } from '../Modal/Modal';
import { EventEmitter } from '../base/events';
import { PageView } from '../PageView';

export class CatalogPresenter {
  private model: ProductModel;
  private container: HTMLElement;
  private cartModel: CartModel;
  private modal: Modal;
  private events: EventEmitter;
  private pageView: PageView;

  constructor(
    model: ProductModel,
    container: HTMLElement,
    cartModel: CartModel,
    modal: Modal,
    events: EventEmitter,
    pageView: PageView
  ) {
    this.model = model;
    this.container = container;
    this.cartModel = cartModel;
    this.modal = modal;
    this.events = events;
    this.pageView = pageView;

    this.model['emitter'].on('products:updated', (products: Product[]) => {
      this.render(products);
    });
  }

  init() {
    const products = this.model.getAll();
    this.render(products);
  }

  render(products: Product[]) {
    this.container.innerHTML = '';
    products.forEach(product => {
      // Передаём pageView и общий events
      const card = new ProductCard(product, this.cartModel, this.modal, this.events, this.pageView);
      this.container.append(card.getElement());
    });
  }
}