import './scss/styles.scss';
import { Communicator } from '@utils/Communicator';
import { Api } from '@components/base/Api';
import { API_URL } from '@utils/constants';
import { Cart } from '@components/models/Cart';
import { Customer } from '@components/models/Customer';
import { Items } from '@components/models/Items';
import { cloneTemplate, ensureElement } from '@utils/utils';
import { EventEmitter } from '@components/base/Events';
import { Header } from '@components/view/layout/Header';
import { Gallery } from '@components/view/layout/Gallery';
import { Modal } from '@components/view/layout/Modal';
import { FormContacts } from '@components/view/forms/FormContacts';
import { FormPayment } from '@components/view/forms/FormPayment';
import { Basket } from '@components/view/views/Basket';
import { Success } from '@components/view/views/SuccessView';
import { CardCatalog } from '@components/view/cards/CardCatalog';
import { CardPreview } from '@components/view/cards/CardPreview';
import { CardBasket } from '@components/view/cards/CardBasket';
import { IOrder, IProduct } from '@types';

const broker = new EventEmitter();
const apiRequest = new Api(API_URL);
const clientApi = new Communicator(apiRequest);

const productsModel = new Items(broker);
const cartModel = new Cart(broker);
const customerModel = new Customer(broker);

const headerElement = ensureElement('.header');
const galleryElement = ensureElement('.gallery');
const modalElement = ensureElement('.modal');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const formPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const header = new Header(headerElement, broker);
const gallery = new Gallery(galleryElement);
const modal = new Modal(modalElement, broker);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), broker);
const basket = new Basket(cloneTemplate(basketTemplate), broker);
const formContacts = new FormContacts(cloneTemplate(formContactsTemplate), broker);
const formPayment = new FormPayment(cloneTemplate(formPaymentTemplate), broker);
const successView = new Success(cloneTemplate(successTemplate), broker);

function createCardCatalog(product: IProduct): HTMLElement {
  const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), () =>
    broker.emit('gallery:picked', { id: product.id }),
  );
  return card.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
  });
}

function createCardBasket(product: IProduct, index: number): HTMLElement {
  const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
    toRemove: () => {
      broker.emit('basket:remove-card', product);
    },
  });
  return card.render({
    index,
    title: product.title,
    price: product.price,
  });
}

function renderCatalog() {
  const items = productsModel.getItems();
  const cards = items.map((product) => createCardCatalog(product));
  gallery.catalog = cards;
}

function renderCart() {
  const basketIdList = cartModel.getCartList();
  const items = basketIdList.map((id) => productsModel.getItemById(id));
  const basketItems = items.map((product, index) => createCardBasket(product, index + 1));
  basket.items = basketItems;
  basket.total = cartModel.getAmount(items);
  header.counter = cartModel.getQuantityItems();
}

function renderFormPayment() {
  const data = customerModel.getData();
  const validated = customerModel.validateData(data);

  formPayment.render({
    payment: data.payment,
    address: data.address,
    validated,
    valid: validated.payment === true && validated.address === true,
  });
}

function renderFormContacts() {
  const data = customerModel.getData();
  const validated = customerModel.validateData(data);

  formContacts.render({
    email: data.email,
    phone: data.phone,
    validated,
    valid: Object.values(validated).every((v) => v === true),
  });
}

broker.on('gallery:updated', () => {
  renderCatalog();
});

broker.on('gallery:picked', () => {
  const item = productsModel.getActiveItem();
  if (!item) return;

  const view = cardPreview.render({
    title: item.title,
    price: item.price,
    category: item.category,
    image: item.image,
    description: item.description,
    addedToCart: cartModel.checkItem(item.id),
  });
  modal.open(view);
});

broker.on('cart:changed', () => {
  renderCart();
});

broker.on('customer:changed', () => {
  renderFormPayment();
  renderFormContacts();
});

broker.on('basket:open', () => {
  modal.open(basket.render());
});

broker.on<{ id: string }>('gallery:picked', (data) => {
  if (!data) return;
  productsModel.setActiveItem(data.id);
});

broker.on('card:add-to-cart', () => {
  const item = productsModel.getActiveItem();
  if (!item || item.price === null) return;

  if (cartModel.checkItem(item.id)) {
    cartModel.deleteItem(item);
  } else {
    cartModel.addItem(item);
  }
  modal.close();
});

broker.on<IProduct>('basket:remove-card', (data) => {
  cartModel.deleteItem(data);
});

broker.on('basket:order', () => {
  renderFormPayment();
  modal.open(formPayment.render());
});

broker.on<{ field: 'address' | 'payment'; value: string }>('form:payment-change', (data) => {
  customerModel.addData({ [data.field]: data.value });
});

broker.on('form:payment-submit', () => {
  const data = customerModel.getData();
  const validated = customerModel.validateData(data);

  if (validated.payment !== true || validated.address !== true) {
    formPayment.render({
      payment: data.payment,
      address: data.address,
      validated,
      valid: false,
    });
    return;
  }

  renderFormContacts();
  modal.open(formContacts.render());
});

broker.on<{ field: 'email' | 'phone'; value: string }>('form:contacts-change', (data) => {
  customerModel.addData({ [data.field]: data.value });
});

broker.on('form:contacts-submit', async () => {
  const data = customerModel.getData();
  const validated = customerModel.validateData(data);

  if (validated.email !== true || validated.phone !== true) {
    formContacts.render({
      email: data.email,
      phone: data.phone,
      validated,
      valid: false,
    });
    return;
  }
});

broker.on('form:contacts-submit', async () => {
  const customer = customerModel.getData();
  const cartItems = cartModel.getCartList();
  const items = cartItems.map((id) => productsModel.getItemById(id));
  if (!customer.payment || !customer.address || !customer.email || !customer.phone) {
    throw new Error('Заполнены не все поля заказа');
  }
  const order: IOrder = {
    payment: customer.payment,
    address: customer.address,
    email: customer.email,
    phone: customer.phone,
    items: cartItems,
    total: cartModel.getAmount(items),
  };

  try {
    const result = await clientApi.sendOrder(order);

    cartModel.deleteAll();
    customerModel.clearData();

    const finalView = successView.render({ total: result.total });
    modal.open(finalView);
  } catch (error) {
    console.error('Error submitting data', error);
  }
});

broker.on('success:success-close', () => {
  modal.close();
});

clientApi
  .getProducts()
  .then((items) => {
    productsModel.setItems(items);
  })
  .catch((error) => {
    console.error('Error loading data', error);
  });
