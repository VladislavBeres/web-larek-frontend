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

    // Подписка на обновление продуктов
    this.model['emitter'].on('products:updated', (products: Product[]) => {
      this.render(products);
    });

    // Подписка на добавление/удаление из корзины
    this.events.on('product:add-to-cart', (product: Product) => {
      if (this.cartModel.has(product.id)) {
        this.cartModel.remove(product.id);
      } else {
        this.cartModel.add(product);
      }
      this.events.emit('cart:changed', this.cartModel.getAll());
    });

    // Подписка на открытие превью
    this.events.on('product:open-preview', (previewContent: HTMLElement) => {
      this.modal.open(previewContent);
    });
  }

  public init() {
    const products = this.model.getAll();
    this.render(products);
  }

  private render(products: Product[]) {
    this.container.innerHTML = '';
    products.forEach(product => {
      const card = new ProductCard(product, this.events, this.pageView);
      this.container.append(card.getElement());
    });
    
  }
}