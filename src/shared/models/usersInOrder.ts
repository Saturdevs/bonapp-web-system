import { ProductsInUserOrder, PaymentInUserOrder } from '../index';

export class UsersInOrder {
  /**Id del usuario */
  username: string;
  name: string;
  lastName: string;  
  products: Array<ProductsInUserOrder>;
  totalPerUser: number;
  payments: Array<PaymentInUserOrder>;
  owner: Boolean;
  clientId? : string;
}