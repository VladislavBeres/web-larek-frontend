Ссылка на репозиторий:  https://github.com/VladislavBeres/web-larek-frontend

# Проектная работа "Веб-ларек"

Интернет-магазин с товарами для веб-разработчиков. Позволяет просматривать каталог, добавлять товары в корзину и оформлять заказ.

Для данной проектной работы я выбираю архетиктуру "MVP" 

(Model-View-Presenter) — архитектурный паттерн в программировании, который разделяет приложение на три компонента: модель, представление и презентер. Основная идея — разделить ответственности между компонентами так, чтобы изменения в одном компоненте не влияли на другие. Это делает код более поддерживаемым и позволяет легче тестировать компоненты независимо друг от друга.

Основные слои и части:

## Модель данных (Model)

Управляет состоянием приложения, хранит бизнес-логику и данные.
Классы:
 • CartModel — управляет товарами в корзине, их количеством и общей суммой.
 • ProductModel — хранит список всех доступных продуктов.
 • OrderModel — управляет состоянием и валидацией данных оформления заказа.

⸻

## Представления (View / Component)

Отвечают за визуальное отображение, обработку пользовательского ввода и взаимодействие с DOM.
Классы:
 • ProductCard — карточка товара с кнопкой добавления в корзину и предпросмотром.
 • BasketView — отображение корзины с добавленными товарами.
 • BasketItemView — представление одного элемента в корзине.
 • CheckoutStepOne — форма ввода адреса и способа оплаты.
 • CheckoutStepTwo — форма ввода контактных данных.
 • OrderSuccess — финальный экран успешного оформления заказа.

⸻

## Презентеры (Presenter)

Связывают модель и представление, управляют логикой взаимодействия, событиями и обновлением интерфейса.
Классы (предполагаемые):
 • CatalogPresenter — управляет отображением витрины товаров.
 • BasketPresenter — контролирует логику корзины.
 • CheckoutPresenter — управляет шагами оформления заказа.
 • ProductPresenter — управляет взаимодействием с карточками товаров.

⸻

## Инфраструктурные компоненты
 • PageView — централизует доступ к шаблонам и элементам DOM: витрина, кнопка корзины, счётчик и пр.
 • Modal — компонент для отображения всплывающих карточек товара (предпросмотр).
 • EventEmitter — централизованная событийная система, используется для связи между модулями.
 • Api — модуль для работы с сервером: получение данных, оформление заказов.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
  
```
npm run start
или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

<!-- Работа с событиями (events.ts) -->

## Класс: EventEmitter

Брокер событий. В расширенных вариантах есть возможность подписаться на все события
или слушать события по шаблону например

## Методы:

• on - Установает обработчик на событие
• off - Снимает обработчик с события
• emit - Иницилизирует событие с данными
• onAll - Слушает все события
• offAll - Сбрасывает все обработчики
• trigger - Создает коллбек триггер, генерирующий событие при вызове

<!-- Работа с API (api.ts) -->

## Класс: Api

В проекте используется универсальный класс Api для выполнения HTTP-запросов к серверу. Он инкапсулирует методы GET, POST, PUT, DELETE с единым обработчиком ошибок.

Методы:

• constructor(baseUrl: string, options?: RequestInit) - Устанавливает базовый URL и заголовки
• get(uri: string) - Выполняет GET-запрос по заданному URI
• post(uri: string, data: object, method = 'POST') - Выполняет POST, PUT или DELETE-запрос с телом
• handleResponse(response: Response) - Обрабатывает JSON-ответ или ошибку

 ApiListResponse<Type> — обёртка для списка с total и items

 ApiPostMethods — поддерживаемые HTTP-методы: 'POST', 'PUT', 'DELETE'


## Класс Modal

Назначение: управление модальными окнами приложения.

Свойства:
 • modalElement: HTMLElement — корневой элемент модального окна.
 • modalContent: HTMLElement — контейнер для вставки контента.
 • closeButton: HTMLElement — кнопка закрытия окна.

Методы:
 • open(content: HTMLElement): void — отображает модальное окно с переданным содержимым.
 • close(): void — закрывает окно и очищает содержимое.
 • setContent(content: HTMLElement): void — заменяет содержимое модального окна.
 • setEventListeners(): void — добавляет обработчики событий: закрытие по клику, фону, Escape.
 • private onEscClose(e: KeyboardEvent): void — обработчик клавиши Escape для закрытия окна.


⸻

## Класс BasketPresenter

Назначение: управляет отображением корзины и её изменениями.

Свойства и зависимости:
 • cartModel — модель корзины.
 • basketView — представление корзины.
 • pageView — работа с DOM-элементами.
 • emitter — для прослушивания/отправки событий.
 • modal — отображение корзины в модальном окне.

Методы:
 • private openBasket(): void — рендерит и отображает корзину.
 • private removeItem(id: string): void — удаляет товар, обновляет интерфейс и счётчик.
 • private updateCounter(): void — обновляет количество товаров на кнопке корзины.


⸻

## Класс CatalogPresenter

Назначение: отображает каталог продуктов на основе модели данных.

Зависимости:
 • ProductModel — источник данных.
 • CartModel — для взаимодействия с корзиной.
 • Modal — отображение подробной информации (при необходимости).
 • EventEmitter — реагирует на события обновления.
 • PageView — предоставляет шаблоны DOM.

Методы:
 • init() — начальный рендер.
 • render(products) — отрисовывает карточки продуктов.



⸻

## Класс CheckoutPresenter

Назначение: управляет процессом оформления заказа (2 шага).

Зависимости:
 • stepOne, stepTwo — представления форм.
 • modal — отображение текущего шага.
 • api — отправка заказа.
 • events — для подписки на изменения формы и управления состоянием.
 • orderModel — содержит и проверяет данные заказа.
 • getCartItems — функция получения текущих товаров.
 • pageView — предоставление шаблонов и элементов.

Методы:
 • startCheckout() — отображение первого шага.
 • nextStep() — переход ко второму шагу.
 • submitOrder() — отправка заказа, отображение подтверждения.
 • showSuccessModal(total) — отображение успешного завершения заказа.

⸻

## Класс ProductPresenter

Назначение: загружает продукты с сервера и передаёт их модели.

Зависимости:
 • api — получение данных с сервера.
 • model — сохранение данных.
 • emitter — отправка событий об ошибках.

Методы:
 • loadProducts() — асинхронно загружает данные и передаёт их модели.


⸻

## Класс BasketItemView

Назначение: отображение одного товара в корзине.

Свойства:
 • item — данные о товаре.
 • index — порядковый номер.
 • onRemove — колбэк на удаление.
 • pageView — доступ к шаблону элемента корзины.
 • element — DOM-элемент (сформированный из шаблона).

Метод:
 • render() — создаёт и возвращает DOM-элемент, заполняя содержимое.


⸻

## Класс BasketView

Назначение: отображение полной корзины.

Свойства:
 • container — основной DOM-элемент корзины.
 • emitter — подписка на событие оформления заказа.
 • pageView — для получения шаблона корзины.

Методы:
 • getContainer() — возвращает контейнер корзины.
 • setBasketContent(items, price) — заполняет список товаров и отображает общую цену, включает кнопку перехода к оформлению.

 ## Класс CartModel

Отвечает за хранение и управление данными корзины.

Свойства:
 • items: Map<string, CartItem> — текущие товары в корзине.
 • storageKey: string — ключ для хранения корзины в localStorage.
 • emitter: EventEmitter — используется для оповещения о изменениях корзины.

Методы:
 • add(product: Product): void — добавляет товар в корзину.
 • remove(productId: string): void — удаляет товар из корзины.
 • has(productId: string): boolean — проверяет наличие товара.
 • getAll(): CartItem[] — возвращает все товары в корзине.
 • getTotalPrice(): number — возвращает итоговую сумму заказа.
 • clear(): void — очищает корзину.
 • getTotalItemsCount(): number — возвращает общее количество товаров.
 • private emitUpdate(): void — уведомляет подписчиков о состоянии корзины.
 • private saveToStorage(): void — сохраняет корзину в localStorage.
 • private loadFromStorage(): void — загружает данные корзины из localStorage.

⸻

## Класс OrderModel

Отвечает за хранение и валидацию данных оформления заказа.

Свойства:
 • data: OrderFormData — текущие данные заказа.
 • emitter: EventEmitter — уведомляет представления о результатах валидации.

Методы:
 • setData(key, value) — обновляет значение поля и запускает валидацию.
 • getData(): OrderFormData — возвращает все данные заказа.
 • reset() — очищает все данные и сбрасывает ошибки.
 • validate() — проводит валидацию и эмитит ошибки.
 • getValidationErrors(): Record<string, string> — возвращает ошибки валидации.
 • isStepOneValid(): boolean — проверяет корректность первого шага.
 • isStepTwoValid(): boolean — проверяет корректность второго шага.

⸻

## Класс ProductModel

Хранит список всех товаров.

Свойства:
 • products: Product[] — массив всех загруженных товаров.
 • emitter: EventEmitter — используется для эмита обновлений.

Методы:
 • setProducts(products: Product[]) — сохраняет товары и уведомляет подписчиков.
 • getAll(): Product[] — возвращает список товаров.

⸻

## Класс CheckoutStepOne

Компонент первого шага оформления заказа (адрес и оплата).

Свойства:
 • element: HTMLElement — корневой элемент формы.
 • addressInput, cardBtn, cashBtn, nextBtn, errorSpan — DOM-элементы формы.
 • selectedPayment: "card" | "cash" | null — текущий способ оплаты.

Методы:
 • private setListeners() — назначает обработчики событий.
 • private toggleButtons() — переключает активную кнопку оплаты.
 • private showError(message: string) — отображает ошибку.
 • private clearError() — очищает ошибки.
 • reset() — сбрасывает поля формы и ошибки.
 • getFormData() — возвращает данные формы.
 • setEventListeners() — явный вызов назначения событий.

⸻

## Класс CheckoutStepTwo

Компонент второго шага оформления заказа (контактные данные).

Свойства:
 • element: HTMLFormElement — DOM-элемент формы.
 • emailInput, phoneInput, submitButton, errorContainer — элементы формы.

Методы:
 • private setListeners() — назначает обработчики событий.
 • reset() — очищает поля и сбрасывает ошибки.
 • getFormData() — возвращает email и телефон.
 • private showError(message: string) — отображает сообщение об ошибке.

⸻

## Класс OrderSuccess

Компонент отображения успешного оформления заказа.

Свойства:
 • element: HTMLElement — корневой элемент.
 • totalText: HTMLElement — элемент с итоговой суммой.
 • closeButton: HTMLButtonElement — кнопка закрытия.
 • onCloseCallback: () => void — функция, вызываемая при закрытии окна.

Методы:
 • setTotal(total: number) — отображает сумму заказа.
 • onClose(callback: () => void) — задаёт обработчик закрытия.
 • setEventListeners() — подписка на клик по кнопке закрытия.

⸻

## Класс PageView

Централизованный класс для работы с DOM-элементами, шаблонами и кнопками.

Свойства:
 • DOM-элементы:
 • cartButton — кнопка открытия корзины.
 • basketCounter — счётчик количества товаров.
 • showcaseContainer — контейнер витрины товаров.

 • Шаблоны:
  • basketTemplate
  • cardBasketTemplate
  • cardTemplate
  • cardPreviewTemplate
  • checkoutStepOneTemplate
  • checkoutStepTwoTemplate
  • orderSuccessTemplate

Методы:
 • updateBasketCounter(count: number) — обновляет счётчик товаров.
 • Геттеры шаблонов: getBasketTemplate(), getCardTemplate() и т.п.
 • getShowcaseContainer() — возвращает контейнер витрины.

⸻

## Класс ProductCard

Представляет товар в каталоге: рендерит карточку и модальное окно-превью, обрабатывает взаимодействие пользователя и синхронизирует состояние кнопки с корзиной.


Зависимости:
 • product — объект товара (Product), содержащий данные для отображения;
 • events — глобальный EventEmitter для коммуникации между слоями;
 • pageView — предоставляет шаблоны карточки и карточки-превью.

Методы:
 • getElement() — возвращает DOM-элемент каталожной карточки для вставки в витрину.
 • setTitleAndPrice(titleEl, priceEl) — заполняет заголовок и цену.
 • setupImage(imageEl) — устанавливает изображение и alt-текст.
 • setupCategory(categoryEl) — устанавливает название категории и CSS-класс.
 • setupPreviewButton() — инициализирует кнопку и текст в модалке, вешает обработчик.
 • updatePreviewButtonText() — обновляет надпись кнопки в модалке в зависимости от состояния корзины.
 • setEventListeners() — вешает все обработчики событий на карточку и кнопку.


 <!---- События ---->

cart:updated     - Обновление состояния корзины (добавление, удаление, изменение количества товаров).
cart:changed     - Принудительный ререндер содержимого корзины.
cart:check       -запрос в CartModel, чтобы определить, находится ли товар в корзине;
basket:open      - Открытие модального окна корзины.
basket:clear     - Очистка корзины после успешного оформления заказа.

products:updated     - Обновление витрины после получения списка товаров.
products:error       - Ошибка при загрузке списка товаров с сервера.
product:open-preview - открытие карточки-превью;
product:add-to-cart  - добавление/удаление товара в корзину;

checkout:start   - Запуск процесса оформления заказа.
formSubmit       - Успешное завершение шага (1 или 2) оформления заказа.
order:change     - Изменение данных формы заказа (имя, адрес, email, способ оплаты).

errors:show      - Отображение ошибок формы (валидация, ошибки сервера).
modal:close      - Закрытие модального окна после оформления заказа.

