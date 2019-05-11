import { ProductsInUserOrder, PaymentInUserOrder } from '../index';

export class UsersInOrder {
  id: string;
  products: Array<ProductsInUserOrder>;
  totalPerUser: number;
  payment: Array<PaymentInUserOrder>;
  owner: Boolean;
}