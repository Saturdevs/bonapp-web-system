import { IRight } from "..";

export interface IUserRoleDTO {
  _id: string;
  name: string;
  isWaiter: Boolean;
  rights: Array<IRight>;
}