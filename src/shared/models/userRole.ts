import { IMenusRights } from "./Interfaces/IMenusRights";

export class UserRole {
  readonly _id: string;
  name: string;
  isWaiter: boolean;
  rightsByMenu: Array<IMenusRights>;
  users: number;
}