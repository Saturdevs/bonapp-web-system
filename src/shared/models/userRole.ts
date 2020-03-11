import { 
  Right
} from '../index';

export class UserRole {
  readonly _id: string;
  name: string;
  isWaiter: boolean;
  rights: Array<Right>;
}