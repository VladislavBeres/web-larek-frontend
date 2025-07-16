import { CheckoutStepOneComponentInterface } from "../types";
import { EventEmitter } from "./base/events";
import { PageView } from "./PageView";

export class CheckoutStepOne implements CheckoutStepOneComponentInterface {
  public element: HTMLElement;

  private addressInput: HTMLInputElement;
  private cardBtn: HTMLButtonElement;
  private cashBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private errorSpan: HTMLElement;
  private selectedPayment: "card" | "cash" | null = null;

constructor(private emitter: EventEmitter, private pageView: PageView) {
  this.element = this.pageView.getCheckoutStepOneTemplate().cloneNode(true) as HTMLFormElement;

  this.addressInput = this.element.querySelector("[name='address']")!;
  this.cardBtn = this.element.querySelector("button[name='card']")!;
  this.cashBtn = this.element.querySelector("button[name='cash']")!;
  this.nextBtn = this.element.querySelector("button[type='submit']")!;
  this.errorSpan = this.element.querySelector(".form__errors")!;

  this.setListeners();
}

  private setListeners() {
    this.cardBtn.addEventListener("click", () => {
      this.selectedPayment = "card";
      this.toggleButtons();
      this.emitter.emit("order:change", { key: "payment", value: "card" });
    });

    this.cashBtn.addEventListener("click", () => {
      this.selectedPayment = "cash";
      this.toggleButtons();
      this.emitter.emit("order:change", { key: "payment", value: "cash" });
    });

    this.addressInput.addEventListener("input", () => {
      this.emitter.emit("order:change", { key: "address", value: this.addressInput.value });
    });

    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      this.element.dispatchEvent(new CustomEvent("formSubmit", { bubbles: true }));
    });

    this.emitter.on("errors:show", (errors: Record<string, string>) => {
      this.showError(errors.payment || errors.address || "");
      this.nextBtn.disabled = !!(errors.payment || errors.address);
    });
  }

  private toggleButtons() {
    this.cardBtn.classList.toggle("button_alt-active", this.selectedPayment === "card");
    this.cashBtn.classList.toggle("button_alt-active", this.selectedPayment === "cash");
  }

  public reset() {
    this.addressInput.value = "";
    this.selectedPayment = null;
    this.toggleButtons();
    this.clearError();
    this.nextBtn.disabled = true;
  }

  private showError(message: string) {
    this.errorSpan.textContent = message;
  }

  private clearError() {
    this.errorSpan.textContent = "";
  }

  public getFormData() {
    return {
      address: this.addressInput.value,
      payment: this.selectedPayment!,
    };
  }

  public setEventListeners() {
    this.setListeners();
  }
}
