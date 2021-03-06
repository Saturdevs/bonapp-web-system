import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Subject, of, Observable } from 'rxjs';

 import { ModalDirective, MdbAutoCompleterComponent, ToastService } from 'ng-uikit-pro-standard';
import {
  Menu,
  CategoryService,
  Category,
  ProductsInUserOrder,
  ProductService,
  Product,
  OrderService,
  Order,
  CashRegister,
  PaymentType,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions,
  TableService,
  UsersInOrder,
  Table,
  TableStatus,
  ClientService,
  Client,
  Constants,
  Params,
  ParamService,
  UtilFunctions
} from '../../../shared/index';
import { isNullOrUndefined } from 'util';
import { OrderCloseComponent } from '../order-close/order-close.component';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';
import { DailyMenu } from '../../../shared/models/dailyMenu';
import { DailyMenuService } from '../../../shared/services/daily-menu.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss']
})
export class OrderNewComponent implements OnInit {

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  @ViewChild('fluid') public fluid: ModalDirective;
  @ViewChild('optionsAndSizesTemplate') optionsAndSizesTemplate: TemplateRef<any>;
  @ViewChild(MdbAutoCompleterComponent) completer: MdbAutoCompleterComponent;

  constructor(private _route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService,
    private modalService: BsModalService,
    private categoryService: CategoryService,
    private dailyMenuService: DailyMenuService,
    private _authenticationService: AuthenticationService,
    private tableService: TableService,
    private toast: ToastService,
    private clientService: ClientService,
    private _paramService: ParamService) { }

  pageTitle: String = 'Nuevo Pedido';
  noCategoriesText: string = 'Debe seleccionar un menu y una categoria de la lista.';
  noProductsAvailablesText: string = 'No hay productos disponibles para la categoria seleccionada.';
  prodObservation: string = 'Agregue una observaci??n aqu??...';
  sizesAndOptionsModalTitle: string = 'Seleccionar Adicionales y Tama??os';
  private rightErrorTitle = 'Error de Permisos';
  private rightErrorMessage = 'Usted no posee los permisos requeridos para realizar la acci??n deseada. Pongase en contacto con el administrador del sistema.';
  editModalTitle: string = 'Editar pedido';
  editOrderTableText: string = 'Nro. de Mesa';
  cancelButtonText: string = 'Cancelar';
  saveButtonText: string = 'Guardar';
  categorySelected: boolean = false;
  /*Para mostrar un mensaje diferente si no selecciono categoria o si no hay productos disponibles. */
  menus: Menu[];
  categories: Category[];
  dailyMenus: DailyMenu[];
  /** Para mostrar los productos de la categoria seleccionada */
  products: Product[];
  /** Para mostrar los productos de todas las categorias */
  allProducts: Product[]
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
  /**String de b??squeda mdb-completer. */
  searchStr = new Subject();
  /**Producto a eliminar del array de productos del pedido. */
  productToRemoveFromOrder: ProductsInUserOrder;
  /** Nombre de usuario del usuario para el que se quiere eliminar un producto del pedido */
  usernameProductToRemove: String;
  /**Producto para mostrar las opciones y los tamanos. */
  productToFindSizesAndOptions: Product;
  /**Motivo para eliminar el producto del pedido. */
  deletedReason: string;
  /**Cantidad del producto seleccionado por la lista. */
  qtyProd: number = 1;
  /**Productos ya almacenados en el pedido */
  usersInOrder: Array<UsersInOrder> = [];
  /**Cajas registradoras registradas en la bd*/
  cashRegisters: Array<CashRegister> = [];
  /**Tipos de pago registrados en la bd*/
  paymentTypes: Array<PaymentType> = [];
  /** Configuracion de la modal de cierre de mesa*/
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  /**Variable para controlar si se devuelve el stock de un producto al eliminarlo de una orden */
  returnStockValue: Boolean = false;
  results: Observable<any>;
  searchText = new Subject();
  /** Variables para setear la clase de los menues dinamicamente segun el que esta seleccionado*/
  private activeMenu: string = '';
  /** Variables para setear la clase de las categorias dinamicamente segun la que esta seleccionada*/
  private activeCategory: string = '';
  /** Label de dailyMenus */
  dailyMenusLabel = "Menu del Dia";
  /** Variable para verificar si se esta en dailyMenu*/
  activeDailyMenu = false;
  currentUser: User;
  enableAddProducts: Boolean;
  enableDeleteProducts: Boolean;
  enableCloseOrder: Boolean;
  /** Variables para cambiar numero de mesa en pedido */
  private orderToEdit: Order;
  private orderNewTable: number;
  /** Variables para dividir mesa */
  private productsInOrderToSlice: ProductsInUserOrder[];
  private orderToSlice: Order;
  private productsToSlice: ProductsInUserOrder[] = [];
  private sliceToTable: number;
  private newOrderIsCreated: boolean;
  private tableToSlice: Table;
  private client: Client;
  private users: User[] = [];
  public waiterSelect: Array<any> = [];
  public waiterSelected: any;
  public waiterRequired:Boolean = false;
  private productsToFilter = [];
  public userSelect: Array<any> = [];
  public userSelected: any = null;

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableActions();
      }
    );

    //get resolvers data
    this.order = this._route.snapshot.data['order'];
    this.menus = this._route.snapshot.data['menus'];
    this.dailyMenus = this._route.snapshot.data['dailyMenus'];
    this.cashRegisters = this._route.snapshot.data['cashRegisters'];
    this.paymentTypes = this._route.snapshot.data['paymentTypes'];
    this.users = this._route.snapshot.data['users'];
    this.productsToFilter = this._route.snapshot.data['products'];

    this.products = [];
    this.filteredProducts = this.productsToFilter;    
    this.categories = [];    
    this.totalToConfirm = 0;
    this.order.totalPrice = isNullOrUndefined(this.order.totalPrice) ? 0 : this.order.totalPrice;
    this.getProducts();
    this.getFilteredData();
    if(!isNullOrUndefined(this.order.users[0].clientId)){
      this.getClient(this.order.users[0].clientId);
    }

    this.setWaiterSelect();
    this.setUserSelect();
    this.setProductsInOrder();
  }

  setWaiterSelect(): void {
    this.waiterSelect.push({ value: 'default', label: 'Seleccione Mozo...' });
    for (let user of this.users) {
      this.waiterSelect.push({ value: user._id, label: user.lastname + ' ' + user.name, selected: false });
    };    

    if (this.currentUser.isGeneral && !this._paramService.getBooleanParameter(Params.ASK_FOR_USER_PIN)) {      
      this.waiterSelected = 'default';
    } else {
      this.waiterSelected = this.orderService.getEmployeeWhoAddedId();
    }
  }

  setUserSelect(): void {
    if (this.order.users.length > 1) {
      this.order.users.sort((a, b) => a.username.localeCompare(b.username));
      this.userSelect.push({ value: Constants.DEFAULT, label: 'Todos', selected: true });
      this.userSelected = Constants.DEFAULT;
    }
    const bonappUserIndex = this.order.users.findIndex(usr => usr.username === Constants.BONAPP_WEB_USER);
    if (bonappUserIndex !== -1) {
      const bonappUser = this.order.users[bonappUserIndex];
      if (this.userSelected === null) {
        this.userSelected = bonappUser.username;
      }
    } else {
      this.userSelect.push({ value: Constants.BONAPP_WEB_USER, label: Constants.BONAPP_WEB_USER, selected: false });
    }    
    for (let user of this.order.users) {
      this.userSelect.push({ value: user.username, label: user.username, selected: false });
    }

    if (this.userSelected === null) {
      this.userSelected = this.order.users[0].username;
    }    
  }

  setProductsInOrder(): void {
    this.usersInOrder = [];
    if (this.userSelected === Constants.DEFAULT) {
      for (let user of this.order.users) {
        this.usersInOrder.push(user);
      }
    } else {      
      const user = this.order.users.find(usr => usr.username === this.userSelected);
      if (!isNullOrUndefined(user)) {
        this.usersInOrder.push(user);
      }
    }
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar seg??n los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableAddProducts = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.ADD_PRODUCTS_ORDER);
    this.enableDeleteProducts = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_PRODUCTS_ORDER);
    this.enableCloseOrder = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.CLOSE_ORDER);
  }

  filter(value: string): Product[] | undefined {
    // this.filteredProducts = this.products;
    const filterValue = value.toLowerCase();
    if(this.filteredProducts){
      return this.filteredProducts.filter((item: Product) => item.name.toLowerCase().includes(filterValue));
    }
  }

  /**Devuelve las categor??as para el menu pasado como par??metro almacenadas en el sistema
   * @param menuId id del menu para el que se quieren obtener las categor??as
   */
  getCategories(menuId) {
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

  /**Devuelve las categor??as disponibles para el menu pasado como par??metro almacenadas en el sistema
   * @param menuId id del menu para el que se quieren obtener las categor??as disponibles
   */
  getCategoriesAvailables(menuId) {
    this.categories = [];
    this.products = this.filteredProducts = [];
    this.categoryService.getCategoriesAvailablesByMenu(menuId)
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
  updateProductsOrder(data: any): void {
    this.orderService.updateProductsOrder(data).subscribe(
      orderReturned => {
        this.waiterRequired = false;
        this.order = orderReturned;
        this.totalToConfirm = 0;
        this.preOrderProducts = [];
        this.setProductsInOrder();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    )
  }

  showModalError(errorTitleReceived: string, errorMessageReceived: string) {
    this.modalRef = this.modalService.show(ErrorTemplateComponent, { backdrop: true });
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  /**Devuelve los productos para la categor??a pasada como par??metro almacenados en el sistema
   * @param menuId id de la categor??a para la que se quieren obtener los productos
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

  getProductsAvailablesByCategory(categoryId) {
    this.products = this.filteredProducts = [];
    this.productService.getProductsAvailablesByCategory(categoryId)
      .subscribe(products => {
        this.products = products;
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
  }

  /** Obtiene todos los productos de todas las categorias */
  getProducts() {
    this.productService.getAll()
      .subscribe(products => {
        this.allProducts = products;
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
  }

  /**Agrega el producto seleccionado en la lista al pedido. Primero busca el producto en el array filteredProducts por su nombre*/
  addProductToPreOrderFromList(): void {
    let selectedProd = this.completer.getSelectedItem();
    if (selectedProd.text !== 'undefined') {
      let product = new Product();
      product = this.allProducts.find(p => p.name === selectedProd.text);
      this.validateSizesAndOptions(product, this.qtyProd);
      this.completer.getSelectedItem().text = 'undefined';
    }
  }

  /**Muestra la modal de tamanos y opciones si corresponde, si no agrega el producto a la preorden
   * @param product producto seleccionado para agregar al array de preOrderProducts y verificar los tamanos y opciones
   * @param quantity cantidad del producto seleccionado.
   */
  validateSizesAndOptions(product: Product, quantity: number) {
    if (this.enableAddProducts) {
      if (product.sizes.length > 0 || product.options.length > 0) {
        this.showOptionsAndSizes(product)
      }
      else {
        let selectedSize = null;
        let selectedOptions = null;
        this.addProductToPreOrder(product, quantity, selectedSize, selectedOptions);
      }
    } else {
      this.showModalError(this.rightErrorTitle, this.rightErrorMessage);
    }
  }

  /** Agrega un menu del dia a la pre orden actual
   * @param dailyMenu menu del dia a agregar a la orden
   * @param quantity cantidad del menuDelDia seleccionado.   * 
   */
  addDailyMenuToPreOrder(dailyMenu: DailyMenu, quantity: number) {
    if (!isNullOrUndefined(dailyMenu)) {
      let currentProduct = new ProductsInUserOrder();
      let productInPreOrder = new ProductsInUserOrder();

      //Creo el producto a buscar en el array de preOrderProducts.
      currentProduct.dailyMenuId = dailyMenu._id;
      currentProduct.product = null;
      currentProduct.name = dailyMenu.name;
      currentProduct.observations = '';
      currentProduct.options = null;
      currentProduct.price = dailyMenu.price;
      currentProduct.quantity = quantity;
      currentProduct.size = null;
      currentProduct.deleted = false;

      //Producto en el array preOrderProducts si existe.
      productInPreOrder = this.preOrderProducts.find(x => UtilFunctions.compareProducts(x, currentProduct));
      //Si el producto ya esta en los productos pre seleccionados aumento la cantidad. Sino hago el push al array
      if (!isNullOrUndefined(productInPreOrder)) {
        //Si el producto ya existe en el pre pedido se suma la cantidad nueva.    
        productInPreOrder.quantity += quantity;
        this.updateTotalToConfirm(productInPreOrder.price, quantity);
      }
      else {
        //Si el producto no existe en el pre pedido se hace el push al array.
        this.preOrderProducts.push(currentProduct);
        this.updateTotalToConfirm(currentProduct.price, quantity);
      }

      dailyMenu.products.forEach(productId => {
        this.productService.getProduct(productId)
          .subscribe(product => {
            if (product.stockControl) {
              product.stock.current--;
              this.productService.updateProduct(product)
                .subscribe(resp => {
                });
            }
          });
      });
    }
  }

  /**Agrega los productos al array de preOrderProducts.
   * @param currentProduct producto seleccionado para agregar al array de preOrderProducts
   * @param quantity cantidad del producto seleccionado. Cuando el mismo se elige de la lista ser?? la cantidad seleccionada, si se 
   *                 selecciona haciendo click sobre el nombre del producto es 1
   */
  addProductToPreOrder(product: Product, quantity: number, selectedSizeId: any, selectedOptions: Array<any>): void {
    if (!isNullOrUndefined(product)) {
      let productInPreOrder = new ProductsInUserOrder();
      let currentProduct = new ProductsInUserOrder();
      let size: any = {};
      let options: Array<any> = [];

      if (!isNullOrUndefined(selectedSizeId)) {
        let selectedSize = product.sizes.find(x => x._id == selectedSizeId);
        //Creo el size con el modelo del backend
        size.price = selectedSize.price;
        size.name = selectedSize.name;
        product.price = size.price;
      }
      else {
        size = selectedSizeId;
      }

      if (!isNullOrUndefined(selectedOptions) && selectedOptions.length > 0) {
        //Creo las options con el modelo del backend
        selectedOptions.forEach(opt => {
          let currentOption: any = {};

          currentOption.name = opt.name;
          currentOption.price = opt.price;

          product.price += opt.price;

          options.push(currentOption);
        })
      }
      else {
        options = null;
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
      productInPreOrder = this.preOrderProducts.find(x => UtilFunctions.compareProducts(x, currentProduct));
      //Si el producto ya esta en los productos pre seleccionados aumento la cantidad. Sino hago el push al array
      if (!isNullOrUndefined(productInPreOrder)) {
        //Si el producto ya existe en el pre pedido se suma la cantidad nueva.    
        productInPreOrder.quantity += quantity;
        this.updateTotalToConfirm(productInPreOrder.price, quantity);
      }
      else {
        //Si el producto no existe en el pre pedido se hace el push al array.
        this.preOrderProducts.push(currentProduct);
        this.updateTotalToConfirm(currentProduct.price, quantity);
      }

      if (product.stockControl) {
        product.stock.current--;

        this.productService.updateProduct(product)
          .subscribe(resp => {
          });
      }

    }
  }

  /**Elimina el producto del array preOrderProducts sin importar la cantidad
   * @param productToRemove producto a eliminar del array preOrderProducts
   */
  removeProductFromPreOrder(productToRemove: ProductsInUserOrder): void {
    if (this.preOrderProducts.length === 1) {
      this.updateTotalToConfirm(this.preOrderProducts[0].price, -this.preOrderProducts[0].quantity);
      this.preOrderProducts = [];
    }
    else {
      let indexOfProd = this.preOrderProducts.indexOf(productToRemove);
      this.preOrderProducts.splice(indexOfProd, 1);
      this.updateTotalToConfirm(productToRemove.price, -productToRemove.quantity);
    }


    if (isNullOrUndefined(productToRemove.dailyMenuId)) {
      if (this.products.find(x => x._id === productToRemove.product).stockControl) {
        let productToUpdateStock = this.products.find(x => x._id === productToRemove.product);
        productToUpdateStock.stock.current += productToRemove.quantity;

        this.productService.updateProduct(productToUpdateStock)
          .subscribe(resp => {
          });
      }
    }
    else {
      let dailyMenu = this.dailyMenus.find(x => x._id == productToRemove.dailyMenuId);
      dailyMenu.products.forEach(productId => {
        this.productService.getProduct(productId)
          .subscribe(product => {
            if (product.stockControl) {
              product.stock.current += productToRemove.quantity;
              this.productService.updateProduct(product)
                .subscribe(resp => {
                });
            }
          });
      });
    }
  }

  /**Elimina el producto del array de productos del usuario sin importar la cantidad*/
  deleteProductFromOrder(): void {
    this.productToRemoveFromOrder.deleted = true;
    this.productToRemoveFromOrder.deletedReason = this.deletedReason;
    this.deleteProductOrder(this.productToRemoveFromOrder);
    this.closeModalDeleteProd();
  }

  deleteProductOrder(product: ProductsInUserOrder): void {
    let data = { productToRemove: product, order: this.order, username: this.usernameProductToRemove };
    this.orderService.deleteProductOrder(data).subscribe(
      orderReturned => {
        this.order = orderReturned;
        this.setProductsInOrder();
        if (isNullOrUndefined(product.dailyMenuId)) {
          if (this.products.find(x => x._id === product.product).stockControl) {
            let productToUpdateStock = this.products.find(x => x._id === product.product);
            productToUpdateStock.stock.current += product.quantity;

            this.productService.updateProduct(productToUpdateStock)
              .subscribe(resp => {
                this.returnStockValue = false;
              });
          }
        }
        else {
          let dailyMenu = this.dailyMenus.find(x => x._id == product.dailyMenuId);
          dailyMenu.products.forEach(productId => {
            this.productService.getProduct(productId)
              .subscribe(productObtained => {
                if (productObtained.stockControl) {
                  productObtained.stock.current += product.quantity;
                  this.productService.updateProduct(productObtained)
                    .subscribe(resp => {
                      this.returnStockValue = false;
                    });
                }
              });
          });
        }        
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    )
  }

  /**Incrementa o disminuye la cantidad del producto en la cantidad pasada como par??metro
   * @param productToUpdateQty producto al que se le va a incrementar la cantidad
   * @param qty cantidad a ser incrementada o disminu??da. Puede ser un n??mero negativo
   */
  updateProductQty(productToUpdateQty: any, qty: number): void {
    if (productToUpdateQty.quantity + qty >= 0) {
      productToUpdateQty.quantity += qty;
      this.updateTotalToConfirm(productToUpdateQty.price, qty);
    }
  }

  /**Acualiza el monto total a confirmar
   * @param price precio del producto 
   * @param qty cantidad del producto
   */
  updateTotalToConfirm(price: number, qty: number): void {
    this.totalToConfirm += price * qty;
  }

  /**Cancelar pre order */
  cancelPreOrder(): void {
    this.preOrderProducts = [];
    this.totalToConfirm = 0;
  }

  /**Confirmar pre order */
  confirmPreOrder(): void {
    if (this.waiterSelected !== 'default') {
      if (!isNullOrUndefined(this.preOrderProducts) && this.preOrderProducts.length > 0) {
        this.preOrderProducts.forEach(productInPreOrder => {
          if (productInPreOrder.observations === this.prodObservation || productInPreOrder.observations === '') {
            productInPreOrder.observations = null;
          }

          productInPreOrder.employeeWhoAdded = this.orderService.getEmployeeWhoAddedId();
          productInPreOrder.employee = this.waiterSelected;
        })
        let data = { products: this.preOrderProducts, total: this.totalToConfirm, username: this.userSelected, order: this.order };
        this.updateProductsOrder(data);
      }
    } else {
      this.waiterRequired = true;
    }
  }

  /**Muestra o esconde la secci??n de observaciones para cada producto */
  showObservationBox(product: ProductsInUserOrder): void {
    product.observations = this.prodObservation;
  }

  selectText(component): void {
    component.select();
  }

  showModalRemoveProduct(template: TemplateRef<any>, product: ProductsInUserOrder, user: UsersInOrder): void {
    this.productToRemoveFromOrder = JSON.parse(JSON.stringify(product)) as ProductsInUserOrder;
    this.usernameProductToRemove = user.username;
    this.modalRef = this.modalService.show(template, { backdrop: true, ignoreBackdropClick: true });
  }

  closeModalDeleteProd() {
    this.deletedReason = undefined;
    this.modalRef.hide();
    this.modalRef = null;
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  closeTable(template) {
    this.modalRef = this.modalService.show(template, Object.assign({}, this.config, { class: 'closeOrderModal' }));
  }

  applyClassMenu(menuId) {
    this.activeMenu = menuId;
    this.activeDailyMenu = false;
  }

  applyClassDailyMenu() {
    this.applyClassMenu(null);
    this.activeDailyMenu = true;
  }

  applyClassCategory(categoryId) {
    this.activeCategory = categoryId;
    this.activeDailyMenu = false;
  }

  showSliceModal(sliceTemplate: TemplateRef<any>, orderId: any) {
    this.orderService.getOrder(orderId)
      .subscribe(
        order => {
          this.orderToSlice = order;
          this.productsInOrderToSlice = this.orderToSlice.users[0].products;

        }
      )
    this.modalRef = this.modalService.show(sliceTemplate, { backdrop: true });
  }


  addProductToSlice(productToAdd : ProductsInUserOrder) {
    let productOrDailyMenuToSlice = new ProductsInUserOrder();
    if(productToAdd.dailyMenuId){
      this.dailyMenuService.getDailyMenu(productToAdd.dailyMenuId)
        .subscribe(dailyMenu => {
          productOrDailyMenuToSlice.dailyMenuId = dailyMenu._id;
          productOrDailyMenuToSlice.name = dailyMenu.name;  
        });
    }else if(productToAdd.product){
      this.productService.getProduct(productToAdd.product)
        .subscribe(product => {
          productOrDailyMenuToSlice.product = product._id;
          productOrDailyMenuToSlice.name = product.name;
        });
      }
      productOrDailyMenuToSlice._id = productToAdd._id;
      productOrDailyMenuToSlice.observations = '';
      productOrDailyMenuToSlice.options = productToAdd.options;
      productOrDailyMenuToSlice.price = productToAdd.price;
      productOrDailyMenuToSlice.quantity = productToAdd.quantity;
      productOrDailyMenuToSlice.size = productToAdd.size;
      productOrDailyMenuToSlice.deleted = false;
    if (this.productsToSlice.indexOf(productOrDailyMenuToSlice) != -1) {
      this.productsToSlice.splice(this.productsToSlice.indexOf(productOrDailyMenuToSlice), 1);
    }
    else {
      this.productsToSlice.push(productOrDailyMenuToSlice);
    }
  }

  saveSlicedOrder() {
    this.newOrder(this.sliceToTable, this.productsToSlice);
  }

  showEditModal(editTemplate: TemplateRef<any>, orderId: any) {
    this.orderService.getOrder(orderId)
      .subscribe(
        order => {
          this.orderToEdit = order;
          this.orderNewTable = this.orderToEdit.table;
        }
      )
    this.modalRef = this.modalService.show(editTemplate, { backdrop: true });
  }

  saveEditedOrder() {
    let oldTableNumer = this.orderToEdit.table;
    this.orderToEdit.table = this.orderNewTable;
    this.orderService.updateOrder(this.orderToEdit)
      .subscribe(resp => {
        console.log("Se actualizo el pedido" + this.orderToEdit._id);
        this.tableService.getTableByNumber(oldTableNumer)
          .subscribe(
            table => {
              let tableToUpdate = table;
              // tableToUpdate.status = "Libre";
              this.tableService.updateTable(tableToUpdate)
                .subscribe(
                  result => {
                    console.log("Se actualizo la mesa" + tableToUpdate.number);
                  },
                  error => {
                    this.showModalError(this.serviceErrorTitle, error.error.message);
                  }
                );
            },
            error => {
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          );
        this.showSuccessToast()
        this.closeModal();
      },
        error => {
          this.closeModal();
          this.showModalError(this.serviceErrorTitle, error.error.message);
        });
  }

  showSuccessToast() {
    let options = { timeOut: 2500 };
    this.toast.success('Se ha guardado correctamente', 'AppBares Dice:', options);
  }

  newOrder(tableNumber, products: Array<ProductsInUserOrder>) {
    this.tableService.getTableByNumber(tableNumber)
      .subscribe(
        table => {
          this.tableToSlice = table;
          let order = new Order();
          this.tableToSlice.status = TableStatus.OCUPADA;

          order.type = "Restaurant";
          order.table = this.tableToSlice.number;
          order.status = "Open";
          order.users = new Array<UsersInOrder>();
          order.users[0] = new UsersInOrder();
          //aca hay que setear el id del usuario admin. todavia no esta creado.
          order.users[0].username = Constants.BONAPP_WEB_USER;
          order.users[0].owner = true;
          order.users[0].products = new Array<ProductsInUserOrder>();
          order.users[0].products = [];
          order.app = false;
          this.orderService.saveOrder(order).subscribe(newCreatedOrder => {
            this.tableService.updateTable(this.tableToSlice).subscribe(
              table => {
                this.tableToSlice = table;
                let totalToConfirm = 0;
                products.forEach(product => {
                  totalToConfirm += product.price;
                });
                let data = { products: products, total: totalToConfirm, username: Constants.BONAPP_WEB_USER, order: newCreatedOrder };
                this.updateProductsOrder(data)
                let productToDelete = new ProductsInUserOrder();
                this.productsToSlice.forEach(product => {
                  
                  if(product.dailyMenuId){
                    this.dailyMenuService.getDailyMenu(product.dailyMenuId)
                      .subscribe(dailyMenu => {
                        productToDelete.dailyMenuId = dailyMenu._id;
                        productToDelete.name = dailyMenu.name;  
                      });
                  }else if(product.product){
                    this.productService.getProduct(product.product)
                      .subscribe(product => {
                        productToDelete.product = product._id;
                        productToDelete.name = product.name;
                      });
                  }
                  productToDelete.observations = '';
                  productToDelete.options = product.options;
                  productToDelete.price = product.price;
                  productToDelete.quantity = product.quantity;
                  productToDelete.size = product.size;
                  productToDelete._id = product._id

                  this.productToRemoveFromOrder = productToDelete;
                  this.deletedReason = "Mesa dividida.";
                  this.deleteProductFromOrder();
                });
              },
              error => {
                this.showModalError(this.serviceErrorTitle, error.error.message);
                return false;
              });
          },
            error => {
              this.showModalError(this.serviceErrorTitle, error.error.message);
              return false;
            }
          )
        },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
          return false;
        });
  }


  /**Metodo para filtrar los productos para la nueva version del MDB COMPLETER - Nacho - 19/10/19 */
  searchEntries(term: any) {
    return this.allProducts.filter((data: Product) => data.name.toLowerCase().includes(term.toLowerCase()));
  }

  /** Retorna los produtctos filtrados para la nueva version del MDB COMPLETER - Nacho - 19/10/19 */
  getFilteredData() {
    this.results = this.searchStr.pipe(
      startWith(''),
      map((value: string) => this.filter(value))
    );
    // this.searchEntries(this.searchStr);
  }

  // /** Ejecuta la busqueda cada vez que cambia el ngModel del MDB COMPLETER - Nacho - 19/10/19 */
  // onChange() {
  //   this.getFilteredData();
  // }

  /** Arma los combos de sizes y options y muestra la modal */
  showOptionsAndSizes(product: Product): void {
    this.productToFindSizesAndOptions = product;

    for (let size of this.productToFindSizesAndOptions.sizes) {
      if (size.default === true) {
        this.sizesSelect.push({ value: size._id, label: size.name, selected: true })
        this.sizeSelectedValue = size._id;
      }
      else {
        this.sizesSelect.push({ value: size._id, label: size.name })
      }
    };

    this.modalRef = this.modalService.show(this.optionsAndSizesTemplate, { backdrop: true, ignoreBackdropClick: true });
  }

  /** Agrega o quita la opcion seleccionada en la modal al array de opciones seleccionadas */
  onOptionSelectedChange(option: any) {
    let optionIndex = this.selectedOptions.indexOf(option);
    if (optionIndex !== -1) {
      this.selectedOptions.splice(optionIndex, 1);
    }
    else {
      this.selectedOptions.push(option);
    }
  }

  /**Verifica la variable para devolver el stock de un producto al eliminarlo de la orden */
  returnStock() {
    this.returnStockValue = !this.returnStockValue;
  }

  /** Agrega el producto a la preorder enviandole los sizes y las options */
  setProductOptionsAndSize(product) {
    this.addProductToPreOrder(product, 1, this.sizeSelectedValue, this.selectedOptions)
    this.closeModalOptionsAndSizes();
  }

  getClient(clientId){
    this.clientService.getClient(clientId)
      .subscribe(client => {
        this.client = client;
      })
  }

  closeModalOptionsAndSizes() {
    this.sizesSelect = [];
    this.sizeSelectedValue = null;
    this.selectedOptions = [];
    this.modalRef.hide();
    this.modalRef = null;
  }

  selectWaiter(value) {
    this.waiterSelected = value;
  }

  selectUser(value) {    
    this.userSelected = value;
    this.setProductsInOrder();
  }
}
