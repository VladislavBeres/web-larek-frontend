
// Общая обёртка для ответа с массивом данных
export interface ApiListResponse<T> {
  total: number;
  items: T[];
}

// Товары

export interface Product {
  id: string;
  description?: string;
  image: string;
  title: string;
  price: number;
  category: string;
}

// счетчик корзина
export interface CartItem extends Product {
  quantity: number;
}


// События
// export interface AppEventMap {
//   'basket:open': void;
//   'basket:add': Product;
//   'basket:remove': string;
//   'basket:clear': void;
//   'order:submit': OrderData;
//   'modal:open': HTMLElement;
//   'modal:close': void;
//   'cart:changed': CartItem[]; // при изменении содержимого корзины
//   'cart:updated': { count: number }; // при обновлении счётчика
//   'checkout:start': void; // переход к оформлению
// }

// Данные заказа

export interface OrderData {
  items: string[];
  total: number;
  address: string;
  payment: PaymentMethod;
  email: string;
  phone: string;
}

export type PaymentMethod = "card" | "cash";


export interface ComponentInterface {
  element: HTMLElement;            // элемент модального окна
  isValid?(): boolean;
  reset?(): void
}

export interface CheckoutStepOneComponentInterface extends ComponentInterface {
  getFormData(): {
    address: string;
    payment: PaymentMethod;
  };

}

export interface CheckoutStepTwoComponentInterface extends ComponentInterface {
  getFormData(): {
    email: string;
    phone: string;
  };
}

// -------------------------------------

// Презентер оформления заказа
export interface CheckoutPresenterInterface {
  startCheckout(): void;
  nextStep(): void;
  submitOrder(): void;
  
}

export interface ValidationRule {
  validate: () => boolean;
  errorMessage: string;
};

// Компонент успешного оформления заказа
export interface OrderSuccessComponentInterface extends ComponentInterface {
  setTotal(total: number): void;
}

export interface OrderFormData {
  address?: string;
  payment?: "card" | "cash" | null;
  email?: string;
  phone?: string;
}