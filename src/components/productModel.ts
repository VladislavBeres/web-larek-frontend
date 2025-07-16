
import { Product } from '../types';
import { EventEmitter } from './base/events';

export class ProductModel {
  private products: Product[] = [];

  constructor(private emitter: EventEmitter) {}

  // Метод обновления данных в модели + эмит события для рендера
  setProducts(products: Product[]) {
    this.products = products;
    this.emitter.emit('products:updated', this.products);
  }

  getAll(): Product[] {
    return this.products;
  }
}