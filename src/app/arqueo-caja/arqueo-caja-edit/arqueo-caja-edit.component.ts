import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { 
  ArqueoCaja,
  PaymentType,
  ArqueoCajaService
} from '../../../shared/index';

import { StringsFunctions } from '../../../shared/functions/stringsFunctions';

@Component({
  selector: 'app-arqueo-caja-edit',
  templateUrl: './arqueo-caja-edit.component.html',
  styleUrls: ['./arqueo-caja-edit.component.scss']
})
export class ArqueoCajaEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  private pageTitle: String = 'Editando';
  private saveButton: String = 'Finalizar Arqueo';
  private cancelButton: String = 'Cancel';
  cashCountForm: FormGroup;
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: string;
  /**Todos los tipos de pagos almacenados en la base de datos */
  paymentTypes: PaymentType[];
  /**Arqueo de caja a editar */
  cashCount: ArqueoCaja;
  /**Total de ingresos en el arqueo */
  totalIngresos: number;
  /**Array para almacenar el total de ingresos según tipo de pago */
  totalsIngresosPaymentTypes: Array<any> = [];
  /**Total de egresos en el arqueo */
  totalEgresos: number;
  /**Array para almacenar el total de egresos según tipo de pago */
  totalsEgresosPaymentTypes: Array<any> = [];
  /**Tipos de pagos que existen en los ingresos y egresos del arqueo  */
  existingPaymentTypesCashCount: Array<any> = [];
  /**Variable para checkear si el tipo de pago ya fue agregado al array */
  paymentAlreadyExist: Boolean = false;
  /**Monto real para el arqueo sin tener en cuenta el tipo de pago */
  realAmountTotal: number;
  realAmounUpdate: Array<any> = [];
  /**Detalle de los tipos de pagos del arqueo. Nombre y monto para cada tipo de pago */
  paymentDetail: Array<any> = [];
  /**Diferencia calculada entre el monto real del arqueo y el monto estimado */
  difference: number;
  /**Monto estimado para el arqueo */
  estimatedAmount: number;

  get realAmount(): FormArray {
    return <FormArray>this.cashCountForm.get('realAmount');
  }

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _cashCountService: ArqueoCajaService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.cashCount = new ArqueoCaja();
    this.cashCountForm = this.formBuilder.group({
      comment: '',
      realAmount: this.formBuilder.array([])
    });

    this._route.data.subscribe(
      data => {
        this.difference = 0;
        this.estimatedAmount = 0;                
        this.totalsIngresosPaymentTypes = [];
        this.totalsEgresosPaymentTypes = [];
        this.cashCount = data['arqueo'];
        this.paymentTypes = data['paymentTypes'];        

        this.calculateTotalIngresos();
        this.calculateTotalEgresos();
        this.calculateTotalRealAmount();
        this.createArraysToStoreTotals();
        this.buildTotalsPaymentTypes();  
        this.buildExistingPaymentTypes();                      
        this.buildPaymentTypesDetail();   
        this.buildRealAmountControl();   

        this.estimatedAmount = this.cashCount.initialAmount + this.totalIngresos - this.totalEgresos;
        this.difference = this.realAmountTotal - this.estimatedAmount;   
        this.setComment();        
      }
    )
  }

  /**Calcula el total de los ingresos del arqueo independientemente del tipo de pago */
  calculateTotalIngresos() {
    this.totalIngresos = 0;
    this.cashCount.ingresos.map(ingreso => {
      this.totalIngresos += ingreso.amount;
    })
  }

  /**Calcula el total de los egresos del arqueo independientemente del tipo de pago */
  calculateTotalEgresos() {
    this.totalEgresos = 0;
    this.cashCount.egresos.map(egreso => {
      this.totalEgresos += egreso.amount;
    })
  }

  /**Calcula el monto total real del arqueo independientemente del tipo de pago */
  calculateTotalRealAmount() {
    this.realAmountTotal = 0;
    this.cashCount.realAmount.map(cash => {
      this.realAmountTotal += cash.amount;
    })
  }

  /**Crea los arrays para almacenar el total de los ingresos y egresos segun los tipos de pagos */
  createArraysToStoreTotals() {
    this.paymentTypes.forEach((paymentType) => {
      this.totalsIngresosPaymentTypes.push({ paymentTypeId: paymentType._id, paymentTypeName: paymentType.name, total: 0 })
      this.totalsEgresosPaymentTypes.push({ paymentTypeId: paymentType._id, paymentTypeName: paymentType.name, total: 0 })
    })
  }

  /**Calcula el total de ingresos y egresos según el tipo de pago y los guarda en arrays separados. Uno para
   * ingresos y otro para egresos
   */
  buildTotalsPaymentTypes() {
    this.cashCount.ingresos.forEach((ingreso) => {
      for (let i = 0; i < this.totalsIngresosPaymentTypes.length; i++) {
        if (ingreso.paymentType.toString() === this.totalsIngresosPaymentTypes[i].paymentTypeId) {
          this.totalsIngresosPaymentTypes[i].total += ingreso.amount;
          break;
        }
      }
    })

    this.cashCount.egresos.forEach((egreso) => {
      for (let i = 0; i < this.totalsEgresosPaymentTypes.length; i++) {
        if (egreso.paymentType.toString() === this.totalsEgresosPaymentTypes[i].paymentTypeId) {
          this.totalsEgresosPaymentTypes[i].total += egreso.amount;
          break;
        }
      }
    })

    this.totalsIngresosPaymentTypes.sort((a, b) => {
      return StringsFunctions.compareStrings(a.paymentTypeName, b.paymentTypeName);
    })

    this.totalsEgresosPaymentTypes.sort((a, b) => {
      return StringsFunctions.compareStrings(a.paymentTypeName, b.paymentTypeName);
    })
  }

  /**Crea el array de tipos de pagos que existen en los ingresos y egresos del arqueo.
   * Son los tipos de pagos para los que se va a ingresar el monto que se tiene en caja.
   */
  buildExistingPaymentTypes() {
    this.existingPaymentTypesCashCount = [];
    /**El tipo de pago por defecto siempre debe estar en el array de los tipos de pagos disponibles */
    this.paymentTypes.map(paymentType => {
      if (paymentType.default === true) {
        this.existingPaymentTypesCashCount.push({ paymentTypeId: paymentType._id, paymentTypeName: paymentType.name, total: 0 });
      }
    })

    this.totalsIngresosPaymentTypes.forEach((ingreso) => {
      if (ingreso.total > 0) {
        this.paymentAlreadyExist = false;
        this.existingPaymentTypesCashCount.forEach((paymentType) => {
          if (ingreso.paymentTypeId === paymentType.paymentTypeId) {
            this.paymentAlreadyExist = true;
          }
        })

        if (!this.paymentAlreadyExist) {
          this.existingPaymentTypesCashCount.push(ingreso);
        }
      }
    })

    this.totalsEgresosPaymentTypes.forEach((egreso) => {
      if (egreso.total > 0) {
        this.paymentAlreadyExist = false;
        this.existingPaymentTypesCashCount.forEach((paymentType) => {
          if (egreso.paymentTypeId === paymentType.paymentTypeId) {
            this.paymentAlreadyExist = true;
          }
        })

        if (!this.paymentAlreadyExist) {
          this.existingPaymentTypesCashCount.push(egreso);
        }
      }
    })
  }

  /**Crea el array con el monto y el nombre del tipo de pago cuando el arqueo esta cerrado */
  buildPaymentTypesDetail() {
    this.paymentDetail = [];
    if (this.cashCount.closedAt !== undefined) {
      this.cashCount.realAmount.map((realAmount) => {
        let paymentType = this.paymentTypes.find(pt => pt._id === realAmount.paymentType);
        this.paymentDetail.push({ paymentTypeName: paymentType.name, paymentAmount: realAmount.amount });
      })
    }
  }

  /**Setea el form control realAmount de acuerdo a los tipos de pagos que existen en el arqueo. */
  buildRealAmountControl() {
    const typesOfPayments = this.existingPaymentTypesCashCount.map(paymentType => this.formBuilder.group({
      paymentTypeId: [paymentType.paymentTypeId],
      paymentTypeName: [paymentType.paymentTypeName],
      amount: ['', Validators.required]
    }));
    const typesOfPaymentsArray = this.formBuilder.array(typesOfPayments);
    this.cashCountForm.setControl('realAmount', typesOfPaymentsArray);    
  }

  /**Actualiza el control donde se muestra el comentario */
  setComment() {
    this.cashCountForm.patchValue({
      comment: this.cashCount.comment
    });
  }

  updateCashCount() {
    this.cashCount.closedAt = new Date();
    this.cashCountForm.value.realAmount.forEach((realAmount) => {
      let ra = { paymentType: realAmount.paymentTypeId, amount: realAmount.amount };
      this.realAmounUpdate.push(ra);
    });
    this.cashCount.realAmount = this.realAmounUpdate;
    this.cashCount.comment = this.cashCountForm.value.comment;
    this._cashCountService.updateArqueo(this.cashCount).subscribe(
      cashCount => {
        this.cashCount = cashCount,
          this.onBack()
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
  }

  changeAmount() {
    if (this.cashCount.closedAt === undefined) {
      this.realAmountTotal = 0;
      this.realAmount.value.map((x) => {
        this.realAmountTotal += x.amount;
      })
      this.difference = this.realAmountTotal - this.estimatedAmount;
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalCancel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  onBack(): void {
    this._router.navigate(['/sales/cash-counts', { outlets: { edit: ['selectItem'] } }]);
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

}
