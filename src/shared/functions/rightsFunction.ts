import { User, RightForUser } from "../models";
import { isNullOrUndefined } from "util";

export class RightsFunctions {

  static isRightActiveForUser(user: User, rightId: String) {
    let right = new RightForUser();
    right = null;
    let rightFound = false;
    if (!isNullOrUndefined(user)) {
      for (let i = 0; i < user.rights.length && !rightFound; i++) {
        const r = user.rights[i];

        if (r.rightId === rightId) {
          right = r;
          rightFound = true;
        }
      }
    }

    if (!isNullOrUndefined(right)) {
      return right.active;
    }

    return false;
  }

}