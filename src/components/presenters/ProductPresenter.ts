import { Product } from "../../types";
import { Api } from "../base/api";
import { EventEmitter } from "../base/events";
import { ProductModel } from "../productModel";


export class ProductPresenter {
  constructor(
    private api: Api,
    private model: ProductModel,
    private emitter: EventEmitter
  ) {}

  async loadProducts() {
    try {
      const response = await this.api.get('/product') as { items: Product[] };
      this.model.setProducts(response.items);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      this.emitter.emit('products:error', error);
    }
  }
}