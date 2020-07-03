import { ProductsInUserOrder, PaymentInUserOrder } from '../index';

export class UsersInOrder {
  /**Id del usuario */
  _id: string;
  username: string;
  name: string;
  lastName: string;  
  products: Array<ProductsInUserOrder>;
  totalPerUser: number;
  payments: Array<PaymentInUserOrder>;
  owner: Boolean;
  clientId? : string;

  //No tienen su correspondiente propiedad en el backend, solo se usan en el front.
  productsPendingPayments: Array<ProductsInUserOrder>;
}