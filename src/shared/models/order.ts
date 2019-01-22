export class Order {
  _id: string;
  orderNumber : string;
  type: string;
  cashRegister: string;
  waiter: string;
  status: string;
  orderApp: Boolean;
  users: Array<any>;
  subtotal: number;
  payment: Array<any>;
  sent_at: string;
  discountPercentage: number;
  created_at: string;
  table: number;
  open: boolean;
  cancel: boolean;
  //users
  completed_at: string;
  totalPrice: number;
  products: Array<any>;
}