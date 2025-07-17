import { CheckoutStepTwoComponentInterface } from "../types";
import { EventEmitter } from "./base/events";
import { PageView } from "./PageView";

export class CheckoutStepTwo implements CheckoutStepTwoComponentInterface {
  public element: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLElement;

  constructor(private emitter: EventEmitter, private pageView: PageView) {
    const template = pageView.getCheckoutStepTwoTemplate();
    const form = template.content.querySelector('form');

    if (!form) {
      throw new Error("Форма не найдена в шаблоне #contacts");
    }

    this.element = form.cloneNode(true) as HTMLFormElement;

    this.emailInput = this.element.querySelector('input[name="email"]')!;
    this.phoneInput = this.element.querySelector('input[name="phone"]')!;
    this.submitButton = this.element.querySelector('button[type="submit"]')!;
    this.errorContainer = this.element.querySelector('.form__errors')!;

    this.setListeners();
  }

  private setListeners() {
    this.emailInput.addEventListener("input", () => {
      this.emitter.emit("order:change", {
        key: "email",
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.emitter.emit("order:change", {
        key: "phone",
        value: this.phoneInput.value,
      });
    });
    

    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      this.element.dispatchEvent(new CustomEvent("formSubmit", { bubbles: true }));
    });

    // Обработка ошибок
    this.emitter.on("errors:show", (errors: Record<string, string>) => {
      const error = errors.email || errors.phone || "";
      this.showError(error);
      this.submitButton.disabled = !!error;
    });
  }

  public reset() {
    this.emailInput.value = "";
    this.phoneInput.value = "";
    this.errorContainer.textContent = "";
    this.submitButton.disabled = true;
  }

  private showError(message: string) {
    this.errorContainer.textContent = message;
  }

  public getFormData() {
    return {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    };
  }
}

