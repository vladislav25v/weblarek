export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IRequest {
  total: number;
  items: IProduct[];
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type TProductById = IProduct['id'];
export type TProductOrString = IProduct | string;
export type TProductOrNull = IProduct | null;
export type TPayment = 'online' | 'uponDelivery' | null;

export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}
