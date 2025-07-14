import {
  CartItem,
  CheckoutStepOneComponentInterface,
  CheckoutStepTwoComponentInterface,
  CheckoutPresenterInterface,
  OrderData
} from "../../types";
import { Api } from "../base/api";
import { EventEmitter } from "../base/events";
import { Modal } from "../Modal/Modal";
import { OrderSuccess } from "../OrderSuccess";

export class CheckoutPresenter implements CheckoutPresenterInterface {
  constructor(
    private stepOne: CheckoutStepOneComponentInterface,
    private stepTwo: CheckoutStepTwoComponentInterface,
    private modal: Modal,
    private api: Api,
    private events: EventEmitter,
    private cartItems: CartItem[]
  ) {}

public startCheckout() {
  this.modal.open(this.stepOne.element);
  this.stepOne.setEventListeners();

  this.stepOne.element.addEventListener("formSubmit", () => this.nextStep());
}

public nextStep() {
  if (!this.stepOne.isValid()) return;

  this.modal.setContent(this.stepTwo.element);
  this.stepTwo.setEventListeners();
  this.stepTwo.element.addEventListener("formSubmit", () => this.submitOrder());
}

  public submitOrder() {
    if (!this.stepTwo.isValid()) {
      this.stepTwo.showError("Пожалуйста, заполните все поля корректно");
      return;
    }

    const ids = this.cartItems.map((item) => item.id);
    const total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData: OrderData = {
      ...this.stepOne.getFormData(),
      ...this.stepTwo.getFormData(),
      items: ids,
      total,
    };

    this.api
      .post("/order", orderData)
      .then(() => {
        this.showSuccessModal(total);
        this.events.emit("basket:clear");
        this.stepOne.reset();
        this.stepTwo.reset();
      })
      .catch((err) => {
        this.stepTwo.showError("Ошибка при оформлении заказа: " + (err.message || err));
      });
  }

  private showSuccessModal(total: number) {
    const success = new OrderSuccess();
    success.setTotal(total);
    success.onClose(() => {
      this.modal.close();
      this.events.emit("modal:close");
    });
    this.modal.setContent(success.element);
  }
}