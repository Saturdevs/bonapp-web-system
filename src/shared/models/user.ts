import { AppMenu } from "./appMenu";
import { RightForUser } from "./rightForUser";

export class User {
  readonly _id: string;
  username: string;
  roleId: string;
  name: string;
  lastname: string;
  password: string;
  token?: string;  
  readonly menus: Array<AppMenu> = [];
  readonly rights: Array<RightForUser> = [];
  isGeneral: Boolean;
  pin: String;
}