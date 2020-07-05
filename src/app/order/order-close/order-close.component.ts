import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
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
  ArqueoCajaService,
  TableStatus,
  ClientService,
  Client,
  TransactionService,
  Transaction,
  CashRegisterMin,
  PaymentTypeMin,
  OrderStatus,
  ProductPaymentStatus,
  UtilFunctions
} from '../../../shared';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
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
  @Input() client: Client;
  @Output() close = new EventEmitter<string>();
  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;

  constructor(private _router: Router,
    private modalService: BsModalService,
    private tableService: TableService,
    private orderService: OrderService,
    private arqueoCajaService: ArqueoCajaService,
    private clientService: ClientService,
    private transactionService: TransactionService
  ) { }

  title: String = "Cerrar Mesa ";
  private aditionsTitle: String = "ADICIONES";
  private paymentsTitle: String = "PAGOS";
  private cashRegisterLabel: String = "Caja Registradora";
  closeTableButton: String = "Cerrar Mesa";
  cancelButton: String = "Cancelar";
  private changeLabel: String = "Vuelto";
  private discountRateLabel: String = "Descuento";
  private partialPaidAmountLabel: String = "Total pagado hasta el momento:"
  private closeOrderWithoutAditions: String = "La mesa no contiene adiciones.";
  private confirmButtonLabel: String = "Confirmar";
  cancelButtonLabel: String = "Cancelar";
  private payWithAccountError: String = "El monto a abonar con Cuenta Corriente sumado al saldo pendiente, supera el limite de gastos para esta cuenta."
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
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
  canPayWithAccount: boolean = true;

  ngOnInit() {
    this.payments = [];
    this.productsInOrder = [];
    this.discount = null;
    this.totalPrice = this.order.totalPrice;

    for (let cashRegister of this.cashRegisters) {
      if (cashRegister.available === true) {
        this.cashRegistersSelect.push({ value: cashRegister._id, label: cashRegister.name })
      }
    };
    this.selectedCashRegister = this.cashRegisters.find(cr => cr.default === true)._id;



    if (!isNullOrUndefined(this.client)) {
      for (let paymentType of this.paymentTypes) {
        if (paymentType.available === true) {
          if (paymentType.currentAccount && this.client.enabledTransactions) {
            this.paymentTypesSelect.push({ value: paymentType._id, label: paymentType.name, default: paymentType.default })
          } else if (!paymentType.currentAccount) {
            this.paymentTypesSelect.push({ value: paymentType._id, label: paymentType.name, default: paymentType.default })
          }
        }
      };
    }
    else {
      for (let paymentType of this.paymentTypes) {
        if (paymentType.available === true) {
          this.paymentTypesSelect.push({ value: paymentType._id, label: paymentType.name, default: paymentType.default })
        }
      };
    }

    this.order.users.forEach(usr => {
      usr.products.forEach(prod => {
        if (prod.paymentStatus !== ProductPaymentStatus.PAYED && prod.deleted === false) {
          const productInOrderIndex = this.productsInOrder.findIndex(p => UtilFunctions.compareProducts(p, prod));        
          if (productInOrderIndex !== -1) {
            this.productsInOrder[productInOrderIndex].quantity += prod.quantity;
          } else {
            this.productsInOrder.push(JSON.parse(JSON.stringify(prod)));
          }
        }
      })
    });

    if (this.productsInOrder.length > 0) {
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
    amount = this.order.totalPrice - this.totalSum;
    payment.amount = amount >= 0 ? amount : 0;
    //Si se realiza el pago de un pedido que se hizo por la app se asigna todo el pago al usuario owner
    this.payments.push(payment);
    this.calculateChangeAmount();
    this.checkAccount();
  }

  /**Elimina el pago dado como parámetro del array de pagos
   * @param paymentToRemove parámetro a eliminar del array de pagos.
   */
  removePayment(paymentToRemove: PaymentInUserOrder): void {
    if (this.payments.length === 1) {
      this.payments = [];
    }
    else {
      let indexOfPayment = this.payments.indexOf(paymentToRemove);
      this.payments.splice(indexOfPayment, 1);
    }

    this.calculateChangeAmount();
    this.checkAccount();
  }

  /**Muestra o esconde la sección de descuento
   * @param show si es true se muestra la sección para ingresar un descuento. si es false no se muestra
   */
  showDiscountSection(show: boolean): void {
    this.showDiscount = show;

    if (show === true) {
      this.discountAmount = 0;
      this.discountRate = 0;
    }
  }

  /**Calcula el porcentaje de descuento según el monto de descuento ingresado */
  calculateRate(): void {
    this.discountRate = (this.discountAmount * 100) / this.order.totalPrice;
  }

  /**Calcula el monto de descuento según el porcentaje de descuento ingresado */
  calculateAmount(): void {
    this.discountAmount = (this.discountRate / 100) * this.order.totalPrice;
  }

  /**Crea el descuento que se va a dar al pedido */
  addDiscount(): void {
    this.showDiscountSection(false);
    if (isNullOrUndefined(this.discount)) {
      this.discount = new OrderDiscount();
      this.discount.discountAmount = this.discountAmount;
      this.discount.discountRate = this.discountRate;
      this.discount.subtotal = this.totalPrice;
      this.totalPrice = this.discount.subtotal - this.discount.discountAmount;

      this.calculateChangeAmount();
      this.checkAccount()
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
  calculatePartialPaidAmount(): void {
    this.partialPaidAmount = 0;
    this.order.users.forEach(user => {
      user.payments.forEach(payment => {
        this.partialPaidAmount += payment.amount;
      })
    })
  }

  /**Calcula el monto del vuelto teniendo en cuenta lo pagado hasta el momento mas los pagos a realizar ingresados en el sistema */
  calculateChangeAmount(): void {
    this.calculateTotalSum();
    const change = this.totalSum - this.totalPrice
    this.changeAmount = change > 0 ? change : 0;
  }

  selectText(component): void {
    component.select();
  }

  /**Elimina el descuento ingresado para el pedido */
  removeDiscount(): void {
    this.totalPrice = this.discount.subtotal;
    this.discount = null;
    this.calculateChangeAmount();
    this.checkAccount()
  }

  changeAmountDiscount(): void {
    this.calculateChangeAmount();
    this.checkAccount()
  }

  /**Cierra la mesa y el pedido actual */
  closeTable(): void {
    let usrOwner = new UsersInOrder();
    let table = new Table();
    table.number = this.order.table;
    table.status = TableStatus.LIBRE;

    this.order.cashRegister = this.cashRegisters.find(cr => cr._id === this.selectedCashRegister);
    this.order.status = OrderStatus.CLOSED;
    this.order.completed_at = new Date();
    this.order.discount = this.discount;
    this.order.totalPrice = this.totalPrice;

    usrOwner = this.order.users.find(usr => usr.owner === true);

    if (!isNullOrUndefined(this.payments) && this.payments.length > 0) {
      this.payments.forEach(payment => {
        usrOwner.payments.push(payment);
      })
    }

    this.tableService.updateTableByNumber(table).subscribe(
      tableReturned => {
        if (tableReturned.status === TableStatus.LIBRE) {
          this.orderService.updateOrderPayments(this.order).subscribe(
            orderReturned => {
              let order = orderReturned;
              //TODO: Pasar al backend. Solo se hace cuando se cierra un pedido (metodo closeOrder) - Loren 05/07/20
              /* this.addOrderToArqueo(orderReturned);
              this.addAccountMovements(orderReturned); */
              this.closeForm();
              this._router.navigate(['./orders']);
            },
            error => {
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          )
        }
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    )
  }

  //TODO: Debe hacerse en el metodo closeOrder del backend. Loren - 05/07/20
  /**Agrega el pedido enviado como parámetro al arqueo abierto para la caja registradora donde se realiza el pago
   * @param order pedido para agregar al arqueo
   */
  addOrderToArqueo(order: Order): void {
    this.arqueoCajaService.getArqueoOpenByCashRegister(order.cashRegister._id).subscribe(
      cashCount => {
        if (!isNullOrUndefined(cashCount)) {
          if (isNullOrUndefined(cashCount.ingresos)) {
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
                if (i === order.users.length - 1 && j === order.users[i].payments.length - 1) {
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
            cashCount => { },
            error => {
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          )
        }
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    )
  }

  //TODO: Debe hacerse en el metodo closeOrder del backend. Loren - 05/07/20
  /**Agrega las transacciones de los pagos con cuenta corriente */
  addAccountMovements(order: Order){
    let currentCashRegister = this.cashRegisters.find(cr => cr._id === this.selectedCashRegister);
    let minCashRegister = new CashRegisterMin();
    minCashRegister._id = currentCashRegister._id;
    minCashRegister.name = currentCashRegister.name;
    order.users.forEach(user => {
      user.payments.forEach(payment => {
        let currentPayment = this.paymentTypes.find(x => x._id == payment.methodId);
        if(currentPayment.currentAccount){
          let minPayment = new PaymentTypeMin()
          minPayment._id = currentPayment._id;
          minPayment.name = currentPayment.name.toString();


          let transaction = new Transaction();
          transaction.amount = (payment.amount * -1);
          transaction.cashRegister = minCashRegister;
          transaction.client = this.client;
          transaction.comment = "New Order" + new Date().toDateString();
          transaction.date = new Date();
          transaction.deleted = false;
          transaction.paymentMethod = minPayment
          transaction.paymentType = currentPayment._id;

          this.transactionService.saveTransaction(transaction)
            .subscribe(result =>{
              console.log(result);
            });
        }
      })
    })
  }

  /**Verifica si el metodo de pago es CuentaCorriente y el saldo disponible */
  checkAccount() {
    for (let payment of this.payments) {
      let currentPayment = this.paymentTypes.find(x => x._id === payment.methodId);
      if (currentPayment.currentAccount && this.client.enabledTransactions) {
        this.canPayWithAccount = this.client.balance - payment.amount >= (this.client.limitCtaCte * -1);
        if (this.canPayWithAccount) {
          continue;
        }
        else {
          return;
        }
      }
      else{
        this.canPayWithAccount = true;
        continue;
      }
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

}
