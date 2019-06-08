import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { 
  Order,
  PaymentType,
  CashRegister,
  PaymentInUserOrder,
  OrderDiscount,
  UsersInOrder,
  ProductsInUserOrder,
  Table,
  TableService,
  OrderService,
  ArqueoCajaService
} from '../../../shared';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-order-close',
  templateUrl: './order-close.component.html',
  styleUrls: ['./order-close.component.scss']
})
export class OrderCloseComponent implements OnInit {

  @Input() order: Order;
  @Input() cashRegisters: Array<CashRegister> = [];
  @Input() paymentTypes: Array<PaymentType> = [];
  @Output() close = new EventEmitter<string>();

  constructor(private _router: Router,
              private modalService: BsModalService,
              private tableService: TableService,
              private orderService: OrderService,
              private arqueoCajaService: ArqueoCajaService
            ) { }

  private title: String = "CERRAR MESA ";
  private aditionsTitle: String = "ADICIONES";
  private paymentsTitle: String = "PAGOS";
  private cashRegisterLabel: String = "Caja Registradora";
  private closeTableButton: String = "Cerrar Mesa";
  private cancelButton: String = "Cancelar";
  private changeLabel: String = "Vuelto";
  private discountRateLabel: String = "Descuento";
  private partialPaidAmountLabel: String = "Total pagado hasta el momento:"
  private closeOrderWithoutAditions: String = "La mesa no contiene adiciones.";
  private confirmButtonLabel: String = "Confirmar";
  private cancelButtonLabel: String = "Cancelar";
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private cashRegistersSelect: Array<any> = [];
  private selectedCashRegister: string = '';
  private paymentTypesSelect: Array<any> = [];
  private selectedPaymentType: string = '';
  private totalSum: number;
  /**Booleano para determinar si mostrar la sección de descuento o no. */
  showDiscount: Boolean;
  /**Porcentaje de descuento. */
  discountRate: number;
  /**Monto de descuento. */
  discountAmount: number;
  /**Vuelto según el monto pagado */
  changeAmount: number;
  /**Monto total pagado hasta el momento */
  partialPaidAmount: number;
  /**Pagos realizados a traves del mostrador */
  payments: Array<PaymentInUserOrder> = [];
  /**Descuento para el pago */
  discount: OrderDiscount;
  /**Monto total del pedido */
  totalPrice: number;
  /**Productos del pedido */
  productsInOrder: Array<ProductsInUserOrder> = [];

  ngOnInit() {
    this.payments = [];
    this.productsInOrder = [];
    this.discount = null;
    this.totalPrice = this.order.totalPrice;
    
    for (let cashRegister of this.cashRegisters) {
      if (cashRegister.available === true) {
        this.cashRegistersSelect.push({value: cashRegister._id, label: cashRegister.name})
      }
    };
    this.selectedCashRegister = this.cashRegisters.find(cr => cr.default === true)._id;

    for (let paymentType of this.paymentTypes) {
      if (paymentType.available === true) {
        this.paymentTypesSelect.push({value: paymentType._id, label: paymentType.name, default: paymentType.default})
      }
    };   
    
    this.order.users.forEach(usr => {
      usr.products.forEach(prod => {
        this.productsInOrder.push(prod);
      })
    });

    if (this.productsInOrder.length > 0)
    {
      this.calculatePartialPaidAmount();
      this.addPayment(); 
    }
    
    this.showDiscount = false;  
    this.calculateChangeAmount();    
  }

  closeForm(): void {    
    this.close.emit('');    
  }

  /**Agrega un tipo de pago al array de pagos */
  addPayment(): void {
    let payment = new PaymentInUserOrder(); 
    let amount: number;
    this.calculateTotalSum();   
    payment.methodId = this.paymentTypes.find(pt => pt.default === true)._id;
    amount = this.order.totalPrice - (this.totalSum + this.partialPaidAmount);
    payment.amount = amount >= 0 ? amount : 0;
    //Si se realiza el pago de un pedido que se hizo por la app se asigna todo el pago al usuario owner
    this.payments.push(payment);
    this.calculateChangeAmount();
  }

  /**Elimina el pago dado como parámetro del array de pagos
   * @param paymentToRemove parámetro a eliminar del array de pagos.
   */
  removePayment(paymentToRemove:PaymentInUserOrder):void {
    if (this.payments.length === 1)
    {
      this.payments = [];
    }
    else
    {
      let indexOfPayment = this.payments.indexOf(paymentToRemove);
      this.payments.splice(indexOfPayment, 1);
    }

    this.calculateChangeAmount();
  }

  /**Muestra o esconde la sección de descuento
   * @param show si es true se muestra la sección para ingresar un descuento. si es false no se muestra
   */
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

  /**Crea el descuento que se va a dar al pedido */
  addDiscount():void {
    this.showDiscountSection(false);  
    if (isNullOrUndefined(this.discount))
    {
      this.discount = new OrderDiscount();
      this.discount.discountAmount = this.discountAmount;  
      this.discount.discountRate = this.discountRate;
      this.discount.subtotal = this.totalPrice;
      this.totalPrice = this.discount.subtotal - this.discount.discountAmount; 
      
      this.calculateChangeAmount();
    }
  }

  /**Calcula la suma de monto total pagado hasta el momento más los pagos a realizar que se ingresaron en el sistema */
  calculateTotalSum(): void {
    this.totalSum = this.partialPaidAmount;
    this.payments.forEach(payment => {
      this.totalSum += payment.amount;
    })
  }

  /**Calcula el monto parcial pagado por los usuarios hasta el momento */
  calculatePartialPaidAmount():void {
    this.partialPaidAmount = 0;
    this.order.users.forEach(user => {
      user.payments.forEach(payment => {
        this.partialPaidAmount += payment.amount;
      })
    })
  }

  /**Calcula el monto del vuelto teniendo en cuenta lo pagado hasta el momento mas los pagos a realizar ingresados en el sistema */
  calculateChangeAmount():void {
    this.calculateTotalSum();
    this.changeAmount = this.totalSum + this.partialPaidAmount - this.totalPrice;
  }

  selectText(component):void {
    component.select();
  }

  /**Elimina el descuento ingresado para el pedido */
  removeDiscount(): void {
    this.totalPrice = this.discount.subtotal;
    this.discount = null;
    this.calculateChangeAmount();
  }

  changeAmountDiscount(): void {
    this.calculateChangeAmount();
  }

  /**Cierra la mesa y el pedido actual */
  closeTable(): void {
    let usrOwner = new UsersInOrder();
    let table = new Table();
    table.number = this.order.table;
    table.status = "Libre";

    this.order.cashRegister = this.cashRegisters.find(cr => cr._id === this.selectedCashRegister);
    this.order.status = "Closed";
    this.order.completed_at = new Date();
    this.order.discount = this.discount;
    this.order.totalPrice = this.totalPrice;

    usrOwner = this.order.users.find(usr => usr.owner === true);

    if (!isNullOrUndefined(this.payments) && this.payments.length > 0)
    {
      this.payments.forEach(payment => {
        usrOwner.payments.push(payment);
      })    
    }

    this.tableService.updateTableByNumber(table).subscribe(
      tableReturned => {
        if (tableReturned.status === "Libre")
        {
          let ord = this.orderService.transformOrderFromBusinessToDb(this.order);
          this.orderService.updateOrder(ord).subscribe(
            orderReturned => {
              let order = this.orderService.transformOrderFromDbToBusiness(orderReturned);
              this.addOrderToArqueo(orderReturned);
              this.closeForm();
              this._router.navigate(['./orders']);
            },
            error => {
              this.showModalError(this.serviceErrorTitle, <any>error);
            }
          )
        }
      },
      error => {
        this.showModalError(this.serviceErrorTitle, <any>error);
      }
    )
  }

  /**Agrega el pedido enviado como parámetro al arqueo abierto para la caja registradora donde se realiza el pago
   * @param order pedido para agregar al arqueo
   */
  addOrderToArqueo(order: Order): void{
    this.arqueoCajaService.getArqueoOpenByCashRegister(order.cashRegister).subscribe(
      cashCount => {
        if(!isNullOrUndefined(cashCount)) {
          if(isNullOrUndefined(cashCount.ingresos)) {
            cashCount.ingresos = new Array();
          }

          /*Si hay un solo pago en el arqueo se guarda el monto total del pedido y no el monto del pago. Esto es  
            porque puede haber una diferencia entre los dos que sería el vuelto */
          if (order.users.length === 1 && order.users[0].payments.length === 1) {
            let payment = order.users[0].payments[0];
            cashCount.ingresos.push({ paymentType: payment.methodId, desc: "Ventas", amount: order.totalPrice });
          }
          else {
            let paymentsSum = 0;

            for (let i = 0; i < order.users.length; i++) {
              for (let j = 0; j < order.users[i].payments.length; j++) {
                let payment = order.users[i].payments[j];                

                /*Si es el último pago insertado en el array de pagos del último usuario el monto del arqueo es igual
                  a la diferencia entre el monto total del pedido y la suma de pagos de los demas usuarios realizadas 
                  hasta el momento. No es el monto del pago porque la suma puede ser mayo al monto total del pedido
                  y habría que dar vuelto */
                if (i === order.users.length-1 && j === order.users[i].payments.length-1) {
                  cashCount.ingresos.push({ paymentType: payment.methodId, desc: "Ventas", amount: order.totalPrice - paymentsSum })
                }
                else {
                  paymentsSum += payment.amount;
                  cashCount.ingresos.push({ paymentType: payment.methodId, desc: "Ventas", amount: payment.amount })
                }
              }
            }
          } 
          
          this.arqueoCajaService.updateArqueo(cashCount).subscribe(
            cashCount => {},
            error => {
              this.showModalError(this.serviceErrorTitle, <any>error);
            }
          )
        }                
      },
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

}
