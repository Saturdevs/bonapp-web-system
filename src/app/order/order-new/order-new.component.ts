import { Component, OnInit, TemplateRef, Output, EventEmitter, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

import { Order } from '../../../shared/models/order';
import { OrderService } from '../../../shared/services/order.service';

import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product';
import { TableService } from '../../../shared/services/table.service';
import { Table } from '../../../shared/models/table';
import { ModalDirective } from 'ng-mdb-pro/free';
import { ArqueoCajaService, CashRegisterService, CashRegister, ArqueoCaja, PaymentType, PaymentTypeService, MenuService, Menu, CategoryService, Category } from '../../../shared/index';

@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.scss']
})
export class OrderNewComponent implements OnInit {
  public modalRef: BsModalRef;
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
              private paymentTypesService : PaymentTypeService) { }

  pageTitle: String = 'Nuevo Pedido'; 
  tableNumber: number;
  products: Product[];
  errorMessage: string;
  filteredProducts: Product[];
  productsName: String[] = [];
  productsInOrder: Product[] = [];
  selectedProduct: String;
  tableActive : Table;
  newOrder: Order;
  orderQty: Array<any> = [];
  qtyProd: number = 1;
  ordersActive: Boolean;
  openOrder: Boolean = false;
  currentOrder : Order;
  maxOrderNumber : number;
  tableNum : number = parseInt(this._route.snapshot.params['idTable']);
  cashRegisters : CashRegister[] = [];
  currentCashRegister : CashRegister;
  openArqueo : ArqueoCaja;
  discountPercentage : number;
  orderTotalPrice : number;
  discountAmount : number;
  paymentsInCurrentOrder : Array<any> = [];
  availablePaymentTypes : PaymentType[] = [];
  menus : Menu[];
  categories : Category[];
  productsToAdd : Product[];
  currentTable: Table;

  @ViewChild('fluid') public fluid:ModalDirective;

  ngOnInit() {
    this.newOrder = new Order();
    this.getTableByNumber(this.tableNum);
    this.getProducts();
    this.getAllMenus();

    if(this.isOrdersActive()) {
			this.ordersActive = true;
		}
  }

  ngAfterViewInit() {
    this.fluid.show();
  }

  getProducts(): void {
    this.productService.getProductsWithCategory()
      .subscribe(products => {
        this.products = products.map(product => {
          if(product.available) {
            product.available = 'Si';
          } else {
            product.available = 'No';
          }
          //console.log(this.productsName);
          
          this.productsName.push(product.name);
          
         // console.log(this.products);
          return product;
        });
        this.filteredProducts = this.products;
        
      },
      error => this.errorMessage = <any>error);
  }

  selectProductByBox() : void{
    this.selectedProduct = 'Hamburguesa Especial';
    this.selectProduct();
  }

  selectProduct(): void {
    let currentProduct = this.products.find(x=> x.name == this.selectedProduct);
    
    if (this.productsInOrder.find(x=> x.code == currentProduct.code)){
       if (this.orderQty.find(x=> x.productCode == currentProduct.code)){
        this.orderQty.find(x=> x.productCode == currentProduct.code).qty += this.qtyProd
       }
       else
       {
        this.orderQty.push({
          productName : currentProduct.name,
          productCode : currentProduct.code,
          qty : this.qtyProd
        });
       }
    }
    else{
      this.productsInOrder.push(currentProduct);
      this.orderQty.push({
        productName : currentProduct.name,
        productCode : currentProduct.code,
        qty : this.qtyProd
      });
    }
  }

  addProductQty(code): void{
    let currentProduct = this.products.find(x=> x.code == code);

    if (this.orderQty.find(x=> x.productCode == currentProduct.code)){
      this.orderQty.find(x=> x.productCode == currentProduct.code).qty++
      }
    else
    {
      this.orderQty.push({
        productName : currentProduct.name,
        productCode : currentProduct.code,
        qty : 1
      })
    }    
  }


  decreaceProductQty(code): void{
    let currentProduct = this.products.find(x=> x.code == code);

    if (this.orderQty.find(x=> x.productCode == currentProduct.code)){
      if(this.orderQty.find(x=> x.productCode == currentProduct.code).qty > 1){
          this.orderQty.find(x=> x.productCode == currentProduct.code).qty--
      }
      else {
        this.orderQty.splice(this.orderQty.indexOf(currentProduct),1)
      } 
    }
    else
    {
      this.orderQty.push({
        productName : currentProduct.name,
        productCode : currentProduct.code,
        qty : 1
      })
    }    
  }

  checkQty(product) : void{
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

  isOrdersActive() {
    //console.log('orders active')
		return this._router.isActive('/orders/section/tables/' + this._route.snapshot.params['id'], true);
	}

  // closeModal(){
  //   this.fluid.hide();
  //   this._router.navigate(['/orders/section/tables/' + this._route.parent.snapshot.params['id']])
  // }

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
                this.maxOrderNumber = parseInt(order.orderNumber);
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

  getTableByNumber(tableNumber){ //ACA TENGO QUE VALIDAR SI VINO LA MESA POR PARAMETRO. NO DESPUES
    this.tableService.getTableByNumber(tableNumber)
       .subscribe(table => {
         this.currentTable = table;
         this.findOrders(this.currentTable);
    },
    error => { this.errorMessage = <any>error['message'];});
  }

  // savePreOrder(){
  //   // let newOrder = new Order();
  //   // newOrder.open = true;
  //   // newOrder.cancel = false;
  //   // newOrder.completed_at = null;
  //   // newOrder.created_at = new Date().toLocaleDateString();
  //   // newOrder.products = [];
  //   // newOrder.table = this.tableNumber;
  //   // newOrder.totalPrice = 0;

  //  // this.orderService.saveOrder(this.newOrder);

  //   this.openOrder = true;
    
  // }

  getAllMenus(){
    this.menuService.getAll()
      .subscribe(menus => {
        this.menus = menus;
    },
    error => { this.errorMessage = <any>error['message'];});
  }

  getCategories(menuId){
      this.categoryService.getCategoriesByMenu(menuId)
        .subscribe(categories => {
          this.categories = categories;
        },
        error => { this.errorMessage = <any>error['message'];});
  }

  getProductsToAdd(categoryId){
    this.productService.getProductsByCategory(categoryId)
      .subscribe(products => {
        this.productsToAdd = products;
        console.log(this.productsToAdd);
      },
      error => { this.errorMessage = <any>error['message'];}
    );
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
    this.currentOrder.orderNumber = (this.maxOrderNumber + 1).toString();
    this.currentOrder.type = 'Mostrador';
    this.currentOrder.waiter = 'asdjkfaljdsfa';
    this.currentOrder.table = this.currentTable.number;
    this.currentOrder.orderApp = false;
   // newOrder.users = ;
   // this.orderService.saveOrder(this.newOrder);

  //  this.openOrder = true;
    this.orderService.saveOrder(this.currentOrder);
    this._router.navigate(['./orders/section/tables/5a63ccdbb3f3d70c3837e49a']);
  }

  calculatePercentage(){
    this.discountPercentage = (this.discountAmount * 100) / this.currentOrder.subtotal; 
  }

  calculateAmount(){
    this.discountAmount = (this.discountPercentage / 100) * this.currentOrder.subtotal;
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

  closeTable(template){
			this.modalRef = this.modalService.show(template, {backdrop: true});
	}
  closeModal(){
        this.modalRef.hide();
        this.modalRef = null;
        return true;        
	}


  }
