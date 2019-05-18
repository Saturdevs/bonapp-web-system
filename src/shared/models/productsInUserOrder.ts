export class ProductsInUserOrder {
  /**Id del producto */
  product: string;
  name: string;
  options: Array<any>;
  price: number;
  size: any;   
  observations: string;
  quantity: number;
  deleted: boolean;
  deletedReason: string;
}