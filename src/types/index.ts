
// Общая обёртка для ответа с массивом данных
export interface ApiListResponse<T> {
  total: number;
  items: T[];
}

// --- ТОВАРЫ ---

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
}

// --- КОРЗИНА ---

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

// --- СОБЫТИЯ ---

export interface AppEventMap {
  'basket:open': void;
  'basket:add': Product;
  'basket:remove': string; // productId
  'basket:clear': void;
  'order:submit': OrderData;
  'modal:open': HTMLElement;
  'modal:close': void;
}

// --- ДАННЫЕ ЗАКАЗА ---

export interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  payment: PaymentMethod;
  items: CartItem[];
}

export type PaymentMethod = 'online' | 'upon-receipt';

// --- ВАЛИДАЦИЯ ФОРМЫ ---

export interface FormFieldValidationResult {
  valid: boolean;
  errorMessage?: string;
}

// --- КОМПОНЕНТЫ ---

export interface ComponentProps {
  [key: string]: unknown;
}

export interface ComponentInterface {
  element: HTMLElement;            // элемент модального окна
  render(): void;
  setEventListeners(): void;
}

export interface ModalInterface extends ComponentInterface {
  closeButton: HTMLElement;
  open(content: HTMLElement): void;
  close(): void;
}

// --- УТИЛИТЫ ---

export type TemplateSelector = string;