import { Product } from '../types';
import { Api } from './base/api';

export class ProductModel {
  private api: Api;
  private products: Product[] = [];

  constructor(api: Api) {
    this.api = api;
  }

  async fetchProducts(): Promise<Product[]> {
    const response = await this.api.get('/product') as { items: Product[] };
    this.products = response.items;
    return this.products;
  }

  getAll(): Product[] {
    return this.products;
  }
}