import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { ArqueoCaja } from '../../../shared/models/arqueo-caja';
import { ArqueoCajaService } from '../../../shared/services/arqueo-caja.service';
import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { PaymentType } from '../../../shared/models/payment-type';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';

import { StringsFunctions } from '../../../shared/functions/stringsFunctions';

@Component({
  selector: 'app-arqueo-caja-edit',
  templateUrl: './arqueo-caja-edit.component.html',
  styleUrls: ['./arqueo-caja-edit.component.scss']
})
export class ArqueoCajaEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  cashCountForm: FormGroup;
  public modalRef: BsModalRef;  
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: string;
  paymentTypes: PaymentType[];
  cashCount: ArqueoCaja;
  hasCashRegister = false;
  totalIngresos: number;
  totalsIngresosPaymentTypes: Array<any> = [];
  totalEgresos: number;
  totalsEgresosPaymentTypes: Array<any> = [];
  paymentTypesCashRegister: Array<any> = [];
  paymentAlreadyExist: Boolean = false;
  realAmountTotal: number;
  realAmounUpdate: Array<any> = [];
  paymentDetail: Array<any> = [];
  difference: number;
  estimatedAmount: number;

  get realAmount(): FormArray{
    return <FormArray>this.cashCountForm.get('realAmount');
  }

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _cashCountService: ArqueoCajaService,
              private _cashRegisterService: CashRegisterService,
              private _paymentTypeService: PaymentTypeService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.cashCountForm = this.formBuilder.group({   
      comment: '',
      realAmount: this.formBuilder.array([])
    });    

    this._route.data.subscribe(
      data => {
        this.totalIngresos = 0;
        this.totalEgresos = 0;
        this.realAmountTotal = 0;
        this.difference = 0;
        this.estimatedAmount = 0;
        this.paymentTypesCashRegister = [];
        this.paymentDetail = [];

        this.cashCount = data['arqueo'];
        this.paymentTypes = data['paymentTypes'];
        this.paymentTypes.map(paymentType => {
          if(paymentType.default === true)
          {
            this.paymentTypesCashRegister.push({ paymentTypeId: paymentType._id, paymentTypeName: paymentType.name, total: 0 });
          }
        })
        this._cashRegisterService.getCashRegister(this.cashCount.cashRegisterId).subscribe(
          cashRegister => {            
            this.cashCount.cashRegister = cashRegister.name;                                
          },
          error => {
            this.showModalError(this.serviceErrorTitle, <any>error);
          }
        );

        this.cashCount.ingresos.map(ingreso => {
          this.totalIngresos += ingreso.amount;
        })
    
        this.cashCount.egresos.map(egreso => {
          this.totalEgresos += egreso.amount;
        })

        this.cashCount.realAmount.map(cash => {      
          this.realAmountTotal += cash.amount;
        })
    
        this.paymentTypes.forEach((paymentType) => {
          this.totalsIngresosPaymentTypes.push({ paymentTypeId: paymentType._id, paymentTypeName: paymentType.name, total: 0 })
          this.totalsEgresosPaymentTypes.push({ paymentTypeId: paymentType._id, paymentTypeName: paymentType.name, total: 0 })
        })
    
        this.cashCount.ingresos.forEach((ingreso) => {      
          for(let i = 0; i < this.totalsIngresosPaymentTypes.length; i++) {
            if(ingreso.paymentType.toString() === this.totalsIngresosPaymentTypes[i].paymentTypeId){
              this.totalsIngresosPaymentTypes[i].total += ingreso.amount;
              break;
            }
          }
        })
    
        this.cashCount.egresos.forEach((egreso) => {      
          for(let i = 0; i < this.totalsEgresosPaymentTypes.length; i++) {
            if(egreso.paymentType.toString() === this.totalsEgresosPaymentTypes[i].paymentTypeId){
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
    
        this.totalsIngresosPaymentTypes.forEach((ingreso) => {
          if(ingreso.total > 0){
            this.paymentAlreadyExist = false;
            this.paymentTypesCashRegister.forEach((paymentType) => {
              if(ingreso.paymentTypeId === paymentType.paymentTypeId){
                this.paymentAlreadyExist = true;                      
              }
            })
    
            if(!this.paymentAlreadyExist){
              this.paymentTypesCashRegister.push(ingreso);
            }
          }
        })        
    
        this.totalsEgresosPaymentTypes.forEach((egreso) => {
          if(egreso.total > 0){
            this.paymentAlreadyExist = false;
            this.paymentTypesCashRegister.forEach((paymentType) => {              
              if(egreso.paymentTypeId === paymentType.paymentTypeId){
                this.paymentAlreadyExist = true;                      
              }
            })
    
            if(!this.paymentAlreadyExist){
              this.paymentTypesCashRegister.push(egreso);
            }
          }
        })        
        
        this.estimatedAmount = this.cashCount.initialAmount + this.totalIngresos - this.totalEgresos;
        this.difference = this.realAmountTotal - this.estimatedAmount;

        if(this.cashCount.closedAt !== undefined)
        {
          this.cashCount.realAmount.map((realAmount) => {
            this._paymentTypeService.getPaymentType(realAmount.paymentType).subscribe(
              paymentType => {
                this.paymentDetail.push({ paymentTypeName: paymentType.name, paymentAmount: realAmount.amount });
              },
              error => {
                this.showModalError(this.serviceErrorTitle, <any>error);
              }
            )
          })
        }                   
    
        const typesOfPayments = this.paymentTypesCashRegister.map(paymentType => this.formBuilder.group({
          paymentTypeId: [paymentType.paymentTypeId],
          paymentTypeName: [paymentType.paymentTypeName],
          amount: ['', Validators.required]
        }));
        const typesOfPaymentsArray = this.formBuilder.array(typesOfPayments);
        this.cashCountForm.setControl('realAmount', typesOfPaymentsArray); 

        this.cashCountForm.patchValue({
          comment: this.cashCount.comment
        });
      }
    )            
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
        cashCount => { this.cashCount = cashCount,
                      this.onBack()},
        error => { 
          this.showModalError(this.serviceErrorTitle, <any>error);
        });
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  onBack(): void {
    this._router.navigate(['/sales/cash-counts', { outlets: { edit: ['selectItem'] } }]);
  }

  validateCashRegister(value) {   
    if (value === 'default') {
      this.hasCashRegister = true;
    } else {
      this.hasCashRegister = false;
    }
  }

  changeAmount() {
    if(this.cashCount.closedAt === undefined)
    {
      this.realAmountTotal = 0;
      this.realAmount.value.map((x) => {
        this.realAmountTotal += x.amount;
        console.log(this.realAmountTotal)
      })
      console.log(this.realAmountTotal)
      this.difference = this.realAmountTotal - this.estimatedAmount;
      console.log(this.difference)
    }
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;
  }

  showModalCancel(template: TemplateRef<any>){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }

}
