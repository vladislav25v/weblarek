import './scss/styles.scss';
import { Cart } from '@components/Models/Cart';
import { Customer } from '@components/Models/Customer';
import { Items } from '@components/Models/Items';
import { apiProducts } from '@utils/data';
import { Communicator } from '@components/base/Communicator';
import { Api } from '@components/base/Api';
import { API_URL } from '@utils/constants';

const productsModel = new Items();
const cartModel = new Cart();
const customerModel = new Customer();
const formImitation = {
    payment: null,
    address: 'дома',
};
const apiRequest = new Api(API_URL);
const getData = new Communicator(apiRequest);

productsModel.setItems(await getData.get());
productsModel.setActiveItem(productsModel.getItems()[0].id);

cartModel.addItem(apiProducts.items[0]);
cartModel.checkItem(apiProducts.items[0].id);
cartModel.addItem(apiProducts.items[3]);
cartModel.deleteItem(apiProducts.items[3]);
cartModel.deleteAll();

customerModel.addData(formImitation);
customerModel.clearData();

console.log(`Массив товаров из каталога:`, productsModel.getItems());
console.log(`Открытый товар:`, productsModel.getActiveItem());
console.log(`Проверка товара в корзине:`, cartModel.checkItem(apiProducts.items[0].id));
console.log(`Товары в корзине:`, cartModel.getCartList());
console.log(`Количество товаров:`, cartModel.getQuantityItems());
console.log(`Сумма товаров:`, cartModel.getAmount());
console.log(`Данные формы1:`, customerModel.getData());
console.log(`Валидация:`, customerModel.validateData(customerModel.getData()));
