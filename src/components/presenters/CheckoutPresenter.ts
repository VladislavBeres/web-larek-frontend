import { CartItem, OrderFormData } from "../../types"; 
import { Api } from "../base/api"; 
import { EventEmitter } from "../base/events"; 
import { CheckoutStepOne } from "../CheckoutStepOne"; 
import { CheckoutStepTwo } from "../CheckoutStepTwo"; 
import { Modal } from "../Modal/Modal"; 
import { OrderModel } from "../OrderModel"; 
import { OrderSuccess } from "../OrderSuccess"; 
import { PageView } from "../PageView"; 
 
export class CheckoutPresenter { 
  private successModal: OrderSuccess;

  constructor( 
    private stepOne: CheckoutStepOne, 
    private stepTwo: CheckoutStepTwo, 
    private modal: Modal, 
    private api: Api, 
    private events: EventEmitter, 
    private getCartItems: () => CartItem[], 
    private orderModel: OrderModel, 
    private pageView: PageView 
  ) { 
    this.stepOne.element.addEventListener("formSubmit", () => this.nextStep()); 
    this.stepTwo.element.addEventListener("formSubmit", () => this.submitOrder()); 
    
    // Создаем экземпляр OrderSuccess один раз
    this.successModal = new OrderSuccess(this.pageView, this.events);
    this.events.on("order:close", () => {
      this.modal.close();
      this.events.emit("modal:close");
});
this.events.on("order:change", (data: { key: keyof OrderFormData; value: string | null }) => {
  this.orderModel.setData(data.key, data.value);
});
  } 
 
  public startCheckout() { 
    this.modal.setContent(this.stepOne.element); 
  } 
 
  public nextStep() { 
    if (!this.orderModel.isStepOneValid()) return; 
    this.modal.setContent(this.stepTwo.element); 
  } 
 
  public submitOrder() { 
    if (!this.orderModel.isStepTwoValid()) return; 
 
    const formData = this.orderModel.getData(); 
    const items = this.getCartItems(); 
    const ids = items.map((item) => item.id); 
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0); 
 
    this.api 
      .post("/order", { ...formData, items: ids, total }) 
      .then(() => { 
        this.showSuccessModal(total); 
        this.events.emit("basket:clear"); 
        this.orderModel.reset(); 
        this.stepOne.reset(); 
        this.stepTwo.reset(); 
      }) 
      .catch((err) => { 
        this.events.emit("errors:show", { server: err.message || "Ошибка сервера" }); 
      }); 
  } 
 
  private showSuccessModal(total: number): void { 
    this.successModal.setTotal(total); 
    this.modal.setContent(this.successModal.element); 
  } 
}