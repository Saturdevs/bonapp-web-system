import { AppMenu, User, ProductsInUserOrder } from "../models";
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
      let appMenus = currentUser.menus.filter(menu => (menu.parent === menuParentName && menu.show));
      appMenus.sort((a, b) => { return this.orderAppMenus(a, b) });

      return appMenus;
    }

    return null;
  }

  /**Compara propiedad por propiedad para determinar si los productos dados como parámetros son iguales.
   * No compara la propiedad quantity porque esta va cambiando a medida que se agregan productos iguales al array.
   * @param prodInPreOrder producto existente en el array preOrderProducts 
   * @param product producto para el que se quiere determinar su existencia en el array preOrederProducts
   * @returns true si el producto se encuentra en el array preOrderProducts. false si no se encuentra.
   */
  static compareProducts(prodInPreOrder: ProductsInUserOrder, product: ProductsInUserOrder): boolean {
    if (isNullOrUndefined(prodInPreOrder.options)) {
      prodInPreOrder.options = null;
    }

    if (isNullOrUndefined(product.options)) {
      product.options = null;
    }

    if (isNullOrUndefined(prodInPreOrder.size) ||
      (Object.keys(prodInPreOrder.size).length === 0 && prodInPreOrder.size.constructor === Object)) {
      prodInPreOrder.size = null;
    }

    if (isNullOrUndefined(product.size) ||
      (Object.keys(product.size).length === 0 && product.size.constructor === Object)) {
      product.size = null;
    }

    if (prodInPreOrder.product === product.product &&
      prodInPreOrder.name === product.name &&
      prodInPreOrder.observations === product.observations &&
      prodInPreOrder.options === product.options &&
      prodInPreOrder.price === product.price &&
      prodInPreOrder.size === product.size &&
      prodInPreOrder.deleted === product.deleted &&
      prodInPreOrder.paymentStatus === product.paymentStatus) {
      return true;
    }
    else {
      return false;
    }
  }

}