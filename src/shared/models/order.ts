import { 
  UsersInOrder, 
  OrderDiscount,
  User,
  CashRegister 
} from '../index';

export class Order {
  _id: string;
  orderNumber : number;
  type: string;
  table: number;
  cashRegister: CashRegister;
  waiter: User;
  status: string;
  app: Boolean;
  users: Array<UsersInOrder>;
  created_at: Date;
  sent_at: Date;
  completed_at: Date;
  discount: OrderDiscount;
  totalPrice: number;
}