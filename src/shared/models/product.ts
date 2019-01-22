export class Product {
  code: string;
  name: string;
  category: string;
  pictures: string;
  description: string;
  price: number;
  options: Array<any> = [];
  sizes: Array<any> = [];
  tags: Array<string> = []
  available: any;
}