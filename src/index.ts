//  index.ts:

import { Api } from './components/base/api';
import { CartModel } from './components/cartModel';
import { ProductListPresenter } from './components/presenters/CatalogPresenter';
import { ProductModel } from './components/productModel';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Modal } from './components/Modal/Modal';
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/BasketView';
import { CheckoutStepOne } from './components/CheckoutStepOne';
import { CheckoutPresenter } from './components/presenters/CheckoutPresenter';
import { CheckoutStepTwo } from './components/CheckoutStepTwo';

const emitter = new EventEmitter();

// Создаём экземпляр API клиента
const api = new Api(API_URL);

// Создаём модель с API
const productModel = new ProductModel(api);

// Находим контейнер каталога
const productListContainer = document.querySelector('.gallery') as HTMLElement;

if (!productListContainer) {
  throw new Error('Контейнер для каталога не найден');
}

// ------------------

// Создаём корзину и модалку
const cartModel = new CartModel(emitter);
const modal = new Modal("#modal-container");

const productListPresenter = new ProductListPresenter(productModel, productListContainer, cartModel, modal);
productListPresenter.init();

const cartButton = document.querySelector('.header__basket');

cartButton.addEventListener('click', () => {
  const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket');
  if (!basketTemplate) {
    throw new Error('Шаблон корзины #basket не найден');
  }
  // Получаем первый элемент из шаблона (элемент div.basket)
  const basketContent = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

  // Тут можно обновить basketContent, если нужно (например, список товаров)

  modal.open(basketContent);
});

// -------------

new BasketView(cartModel, modal, new EventEmitter());

// -----------

const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

function updateBasketCounter(count: number) {
  basketCounter.textContent = count.toString();
}

// Первичная отрисовка
updateBasketCounter(cartModel.getTotalItemsCount());

// Слушатель события с типизацией параметра
emitter.on('cart:updated', ({ count }: { count: number }) => {
  updateBasketCounter(count);
});

const events = new EventEmitter();

// Подключаем корзину
new BasketView(cartModel, modal, events);

 // очищаем корзину
events.on("basket:clear", () => {
  cartModel.clear();
});

// Подключаем оформление
const checkoutPresenter = new CheckoutPresenter(
  new CheckoutStepOne(),
  new CheckoutStepTwo(),
  modal,
  api,
  events,
  cartModel.getAll() // передаём товары
);

// Подписываемся на запуск оформления заказа
events.on("checkout:start", () => {
  checkoutPresenter.startCheckout();
});