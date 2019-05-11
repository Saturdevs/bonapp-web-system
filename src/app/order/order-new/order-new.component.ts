import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

import { CompleterData } from 'ng-mdb-pro/pro/autocomplete';

import { CompleterService } from 'ng-mdb-pro/pro/autocomplete';

import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ng-mdb-pro/free';
import { 
  ArqueoCajaService, 
  CashRegisterService, 
  CashRegister, 
  ArqueoCaja, 
  PaymentType, 
  PaymentTypeService, 
  MenuService, 
  Menu, 
  CategoryService, 
  Category,
  ProductsInUserOrder,
  ProductService,
  Product,
  TableService,
  Table,
  OrderService,
  Order,
  OrderDiscount
} from '../../../shared/index';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss']
})
export class OrderNewComponent implements OnInit {
  public modalRef: BsModalRef;

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private productService: ProductService,
              private orderService : OrderService,
              private tableService : TableService,
              private modalService: BsModalService,
              private arqueoCajaService : ArqueoCajaService,
              private cashRegisterService : CashRegisterService,
              private menuService : MenuService,
              private categoryService : CategoryService,
              private paymentTypesService : PaymentTypeService,
              private completerService: CompleterService) { }

  pageTitle: String = 'Nuevo Pedido'; 
  prodObservation: string = 'Agregue una observación aquí...';
  errorMessage: string; 
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
  /**Booleano para determinar si mostrar la sección de descuento o no. */
  showDiscount: Boolean;
  /**Booleano que indica si el pedido tiene algun descuento. */
  thereIsDiscount: Boolean;
  /**String de búsqueda mdb-completer. */
  searchStr: string;
  /** */
  dataService: CompleterData;
  /**Porcentaje de descuento. */
  discountRate: number;
  /**Monto de descuento. */
  discountAmount: number;
  /**Producto a eliminar del array de productos del pedido. */
  productToRemoveFromOrder:ProductsInUserOrder;
  /**Motivo para eliminar el producto del pedido. */
  deletedReason: string;
  /**Cantidad del producto seleccionado por la lista. */
  qtyProd: number = 1;   

  @ViewChild('fluid') public fluid:ModalDirective;

  ngOnInit() {
    this.order = this._route.snapshot.data['order'];
    console.log(this.order)
    this.products = this._route.snapshot.data['products'];
    this.filteredProducts = this.products;
    this.menus = this._route.snapshot.data['menus'];
    this.categories = this._route.snapshot.data['categories'];
    this.totalToConfirm = 0;
    this.order.totalPrice = 0;
    this.showDiscount = false;
    console.log(this.order.discount)
    //this.thereIsDiscount = !isNullOrUndefined(this.order.discount);
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
      error => { this.errorMessage = <any>error['message'];});
  }

  /**Actualiza el pedido actual
   * @param order pedido a actualizar en la base de datos
   */
  updateOrder(order:Order):void {
    this.orderService.updateOrder(order).subscribe(
      orderReturned => {
        this.order = orderReturned;
      },
      error => {
        this.errorMessage = <any>error,
        this.showModalError(this.errorTemplate)
      }
    )
  }
  
  showModalError(errorTemplate: TemplateRef<any>){
    this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
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
      error => { this.errorMessage = <any>error['message'];}
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
      currentProduct.id = product._id;
      currentProduct.name = product.name;
      currentProduct.hasObservations = false;
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

  /**Compara propiedad por propiedad para determinar si el producto dado como parámetro existe en el array de preOrderProducts.
   * No compara la propiedad quantity porque esta va cambiando a medida que se agregan productos iguales al array.
   * @param prodInPreOrder producto existente en el array preOrderProducts 
   * @param product producto para el que se quiere determinar su existencia en el array preOrederProducts
   * @returns true si el producto se encuentra en el array preOrderProducts. false si no se encuentra.
   */
  compareProducts(prodInPreOrder: ProductsInUserOrder, product: ProductsInUserOrder):boolean {
    if (prodInPreOrder.id === product.id &&
        prodInPreOrder.name === product.name &&
        prodInPreOrder.hasObservations === product.hasObservations &&
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
      this.preOrderProducts = this.preOrderProducts.splice(indexOfProd-1, 1);
      this.updateTotalToConfirm(productToRemove.price, -productToRemove.quantity);
    }
  }

  /**Elimina el producto del array de productos del usuario sin importar la cantidad*/
  deleteProductFromOrder():void {     
    let prodIndex = this.order.users[0].products.indexOf(this.productToRemoveFromOrder);    
    this.order.users[0].products[prodIndex].deleted = true;
    this.order.users[0].products[prodIndex].deletedReason = this.deletedReason;
    this.order.totalPrice -= this.order.users[0].products[prodIndex].quantity * this.order.users[0].products[prodIndex].price;
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
        if (productInPreOrder.hasObservations === true && productInPreOrder.observations === this.prodObservation) {
          productInPreOrder.hasObservations = false;
          productInPreOrder.observations = '';
        }

        this.order.users[0].products.push(productInPreOrder);
      }
    })

    this.order.totalPrice += this.totalToConfirm;
    this.totalToConfirm = 0;
    this.preOrderProducts = [];    
  }

  /**Muestra o esconde la sección de observaciones para cada producto */
  showObservationBox(product:ProductsInUserOrder):void {
    product.hasObservations = !product.hasObservations;
    product.observations = this.prodObservation;
  }

  /**Muestra o esconde la sección de descuento */
  showDiscountSection(show: boolean):void {
    this.showDiscount = show;

    if (show === true) {
      this.discountAmount = 0;
      this.discountRate = 0;        
    }
  }

  /**Calcula el porcentaje de descuento según el monto de descuento ingresado */
  calculateRate():void {
    this.discountRate = (this.discountAmount * 100) / this.order.totalPrice; 
  }

  /**Calcula el monto de descuento según el porcentaje de descuento ingresado */
  calculateAmount():void {
    this.discountAmount = (this.discountRate / 100) * this.order.totalPrice;
  }

  addDiscount():void {
    this.showDiscountSection(false);  
    if (isNullOrUndefined(this.order.discount))
    {
      this.order.discount = new OrderDiscount();
      this.order.discount.discountAmount = this.discountAmount;  
      this.order.discount.discountRate = this.discountRate;
      this.order.discount.subtotal = this.order.totalPrice;
      this.order.totalPrice = this.order.discount.subtotal - this.order.discount.discountAmount;  
    }
    else
    {
      this.order.discount.discountAmount = this.discountAmount;  
      this.order.discount.discountRate = this.discountRate;
      this.order.totalPrice = this.order.discount.subtotal - this.order.discount.discountAmount;
    }
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
  



  //PARA QUE ES ESTE METODO?
  /* checkQty(product) : void{
    // if (this.orderQty.find(x=> x.productCode == product.code)){
    //   if(this.orderQty.find(x=> x.productCode == product.code).qty > 1){
    //       this.orderQty.find(x=> x.productCode == product.code).qty--
    //   }
    //   else {
    //     this.orderQty.splice(this.orderQty.indexOf(product),1)
    //   } 
    // }
    // else
    // {
    //   this.orderQty.push({
    //     productName : product.name,
    //     productCode : product.code,
    //     qty : 1
    //   })
    // }  
    
    console.log(product.qty);
  }

  findOrders(table : Table){
    //   this.tableActive.status = 'Ocupada'; //SOLO PARA PRUEBAS POR EL ERROR DE QUERYSELECTORALL

    //  // let tableNum = parseInt(this._route.snapshot.params['idTable']);
    //   this.tableNumber = this.tableNum;
    //   this.tableActive = table;
    //   //this.getTableByNumber(tableNum);
    //   //console.log(this.tableActive);
    // if(this.tableActive.status === 'Libre'){
    //     this.openOrder = false;
    //     this.tableActive.status = 'Ocupada'
    //     this.tableService.updateTable(this.tableActive);
    //   }
    
//    if(this.tableActive.status === 'Ocupada'){
      this.orderService.getAll() 
//tengo que cambiar esto para que busque solamente la ordenes 
//de la mesa que clickeo y seria bueno que de hecho traiga las
// ordenes activas de esa mesa, asi no hay que iterar desde el front.
        .subscribe(orders => {
          orders.forEach(order => {
            if (order.open && order.table === this.tableActive.number){
              //this.openOrder = true;
              this.currentOrder = order;
              return;
            };
            orders.forEach(secondOrder => {
              if(order.orderNumber > secondOrder.orderNumber){
                //this.maxOrderNumber = parseInt(order.orderNumber);
              };
            });
          });
          if (!this.maxOrderNumber){
              this.maxOrderNumber = 0;
              if(isNaN(this.maxOrderNumber)){
                this.maxOrderNumber = 0;
              }
          }
          if(!this.currentOrder){
            this.currentOrder = new Order();
          }

        })
    
    //    this.orderService.getOrdersByTable(tableNum)

    //}
  }

  getTableByNumber(tableNumber){
    this.tableService.getTableByNumber(tableNumber)
       .subscribe(table => {
         this.currentTable = table;
         this.findOrders(this.currentTable);
    },
    error => { this.errorMessage = <any>error['message'];});
  }

  

  saveOrder(){
    //console.log(this.currentTable);
    if(this.currentTable.status == 'Libre'){
      this.currentTable.status = 'Ocupada';
      this.tableService.updateTable(this.currentTable)
      .subscribe(table => {
        this.currentTable = table;
        console.log(this.currentTable);
      },
      error => { this.errorMessage = <any>error['message'];}
    );
    };
    //this.currentOrder.orderNumber = (this.maxOrderNumber + 1).toString();
    this.currentOrder.type = 'Mostrador';
    this.currentOrder.waiter = 'asdjkfaljdsfa';
    this.currentOrder.table = this.currentTable.number;
    this.currentOrder.orderApp = false;

  //  this.openOrder = true;
    this.orderService.saveOrder(this.currentOrder);
    this._router.navigate(['./orders/section/tables/5a63ccdbb3f3d70c3837e49a']);
  }

  getAllPaymentTypes(){
    this.paymentTypesService.getAvailables().subscribe(
      paymentTypes => this.availablePaymentTypes = paymentTypes)
  }

  populatePaymentTypesInOrder(){
  }

  closeOrder(order : Order){
    this.orderTotalPrice = this.currentOrder.subtotal - this.discountAmount;
    order.completed_at = new Date().toLocaleDateString();
    order.discountPercentage = this.discountPercentage;
    order.cashRegister = this.currentCashRegister._id;
    order.totalPrice = this.orderTotalPrice;
    order.status = "Cerrada"; //ver si es el estado
    order.payment = this.paymentsInCurrentOrder;
  
    this.orderService.saveOrder(order);
  }
 
  getAllCashRegister(){
    this.cashRegisterService.getAll().subscribe(cashregisters =>
      this.cashRegisters = cashregisters)
  }

  getArqueo(){
    this.arqueoCajaService.getArqueoOpenByCashRegister(this.currentCashRegister).subscribe(
      arqueo => this.openArqueo = arqueo
    )
    this.addOrderToArqueo(this.openArqueo)
  }

  addOrderToArqueo(openArqueo : ArqueoCaja){
    //hacer algo aca; 
  }

  
 */

  }
