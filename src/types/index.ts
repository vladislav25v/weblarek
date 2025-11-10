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

export type IProductById = IProduct['id'];
export type IProductOrString = IProduct | string;
export type IProductOrNull = IProduct | null;
export type TPayment = 'online' | 'uponDelivery' | null;

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

type ValidationResult<T> = { [K in keyof T]: true | string };
export type IValidated = ValidationResult<IBuyer>;
