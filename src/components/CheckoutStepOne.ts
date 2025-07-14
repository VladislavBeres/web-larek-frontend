import { cloneTemplate } from "../utils/utils";
import { FormValidator } from "./FormValidator";
import { CheckoutStepOneComponentInterface } from "../types";
import { TEMPLATE_SELECTORS } from "../utils/constants";

export class CheckoutStepOne implements CheckoutStepOneComponentInterface {
  public element: HTMLElement;
  private form: HTMLFormElement;
  private addressInput: HTMLInputElement;
  private cardBtn: HTMLButtonElement;
  private cashBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private errorSpan: HTMLElement;

  private selectedPayment: "card" | "cash" | null = null;
  private validator = new FormValidator();

  constructor() {
    this.element = cloneTemplate<HTMLFormElement>(TEMPLATE_SELECTORS.TemplateCheckoutStepOne);
    this.form = this.element as HTMLFormElement;
    this.addressInput = this.form.querySelector("[name='address']")!;
    this.cardBtn = this.form.querySelector("button[name='card']")!;
    this.cashBtn = this.form.querySelector("button[name='cash']")!;
    this.nextBtn = this.form.querySelector("button[type='submit']")!;
    this.errorSpan = this.form.querySelector(".form__errors")!;

    this.setupValidator();
    this.setEventListeners();
  }

  private setupValidator() {
    this.validator.clearRules();
    this.validator.addRule(() => this.selectedPayment !== null, "Выберите способ оплаты");
    this.validator.addRule(() => this.addressInput.value.trim() !== "", "Введите адрес доставки");
  }

  public setEventListeners(): void {
    this.cardBtn.addEventListener("click", () => {
      this.selectedPayment = "card";
      this.updatePaymentButtons();
      this.validateForm();
    });

    this.cashBtn.addEventListener("click", () => {
      this.selectedPayment = "cash";
      this.updatePaymentButtons();
      this.validateForm();
    });

    this.addressInput.addEventListener("input", () => {
      this.validateForm();
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const result = this.validator.validate();
      if (result.valid) {
        this.clearError();
        this.emitSubmit();
      } else {
        this.showError(result.error!);
      }
    });
  }

  private updatePaymentButtons() {
    this.cardBtn.classList.toggle("button_alt-active", this.selectedPayment === "card");
    this.cashBtn.classList.toggle("button_alt-active", this.selectedPayment === "cash");
  }

  private validateForm() {
    const result = this.validator.validate();
    if (result.valid) {
      this.clearError();
      this.setNextButtonEnabled(true);
    } else {
      this.showError(result.error!);
      this.setNextButtonEnabled(false);
    }
  }

  private emitSubmit() {
    this.element.dispatchEvent(new CustomEvent("formSubmit", { bubbles: true }));
  }

  private showError(message: string) {
    this.errorSpan.textContent = message;
  }

  private clearError() {
    this.errorSpan.textContent = "";
  }

  private setNextButtonEnabled(enabled: boolean) {
    this.nextBtn.disabled = !enabled;
  }

public getFormData() {
  return {
    payment: this.selectedPayment!,
    address: this.addressInput.value.trim(),
  };
}

  public isValid(): boolean {
  return this.validator.validate().valid;
}

  public reset(): void {
    this.addressInput.value = "";
    this.selectedPayment = null;
    this.updatePaymentButtons();
    this.clearError();
    this.setNextButtonEnabled(false);
  }
}