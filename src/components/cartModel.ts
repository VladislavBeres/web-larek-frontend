import { CartItem, Product } from "../types";
import { STORAGE_KEYS } from "../utils/constants";
import { EventEmitter } from "./base/events";

export class CartModel {
  private items: Map<string, CartItem> = new Map();
  private storageKey = STORAGE_KEYS.cart;
  private emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
    this.loadFromStorage();
    this.emitUpdate();

    // Позволяет карточкам проверять наличие товара в корзине
    this.emitter.on("cart:check", (payload: { productId: string; callback: (inCart: boolean) => void }) => {
  const { productId, callback } = payload;
  if (typeof callback === "function") {
    callback(this.has(productId));
  }
});
  }

  add(product: Product): void {
    if (!this.items.has(product.id)) {
      this.items.set(product.id, { ...product, quantity: 1 });
      this.saveToStorage();
      this.emitUpdate();
    }
  }

  remove(productId: string): void {
    this.items.delete(productId);
    this.saveToStorage();
    this.emitUpdate();
  }

  has(productId: string): boolean {
    return this.items.has(productId);
  }

  getAll(): CartItem[] {
    return Array.from(this.items.values());
  }

  getTotalPrice(): number {
    return Array.from(this.items.values()).reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  clear(): void {
    this.items.clear();
    this.saveToStorage();
    this.emitUpdate();
  }

  getTotalItemsCount(): number {
    let total = 0;
    for (const item of this.items.values()) {
      total += item.quantity;
    }
    return total;
  }

  private emitUpdate(): void {
    this.emitter.emit("cart:updated", {
      count: this.getTotalItemsCount(),
      items: this.getAll(),
    });
  }

  private saveToStorage(): void {
    const itemsArray = Array.from(this.items.values());
    localStorage.setItem(this.storageKey, JSON.stringify(itemsArray));
  }

  private loadFromStorage(): void {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        const itemsArray: CartItem[] = JSON.parse(data);
        this.items = new Map(itemsArray.map(item => [item.id, item]));
      } catch (e) {
        console.error("Ошибка при загрузке корзины:", e);
        this.items.clear();
      }
    }
  }
}