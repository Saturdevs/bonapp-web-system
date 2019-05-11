import { 
  UsersInOrder, 
  OrderDiscount 
} from '../index';

export class Order {
  _id: string;
  orderNumber : number;
  type: string;
  table: number;
  cashRegister: string;
  waiter: string;
  status: string;
  users: UsersInOrder;
  created_at: Date;
  sent_at: Date;
  completed_at: Date;
  discount: OrderDiscount;
  totalPrice: number;
  app: Boolean;
}