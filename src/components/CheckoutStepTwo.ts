import { CheckoutStepTwoComponentInterface } from "../types";
import { TEMPLATE_SELECTORS } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { FormValidator } from "./FormValidator";

export class CheckoutStepTwo implements CheckoutStepTwoComponentInterface {
  element: HTMLElement;
  private form: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;
  private validator = new FormValidator();

  constructor() {
    this.element = cloneTemplate<HTMLFormElement>(TEMPLATE_SELECTORS.TemplateCheckoutStepTwo);
    this.form = this.element as HTMLFormElement;
    this.emailInput = this.form.querySelector('input[name="email"]')!;
    this.phoneInput = this.form.querySelector('input[name="phone"]')!;
    this.submitButton = this.form.querySelector('button[type="submit"]')!;
    this.errorContainer = this.form.querySelector('.form__errors')!;

    this.setupValidator();
    this.setEventListeners();
    this.setSubmitButtonEnabled(false);
  }

  private setupValidator() {
    this.validator.clearRules();
    this.validator.addRule(
      () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailInput.value.trim()),
      "Введите корректный Email"
    );
    
this.validator.addRule(
  () => {
    const raw = this.phoneInput.value.trim();
    if (/[a-zа-яё]/i.test(raw)) return false; // если есть буквы  буквы
    const digits = raw.replace(/\D/g, '');
    return /^(7|8)\d{10}$/.test(digits); // только если правильный формат
  },
  "Введите корректный номер телефона"
);
  }

  setEventListeners(): void {
    this.form.addEventListener('input', () => {
      this.clearError();
      this.validateForm();
    });

    this.form.addEventListener('submit', (e) => {
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

  private validateForm() {
    const result = this.validator.validate();

    if (result.valid) {
      this.clearError();
      this.setSubmitButtonEnabled(true);
    } else {
      this.showError(result.error!);
      this.setSubmitButtonEnabled(false);
    }
  }

  private emitSubmit() {
    const event = new CustomEvent("formSubmit", {
      bubbles: true,
      detail: this.getFormData(),
    });
    this.element.dispatchEvent(event);
  }

  getFormData(): { email: string; phone: string } {
    return {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    };
  }

  public showError(message: string) {
    this.errorContainer.textContent = message;
  }

  public clearError() {
    this.errorContainer.textContent = "";
  }

  public setSubmitButtonEnabled(enabled: boolean) {
    this.submitButton.disabled = !enabled;
  }

  public isValid(): boolean {
  return this.validator.validate().valid;
}

  public reset(): void {
    this.emailInput.value = "";
    this.phoneInput.value = "";
    this.clearError();
    this.setSubmitButtonEnabled(false);
  }
}