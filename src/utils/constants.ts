
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};
// Селекторы шаблонов (для cloneTemplate)
export const TEMPLATE_SELECTORS = {
  Templatecard: '#card-catalog',
  Templatebasket: '#basket',
  TemplateCheckoutStepOne: '#order',
  TemplateCheckoutStepTwo: '#contacts',
  TemplateOrderSuccess: '#success',
};


// Ключи для localStorage
export const STORAGE_KEYS = {
  cart: 'web-larek-cart',
  order: 'web-larek-order',
};

export const CATEGORY_CLASSES: Record<string, string> = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'другое': 'other',
  'дополнительное': 'additional',
  'кнопка': 'button',
};
  