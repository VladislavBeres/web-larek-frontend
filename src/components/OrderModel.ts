import { OrderFormData } from "../types";
import { EventEmitter } from "./base/events";

export class OrderModel {
  private data: OrderFormData = {};
  private emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  setData<K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) {
    this.data[key] = value;
    this.validate();
  }

  getData(): OrderFormData {
    return this.data;
  }

  reset() {
    this.data = {};
    this.emitter.emit("errors:show", {});
  }

 validate() {
  const errors = this.getValidationErrors();
  this.emitter.emit("errors:show", errors);
}

getValidationErrors(): Record<string, string> {
  const errors: Record<string, string> = {};

  // Шаг 1
  if (!this.data.address?.trim()) {
    errors.address = "Введите адрес доставки";
  }
  if (!this.data.payment) {
    errors.payment = "Выберите способ оплаты";
  }

  // Шаг 2
  if (!this.data.email?.trim()) {
  errors.email = "Введите email";
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.email)) {
  errors.email = "Введите корректный email";
}
  if (!this.data.phone?.trim()) {
  errors.phone = "Введите номер телефона";
} else if (!/^(7|8)\d{10}$/.test(this.data.phone.replace(/\D/g, ""))) {
  errors.phone = "Введите корректный номер телефона";
}

  return errors;
}

isStepOneValid(): boolean {
  const errors = this.getValidationErrors();
  return !errors.address && !errors.payment;
}

isStepTwoValid(): boolean {
  const errors = this.getValidationErrors();
  return !errors.email && !errors.phone;
}
}