export class ProductsInUserOrder {
  _id: String;
  employeeWhoAdded: string;
  employee: string;
  /**Id del producto */
  dailyMenuId?: String;
  product: string;
  name: string;
  options: Array<any>;
  price: number;
  size: any;   
  observations: string;
  quantity: number;
  deleted: boolean;
  deletedReason: string;
  paymentStatus: string;
}