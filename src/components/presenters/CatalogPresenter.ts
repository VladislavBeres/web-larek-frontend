import { Product } from '../../types';
import { ProductCard } from '../productCard';
import { ProductModel } from '../productModel';
import { CartModel } from '../cartModel';
import { Modal } from '../Modal/Modal';
import { EventEmitter } from '../base/events';

export class ProductListPresenter {
  private model: ProductModel;
  private container: HTMLElement;
  private cartModel: CartModel;
  private modal: Modal;

  constructor(model: ProductModel, container: HTMLElement, cartModel: CartModel, modal: Modal) {
    this.model = model;
    this.container = container;
    this.cartModel = cartModel;
    this.modal = modal;
  }

  async init() {
    const products = await this.model.fetchProducts();
    this.render(products);
  }

  render(products: Product[]) {
    this.container.innerHTML = '';
    products.forEach(product => {
      const card = new ProductCard(product, this.cartModel, this.modal, new EventEmitter());
      this.container.append(card.getElement());
    });
  }
}