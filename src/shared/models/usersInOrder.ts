import { ProductsInUserOrder, PaymentInUserOrder } from '../index';

export class UsersInOrder {
  /**Id del usuario */
  user: string;
  name: string;
  lastName: string;
  userName: string;
  products: Array<ProductsInUserOrder>;
  totalPerUser: number;
  payments: Array<PaymentInUserOrder>;
  owner: Boolean;
}