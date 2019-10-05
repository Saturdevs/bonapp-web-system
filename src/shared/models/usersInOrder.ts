import { ProductsInUserOrder, PaymentInUserOrder } from '../index';
import { UserMin } from './userMin';

export class UsersInOrder {
  /**Id del usuario */
  user: UserMin;
  name: string;
  lastName: string;
  userName: string;
  products: Array<ProductsInUserOrder>;
  totalPerUser: number;
  payments: Array<PaymentInUserOrder>;
  owner: Boolean;
}