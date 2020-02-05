import { 
  MenuCategory
} from '../index';

export class Category {
  readonly _id: string;
  name:  string;
  picture: string;
  menu: MenuCategory;
  available: Boolean;
}