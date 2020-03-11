import { AppMenu, User } from "../models";
import { isNullOrUndefined } from "util";

export class UtilFunctions {
  
  static compareStrings(a: String, b: String) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }

  /**
   * @description Funcion para ordernar los menus del sistema segun la propiedad order.
   * @param {AppMenu} a 
   * @param {AppMenu} b 
   */
  static orderAppMenus(a: AppMenu, b: AppMenu) {    
    return (a.order > b.order) ? 1 : 0;
  }

  /**
   * @description Devuelve los menus hijos del menu padre dado como parámetro.
   * @param {User} currentUser usuario logueado en el sistema.
   * @param {String} menuParentName Nombre del menu padre para el que se quiere obtener los hijos.
   */
  static getChildAPpMenus(currentUser: User, menuParentName: String) {
    if (!isNullOrUndefined(currentUser)) {
      let appMenus = currentUser.menus.filter(menu => menu.parent === menuParentName);
      appMenus.sort((a,b) => { return this.orderAppMenus(a, b) });

      return appMenus;
    }

    return null;
  }
  
}