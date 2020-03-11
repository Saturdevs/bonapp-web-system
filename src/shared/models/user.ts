import { AppMenu } from "./appMenu";
import { RightForUser } from "./rightForUser";

export class User {
  readonly _id: string;
  readonly username: string;
  roleId: string;
  name: string;
  lastName: string;
  token?: string;  
  readonly menus: Array<AppMenu> = [];
  readonly rights: Array<RightForUser> = [];
}