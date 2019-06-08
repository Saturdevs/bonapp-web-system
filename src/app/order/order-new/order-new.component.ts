import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

import { CompleterData } from 'ng-mdb-pro/pro/autocomplete';

import { CompleterService } from 'ng-mdb-pro/pro/autocomplete';

import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ng-mdb-pro/free';
import { 
  Menu, 
  CategoryService, 
  Category,
  ProductsInUserOrder,
  ProductService,
  Product,
  OrderService,
  Order,
  OrderDiscount,
  CashRegister,
  PaymentType
} from '../../../shared/index';
import { isNullOrUndefined } from 'util';
import { OrderCloseComponent } from '../order-close/order-close.component';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss']
})
export class OrderNewComponent implements OnInit {

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  @ViewChild('fluid') public fluid:ModalDirective;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private productService: ProductService,
              private orderService : OrderService,
              private modalService: BsModalService,
              private categoryService : CategoryService,
              private completerService: CompleterService) { }

  pageTitle: String = 'Nuevo Pedido'; 
  prodObservation: string = 'Agregue una observación aquí...';
  menus : Menu[];
  categories : Category[];
  products: Product[]; 
  filteredProducts: Product[];
  /** Pedido en curso. */
  order: Order;
  /** Array para almacenar los productos antes de confirmarlos en el pedido. */
  preOrderProducts: Array<ProductsInUserOrder> = [];
  /** Monto total a confirmar de los productos en array preOrderProducts. */
  totalToConfirm: number;
  /** Monto total de los productos ya confirmados en la orden. */
  total: number;  
  /**Booleano que indica si el pedido tiene algun descuento. */
  thereIsDiscount: Boolean;
  /**String de búsqueda mdb-completer. */
  searchStr: string;
  /** */
  dataService: CompleterData;  
  /**Producto a eliminar del array de productos del pedido. */
  productToRemoveFromOrder:ProductsInUserOrder;
  /**Motivo para eliminar el producto del pedido. */
  deletedReason: string;
  /**Cantidad del producto seleccionado por la lista. */
  qtyProd: number = 1;   
  /**Productos ya almacenados en el pedido */
  productsInOrder: Array<ProductsInUserOrder> = [];  
  /**Cajas registradoras registradas en la bd*/
  cashRegisters: Array<CashRegister> = [];
  /**Tipos de pago registrados en la bd*/
  paymentTypes: Array<PaymentType> = [];

  ngOnInit() {
    this.order = this.orderService.transformOrderFromDbToBusiness(this._route.snapshot.data['order']);
    this.products = this._route.snapshot.data['products'];
    this.filteredProducts = this.products;
    this.menus = this._route.snapshot.data['menus'];
    this.categories = this._route.snapshot.data['categories'];
    this.cashRegisters = this._route.snapshot.data['cashRegisters'];
    this.paymentTypes = this._route.snapshot.data['paymentTypes'];    
    this.totalToConfirm = 0;
    this.order.totalPrice = isNullOrUndefined(this.order.totalPrice) ? 0 : this.order.totalPrice;    
    this.dataService = this.completerService.local(this.filteredProducts, 'name', 'name');
  }

  /**Devuelve las categorías para el menu pasado como parámetro almacenadas en el sistema
   * @param menuId id del menu para el que se quieren obtener las categorías
   */
  getCategories(menuId){
    this.categories = [];
    this.products = this.filteredProducts = [];
    this.categoryService.getCategoriesByMenu(menuId)
      .subscribe(categories => {
        this.categories = categories;
      },
      error => { 
        this.showModalError(this.serviceErrorTitle, <any>error);
      });
  }

  /**Actualiza el pedido actual
   * @param order pedido a actualizar en la base de datos
   */
  updateOrder(order:Order):void {
    let ord = this.orderService.transformOrderFromBusinessToDb(order);
    this.orderService.updateOrder(ord).subscribe(
      orderReturned => {},
      error => {        
        this.showModalError(this.serviceErrorTitle, <any>error);
      }
    )
  }
  
  showModalError(errorTitleReceived: string, errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  /**Devuelve los productos para la categoría pasada como parámetro almacenados en el sistema
   * @param menuId id de la categoría para la que se quieren obtener los productos
   */
  getProductsByCategory(categoryId) {
    this.products = this.filteredProducts = [];
    this.productService.getProductsByCategory(categoryId)
      .subscribe(products => {
        this.products = products;
      },
      error => { 
        this.showModalError(this.serviceErrorTitle, <any>error);
      }
    );
  }

  /**Agrega el producto seleccionado en la lista al pedido. Primero busca el producto en el array filteredProducts por su nombre*/
  addProductToPreOrderFromList():void {    
    let product = new Product();

    product = this.filteredProducts.find(p => p.name === this.searchStr);
    this.addProductToPreOrder(product, this.qtyProd);
  }
  
  /**Agrega los productos al array de preOrderProducts.
   * @param currentProduct producto seleccionado para agregar al array de preOrderProducts
   * @param quantity cantidad del producto seleccionado. Cuando el mismo se elige de la lista será la cantidad seleccionada, si se 
   *                 selecciona haciendo click sobre el nombre del producto es 1
   */
  addProductToPreOrder(product:Product, quantity:number):void {  
    if (!isNullOrUndefined(product))
    {
      let productInPreOrder = new ProductsInUserOrder();
      let currentProduct = new ProductsInUserOrder();

      //Creo el producto a buscar en el array de preOrderProducts.
      currentProduct.product = product._id;
      currentProduct.name = product.name;
      currentProduct.observations = '';
      currentProduct.options = null;
      currentProduct.price = product.price;
      currentProduct.quantity = quantity;
      currentProduct.size = null;
      currentProduct.deleted = false;      

      //Producto en el array preOrderProducts si existe.
      productInPreOrder = this.preOrderProducts.find(x=> this.compareProducts(x, currentProduct));
      //Si el producto ya esta en los productos pre seleccionados aumento la cantidad. Sino hago el push al array
      if (!isNullOrUndefined(productInPreOrder)) {    
        //Si el producto ya existe en el pre pedido se suma la cantidad nueva.    
        productInPreOrder.quantity += quantity;
        this.updateTotalToConfirm(productInPreOrder.price, quantity);
      }
      else
      {
        //Si el producto no existe en el pre pedido se hace el push al array.
        this.preOrderProducts.push(currentProduct);
        this.updateTotalToConfirm(currentProduct.price, quantity);
      }      
    }
  }

  /**Compara propiedad por propiedad para determinar si los productos dados como parámetros son iguales.
   * No compara la propiedad quantity porque esta va cambiando a medida que se agregan productos iguales al array.
   * @param prodInPreOrder producto existente en el array preOrderProducts 
   * @param product producto para el que se quiere determinar su existencia en el array preOrederProducts
   * @returns true si el producto se encuentra en el array preOrderProducts. false si no se encuentra.
   */
  compareProducts(prodInPreOrder: ProductsInUserOrder, product: ProductsInUserOrder):boolean {
    if (prodInPreOrder.product === product.product &&
        prodInPreOrder.name === product.name &&
        prodInPreOrder.observations === product.observations &&
        prodInPreOrder.options === product.options &&
        prodInPreOrder.price === product.price &&
        prodInPreOrder.size === product.size &&
        prodInPreOrder.deleted === product.deleted) 
      {
        return true;
      }
      else
      {
        return false;
      }
  }

  /**Elimina el producto del array preOrderProducts sin importar la cantidad
   * @param productToRemove producto a eliminar del array preOrderProducts
   */
  removeProductFromPreOrder(productToRemove:any):void {    
    if (this.preOrderProducts.length === 1)
    {
      this.updateTotalToConfirm(this.preOrderProducts[0].price, -this.preOrderProducts[0].quantity);
      this.preOrderProducts = [];
    }
    else
    {
      let indexOfProd = this.preOrderProducts.indexOf(productToRemove);
      this.preOrderProducts.splice(indexOfProd, 1);
      this.updateTotalToConfirm(productToRemove.price, -productToRemove.quantity);
    }
  }

  /**Elimina el producto del array de productos del usuario sin importar la cantidad*/
  deleteProductFromOrder():void {     
    let prodIndex = this.order.users[0].products.indexOf(this.productToRemoveFromOrder);    
    this.order.users[0].products[prodIndex].deleted = true;
    this.order.users[0].products[prodIndex].deletedReason = this.deletedReason;
    this.order.totalPrice -= this.order.users[0].products[prodIndex].quantity * this.order.users[0].products[prodIndex].price;
    this.updateOrder(this.order);
    this.closeModalDeleteProd();
  }

  /**Incrementa o disminuye la cantidad del producto en la cantidad pasada como parámetro
   * @param productToUpdateQty producto al que se le va a incrementar la cantidad
   * @param qty cantidad a ser incrementada o disminuída. Puede ser un número negativo
   */
  updateProductQty(productToUpdateQty:any, qty: number): void {
    if (productToUpdateQty.quantity + qty >= 0)
    {
      productToUpdateQty.quantity += qty;  
      this.updateTotalToConfirm(productToUpdateQty.price, qty);
    }
  }

  /**Acualiza el monto total a confirmar
   * @param price precio del producto 
   * @param qty cantidad del producto
   */
  updateTotalToConfirm(price:number, qty:number):void {
    this.totalToConfirm += price * qty;
  }

  /**Cancelar pre order */
  cancelPreOrder():void {
    this.preOrderProducts = [];
    this.totalToConfirm = 0;
  }

  /**Confirmar pre order */
  confirmPreOrder():void {
    this.preOrderProducts.forEach(productInPreOrder => {
      let productInOrder = new ProductsInUserOrder();
      productInOrder = null;
      
      //Si ya existen productos en el pedido, verifico si el producto en el pre-pedido existe en el pedido.
      if (!isNullOrUndefined(this.order.users[0].products) && this.order.users[0].products.length > 0) {
        productInOrder = this.order.users[0].products.find(product => this.compareProducts(product, productInPreOrder))
      }

      //Si el produco en el pre pedido existe en el pedido sumo la cantidad, sino lo agrego.
      if (!isNullOrUndefined(productInOrder)) {
        productInOrder.quantity += productInPreOrder.quantity
      }
      else {
        //Si el producto en el pre pedido tiene una observacion pero es igual al texto por default se cambia por vacio y 
        //se setea a false la variable hasDescription
        if (productInPreOrder.observations === this.prodObservation) {
          productInPreOrder.observations = '';
        }

        this.order.users[0].products.push(productInPreOrder);
      }
    })

    this.order.totalPrice += this.totalToConfirm;
    this.totalToConfirm = 0;
    this.preOrderProducts = [];    

    this.updateOrder(this.order);
  }

  /**Muestra o esconde la sección de observaciones para cada producto */
  showObservationBox(product:ProductsInUserOrder):void {
    product.observations = this.prodObservation;
  }    

  selectText(component):void {
    component.select();
  }

  showModalRemoveProduct(template: TemplateRef<any>, product:ProductsInUserOrder):void {
    this.productToRemoveFromOrder = product;

    this.modalRef = this.modalService.show(template, {backdrop: true, ignoreBackdropClick: true});
  }

  closeModalDeleteProd(){
    this.deletedReason = undefined;
    this.modalRef.hide();
    this.modalRef = null;       
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
  }

  closeTable(template){
		this.modalRef = this.modalService.show(template, {backdrop: true});
  }

}
