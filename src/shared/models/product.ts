import { 
  SizeInProduct,
  OptionInProduct,
  Category,
  ProductStock
} from '../index';

export class Product {
  readonly _id: string;
  code: string;
  name: string;
  category: Category;
  pictures: string;
  description: string;
  price: number;
  options: Array<OptionInProduct> = [];
  sizes: Array<SizeInProduct> = [];
  tags: Array<string> = []
  available: Boolean;
  readonly availableDescription: string;
  stockControl: Boolean;
  stock: ProductStock;
}