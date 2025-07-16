//  index.ts:

import { Api } from './components/base/api';
import { CartModel } from './components/cartModel';
import { CatalogPresenter } from './components/presenters/CatalogPresenter';
import { ProductModel } from './components/productModel';
import { ProductPresenter } from './components/presenters/ProductPresenter';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Modal } from './components/Modal/Modal';
import { EventEmitter } from './components/base/events';
import { CheckoutStepOne } from './components/CheckoutStepOne';
import { CheckoutPresenter } from './components/presenters/CheckoutPresenter';
import { CheckoutStepTwo } from './components/CheckoutStepTwo';
import { BasketPresenter } from './components/presenters/BasketPresenter';
import { OrderModel } from './components/OrderModel';
import { PageView } from './components/PageView';
import { BasketView } from './components/BasketView';

// Создаём глобальный экземпляр EventEmitter для взаимодействия между слоями
const emitter = new EventEmitter();

// Создаём экземпляр API клиента для запросов на сервер
const api = new Api(API_URL);

// Создаём модальное окно
const modal = new Modal("#modal-container");

// Создаём экземпляр PageView
const pageView = new PageView(emitter);

const basketView = new BasketView(emitter, pageView);

// ------------------

// Создаём модель продуктов и презентер загрузки продуктов
const productModel = new ProductModel(emitter); // модель продукта, хранит список
const productPresenter = new ProductPresenter(api, productModel, emitter); // загружает продукты и обновляет модель

// Находим контейнер каталога в DOM (это допустимо в index, если передаётся в представление)
const productListContainer = pageView.getShowcaseContainer();
if (!productListContainer) {
  throw new Error('Контейнер для каталога не найден');
}

// Создаём модель корзины
const cartModel = new CartModel(emitter);

// Создаём презентер каталога — связывает модель продуктов с представлением карточек и корзиной
const productListPresenter = new CatalogPresenter(productModel, productListContainer, cartModel, modal, emitter, pageView
);
productListPresenter.init();

// Загружаем продукты с сервера через презентер (инициирует fetch → обновляет модель → инициирует рендер)
productPresenter.loadProducts();

// ------------------

// Создаём представление корзины и презентер
new BasketPresenter(cartModel, basketView, pageView,emitter, modal );

// Подписка на очистку корзины по событию
emitter.on("basket:clear", () => {
  cartModel.clear();
});

// ------------------

// Создаём презентер оформления заказа
// Передаём представления шагов, модалку, API, emitter, функцию получения товаров корзины и модель заказа
const checkoutPresenter = new CheckoutPresenter(
  new CheckoutStepOne(emitter, pageView),
  new CheckoutStepTwo(emitter, pageView),
  modal,
  api,
  emitter,
  () => cartModel.getAll(),
  new OrderModel(emitter),
  pageView
);

// Подписываемся на запуск оформления заказа (вызывается из слоя представления)
emitter.on("checkout:start", () => {
  checkoutPresenter.startCheckout();
});



// //  index.ts:

// import { Api } from './components/base/api';
// import { CartModel } from './components/cartModel';
// import { CatalogPresenter } from './components/presenters/CatalogPresenter';
// import { ProductModel } from './components/productModel';
// import { ProductPresenter } from './components/presenters/ProductPresenter';
// import './scss/styles.scss';
// import { API_URL } from './utils/constants';
// import { Modal } from './components/Modal/Modal';
// import { EventEmitter } from './components/base/events';
// import { BasketView } from './components/BasketView';
// import { CheckoutStepOne } from './components/CheckoutStepOne';
// import { CheckoutPresenter } from './components/presenters/CheckoutPresenter';
// import { CheckoutStepTwo } from './components/CheckoutStepTwo';
// import { BasketPresenter } from './components/presenters/BasketPresenter';
// import { OrderModel } from './components/OrderModel';


// // Создаём глобальный шина событий для взаимодействия компонентов
// const emitter = new EventEmitter();

// // Создаём экземпляр API клиента для запросов на сервер
// const api = new Api(API_URL);

// // Создаём модель продуктов, передавая шину событий
// const productModel = new ProductModel(emitter);

// // Создаём презентер продуктов, который будет загружать данные и обновлять модель
// const productPresenter = new ProductPresenter(api, productModel, emitter);

// // Находим контейнер каталога в DOM для рендера карточек
// const productListContainer = document.querySelector('.gallery') as HTMLElement;
// if (!productListContainer) {
//   throw new Error('Контейнер для каталога не найден');
// }

// // ------------------

// // Создаём модель корзины и модальное окно
// const cartModel = new CartModel(emitter);
// const modal = new Modal("#modal-container");

// // Создаём презентер каталога (отвечает за рендер карточек и взаимодействие с корзиной)
// const productListPresenter = new CatalogPresenter(productModel, productListContainer, cartModel, modal);
// productListPresenter.init();

// // Загружаем продукты с сервера через презентер, обновляя модель и рендер
// productPresenter.loadProducts();

// const cartButton = document.querySelector('.header__basket');
// cartButton?.addEventListener('click', () => {
//   const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket');
//   if (!basketTemplate) {
//     throw new Error('Шаблон корзины #basket не найден');
//   }
//   // Клонируем шаблон корзины и открываем в модальном окне
//   const basketContent = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
//   modal.open(basketContent);
// });

// // ------------------

// const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

// // Обновляем счётчик товаров в корзине
// function updateBasketCounter(count: number) {
//   basketCounter.textContent = count.toString();
// }

// // Первичная отрисовка счётчика корзины
// updateBasketCounter(cartModel.getTotalItemsCount());

// // Подписываемся на обновления корзины для синхронизации счётчика
// emitter.on('cart:updated', ({ count }: { count: number }) => {
//   updateBasketCounter(count);
// });

// // Очистка корзины по событию
// emitter.on("basket:clear", () => {
//   cartModel.clear();
// });

// // ------------------

// // Создаём презентер оформления заказа, передаём шаги оформления, модалку, API, события и корзину
// const checkoutPresenter = new CheckoutPresenter(
//   new CheckoutStepOne(emitter),
//   new CheckoutStepTwo(emitter),
//   modal,
//   api,
//   emitter,
//   () => cartModel.getAll(), // функция для получения товаров корзины
//   new OrderModel(emitter)
// );

// // Запуск оформления заказа по событию
// emitter.on("checkout:start", () => {
//   checkoutPresenter.startCheckout();
// });

// // Создаём представление корзины и презентер для неё
// const basketView = new BasketView(emitter);
// new BasketPresenter(cartModel, basketView, modal, emitter);