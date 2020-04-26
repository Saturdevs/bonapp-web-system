import { IRight } from "./IRight";

export interface IMenusRights {
  readonly menuId: string;  
  readonly rights: Array<IRight>;
}