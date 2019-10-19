import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ng-uikit-pro-standard';
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
  PaymentType,
  UserRoles
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
  @ViewChild('optionsAndSizesTemplate') optionsAndSizesTemplate:TemplateRef<any>;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private productService: ProductService,
              private orderService : OrderService,
              private modalService: BsModalService,
              private categoryService : CategoryService) { }

  pageTitle: String = 'Nuevo Pedido'; 
  noProductsText: string = 'Debe seleccionar un menu y una categoria de la lista.';
  prodObservation: string = 'Agregue una observación aquí...';
  sizesAndOptionsModalTitle: string = 'Seleccionar Adicionales y Tamaños'
  menus : Menu[];
  categories : Category[];
  products: Product[]; 
  filteredProducts: Product[];
  /** Para mostrar los tamanos. */
  sizesSelect: Array<any> = [];
  /** Tamano por default. */
  sizeSelectedValue: string;
  /** Array para guardar las opciones seleccionadas */
  selectedOptions: Array<any> = [];
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
  /**Producto a eliminar del array de productos del pedido. */
  productToRemoveFromOrder:ProductsInUserOrder;
  /**Producto para mostrar las opciones y los tamanos. */
  productToFindSizesAndOptions:Product;
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
  /** Configuracion de la modal de cierre de mesa*/
  config = {
		backdrop: true,
  }
  results: Observable<Product[]>;
  searchText = new Subject();
  /** Variables para setear la clase de los menues dinamicamente segun el que esta seleccionado*/
  private activeMenu : string = '';
  /** Variables para setear la clase de las categorias dinamicamente segun la que esta seleccionada*/
  private activeCategory: string = '';

  ngOnInit() {
    this.order = this._route.snapshot.data['order'];
    console.log(this.order)
    this.products = [];
    this.filteredProducts = this.products;
    this.menus = this._route.snapshot.data['menus'];
    this.categories = [];
    this.cashRegisters = this._route.snapshot.data['cashRegisters'];
    this.paymentTypes = this._route.snapshot.data['paymentTypes'];    
    this.totalToConfirm = 0;
    this.order.totalPrice = isNullOrUndefined(this.order.totalPrice) ? 0 : this.order.totalPrice;    
    this.results = this.searchText.pipe(
      startWith(''),
      map((value: Product) => this.filter(value.name))
    )
  }

  filter(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.filteredProducts.filter((item: Product) => item.name.toLowerCase().includes(filterValue));
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
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
  }

  /**
   * Actualiza el pedido actual
   * @param order pedido a actualizar en la base de datos
   */
  updateProductsOrder(data:any):void {
    this.orderService.updateProductsOrder(data).subscribe(
      orderReturned => {
        this.order = orderReturned;
        this.totalToConfirm = 0;
        this.preOrderProducts = [];
      },
      error => {        
        this.showModalError(this.serviceErrorTitle, error.error.message);
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
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  /**Agrega el producto seleccionado en la lista al pedido. Primero busca el producto en el array filteredProducts por su nombre*/
  addProductToPreOrderFromList():void {    
    let product = new Product();

    product = this.filteredProducts.find(p => p.name === this.searchStr);
    this.validateSizesAndOptions(product, this.qtyProd);
  }
  
  /**Muestra la modal de tamanos y opciones si corresponde, si no agrega el producto a la preorden
   * @param product producto seleccionado para agregar al array de preOrderProducts y verificar los tamanos y opciones
   * @param quantity cantidad del producto seleccionado.
   */
  validateSizesAndOptions(product: Product, quantity:number){
    if(product.sizes.length > 0 || product.options.length > 0){
      this.showOptionsAndSizes(product)
    }
    else{
      let selectedSize = null;
      let selectedOptions = null;
      this.addProductToPreOrder(product,quantity,selectedSize,selectedOptions);
    }
  }

  /**Agrega los productos al array de preOrderProducts.
   * @param currentProduct producto seleccionado para agregar al array de preOrderProducts
   * @param quantity cantidad del producto seleccionado. Cuando el mismo se elige de la lista será la cantidad seleccionada, si se 
   *                 selecciona haciendo click sobre el nombre del producto es 1
   */
  addProductToPreOrder(product:Product, quantity:number, selectedSizeId: any, selectedOptions: Array<any>):void {  
    if (!isNullOrUndefined(product))
    {
      let productInPreOrder = new ProductsInUserOrder();
      let currentProduct = new ProductsInUserOrder();
      let size: any = {};
      let options: Array<any> = [];

      if(!isNullOrUndefined(selectedSizeId)){
        let selectedSize = product.sizes.find(x => x._id == selectedSizeId);
        //Creo el size con el modelo del backend
        size.price = selectedSize.price;
        size.name = selectedSize.name;
        product.price = size.price; 
      }
      else{
        size = selectedSizeId;
      }

      if(!isNullOrUndefined(selectedOptions)){
        //Creo las options con el modelo del backend
        selectedOptions.forEach(opt => {
          let currentOption: any = {};
        
          currentOption.name = opt.name;
          currentOption.price = opt.price;

          product.price += opt.price;

          options.push(currentOption);
        })
      }
      else{
        options = selectedOptions;
      }

      //Creo el producto a buscar en el array de preOrderProducts.
      currentProduct.product = product._id;
      currentProduct.name = product.name;
      currentProduct.observations = '';
      currentProduct.options = options;
      currentProduct.price = product.price;
      currentProduct.quantity = quantity;
      currentProduct.size = size;
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
    this.productToRemoveFromOrder.deleted = true;
    this.productToRemoveFromOrder.deletedReason = this.deletedReason;
    this.deleteProductOrder(this.productToRemoveFromOrder);
    this.closeModalDeleteProd();
  }

  deleteProductOrder(product: ProductsInUserOrder): void {
    let data = { productToRemove: product, order: this.order, username: UserRoles.ADMIN };
    this.orderService.deleteProductOrder(data).subscribe(
      orderReturned => {
        this.order = orderReturned;
      },
      error => {        
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    )
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
    if (!isNullOrUndefined(this.preOrderProducts) && this.preOrderProducts.length > 0) {
      this.preOrderProducts.forEach(productInPreOrder => {
        if (productInPreOrder.observations === this.prodObservation || productInPreOrder.observations === '') {
          productInPreOrder.observations = null;
        }
      })
      let data = { products: this.preOrderProducts, total: this.totalToConfirm, username: UserRoles.ADMIN, order: this.order };
      this.updateProductsOrder(data);      
    }    
  }

  /**Muestra o esconde la sección de observaciones para cada producto */
  showObservationBox(product:ProductsInUserOrder):void {
    product.observations = this.prodObservation;
  }    

  selectText(component):void {
    component.select();
  }

  showModalRemoveProduct(template: TemplateRef<any>, product:ProductsInUserOrder):void {
    this.productToRemoveFromOrder = JSON.parse(JSON.stringify(product)) as ProductsInUserOrder;;

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
		this.modalRef = this.modalService.show(template,  Object.assign({}, this.config, {class: 'closeOrderModal'}));
  }

  applyClassMenu(menuId){
    this.activeMenu = menuId;    
  }

  applyClassCategory(categoryId){
    this.activeCategory = categoryId;    
  }

  showOptionsAndSizes(product:Product):void {
    this.productToFindSizesAndOptions = product;
    
    for (let size of this.productToFindSizesAndOptions.sizes){
      if(size.default === true){
        this.sizesSelect.push({value: size._id, label:size.name, selected:true})
      }
      else{
        this.sizesSelect.push({value: size._id, label:size.name})
      }
    };
    
    this.sizeSelectedValue = this.productToFindSizesAndOptions.sizes.find(x => x.default == true)._id;

    this.modalRef = this.modalService.show(this.optionsAndSizesTemplate, {backdrop: true, ignoreBackdropClick: true});
  }

  onOptionSelectedChange(option:any){
    let optionIndex = this.selectedOptions.indexOf(option);
    if(optionIndex !== -1){
      this.selectedOptions.splice(optionIndex, 1);
    }
    else{
      this.selectedOptions.push(option);
    }
  }

  setProductOptionsAndSize(product){
    this.addProductToPreOrder(product,1,this.sizeSelectedValue, this.selectedOptions)
    this.closeModalOptionsAndSizes();
  }

  closeModalOptionsAndSizes(){
    this.sizesSelect = [];
    this.sizeSelectedValue = '';
    this.selectedOptions = [];
    this.modalRef.hide();
    this.modalRef = null;       
  }
}
