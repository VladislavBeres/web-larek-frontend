export class Modal {
  private modalElement: HTMLElement;
  private modalContent: HTMLElement;
  private closeButton: HTMLElement;

  constructor(selector: string) {
    this.modalElement = document.querySelector(selector)!;
    this.modalContent = this.modalElement.querySelector('.modal__content')!;
    this.closeButton = this.modalElement.querySelector('.modal__close')!;
    this.setEventListeners();
  }

  open(content: HTMLElement) {
    this.modalContent.innerHTML = "";
    this.modalContent.appendChild(content);
    this.modalElement.classList.add("modal_active");
  }

  close() {
    this.modalElement.classList.remove("modal_active");
    this.modalContent.innerHTML = "";
  }

  private onEscClose = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.close();
    }
  };

  setContent(content: HTMLElement) {
    this.modalContent.innerHTML = "";
    this.modalContent.appendChild(content);
  }

  setEventListeners() {
    this.closeButton.addEventListener("click", () => this.close());
    this.modalElement.addEventListener("click", (e) => {
      if (e.target === this.modalElement) {
        this.close();
      }
    });
    document.addEventListener("keydown", this.onEscClose);
  }
}