import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { 
  Order,
  PaymentType,
  CashRegister,
  CashRegisterService,
  PaymentTypeService,
  PaymentInUserOrder,
  OrderDiscount,
  UsersInOrder
} from '../../../shared';
import { isNullOrUndefined } from 'util';

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

  constructor(private cashRegisterService: CashRegisterService,
              private paymentTypesService: PaymentTypeService
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
  /**User owner del pedido actual */
  usrOwner: UsersInOrder;
  /**Vuelto según el monto pagado */
  changeAmount: number;
  /**Monto total pagado hasta el momento */
  partialPaidAmount: number;

  ngOnInit() {
    console.log(this.order)
    this.usrOwner = this.order.users.find(usr => usr.owner === true);
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
    this.calculatePartialPaidAmount();
    if (isNullOrUndefined(this.usrOwner.payments) || this.usrOwner.payments.length === 0)
    {
      this.addPayment(); 
    }
    else
    {
      this.calculateTotalSum();
    }
    this.showDiscount = false;  
    this.calculateChangeAmount();    
  }

  closeForm(): void {    
    this.close.emit('');    
  }

  getSelectedCashRegister(event: any): void {
    console.log(event)
  }

  addPayment(): void {
    let payment = new PaymentInUserOrder(); 
    this.calculateTotalSum();   
    payment.methodId = this.paymentTypes.find(pt => pt.default === true)._id;
    payment.amount = this.order.totalPrice - this.totalSum;
    //Si se realiza el pago de un pedido que se hizo por la app se asigna todo el pago al usuario owner
    this.usrOwner.payments.push(payment);
    this.calculateChangeAmount();
  }

  removePayment(paymentToRemove:PaymentInUserOrder):void {
    if (this.order.users.length === 1 && this.order.users[0].payments.length === 1)
    {
      this.order.users[0].payments = [];
    }
    else
    {
      let indexOfPayment = 0;
      for (let i=0; i < this.order.users.length && indexOfPayment !== -1; i++) {
        indexOfPayment = this.order.users[i].payments.indexOf(paymentToRemove);
        this.order.users[i].payments.splice(indexOfPayment, 1);
      }
    }
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
      
      this.calculateChangeAmount();
    }
  }

  calculateTotalSum(): void {
    this.totalSum = 0;
    this.order.users.forEach(user => {
      user.payments.forEach(payment => {
        this.totalSum += payment.amount;
      })
    })
  }

  calculatePartialPaidAmount():void {
    this.partialPaidAmount = 0;
    this.order.users.forEach(user => {
      user.payments.forEach(payment => {
        this.partialPaidAmount += payment.amount;
      })
    })
  }

  calculateChangeAmount():void {
    console.log(this.totalSum)
    console.log(this.order.totalPrice)
    this.calculateTotalSum();
    this.changeAmount = this.totalSum + this.partialPaidAmount - this.order.totalPrice;
  }

  selectText(component):void {
    component.select();
  }

  public removeDiscount(): void {
    this.order.totalPrice = this.order.discount.subtotal;
    this.order.discount = null;
  }

  changeAmountDiscount(): void {
    this.calculateChangeAmount();
  }

}
