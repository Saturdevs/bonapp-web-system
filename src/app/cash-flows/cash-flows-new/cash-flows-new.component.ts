import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { CashFlow } from '../../../shared/models/cash-flow';
import { CashFlowService } from '../../../shared/services/cash-flow.service';
import { CashRegister } from '../../../shared/models/cash-register';
import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { PaymentType } from '../../../shared/models/payment-type';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';
import { ArqueoCaja } from '../../../shared/models/arqueo-caja';
import { ArqueoCajaService } from '../../../shared/services/arqueo-caja.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-cash-flows-new',
  templateUrl: './cash-flows-new.component.html',
  styleUrls: ['./cash-flows-new.component.scss']
})
export class CashFlowsNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  paymentTypes: PaymentType[];
  cashRegisters: CashRegister[];
  newCashFlow: CashFlow;
  errorMessage: string;
  pageTitle: String = 'Nuevo Movimiento';
  hasCashRegister = true;
  showMessageCashRegister = false;
  hasPaymentType = true;
  showMessagePaymentType = false;
  hasType = true;
  showMessageType = false;
  typesArray: Array<string> = new Array("Ingreso", "Egreso");
  cashCount: ArqueoCaja;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _cashFlowService: CashFlowService,
              private _cashCountService: ArqueoCajaService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.newCashFlow = new CashFlow();
    this.newCashFlow.cashRegisterId = "default";
    this.newCashFlow.type = "default";
    this.newCashFlow.paymentType = "default";
    
    this._route.data.subscribe(
      data => {
        this.cashRegisters = data['cashRegisters']
      }
    )

    this._route.data.subscribe(
      data => {
        this.paymentTypes = data['paymentTypes']
      }
    )

  }

  saveCashFlowIntoCashCount(cashFlow: CashFlow) {
    this._cashCountService.getArqueoOpenByCashRegister(cashFlow.cashRegisterId).subscribe(
      cashCount => {
        if(!isNullOrUndefined(cashCount)){
          if(cashFlow.type === "Ingreso"){
            if(isNullOrUndefined(cashCount.ingresos)){
              cashCount.ingresos = new Array();              
            }
              
            cashCount.ingresos.push({ paymentType: cashFlow.paymentType, desc: "Movimiento de Caja", amount: cashFlow.totalAmount })            
          } 
          else if(cashFlow.type === "Egreso"){
            if(isNullOrUndefined(cashCount.egresos)){
              cashCount.egresos = new Array();              
            }

            cashCount.egresos.push({ paymentType: cashFlow.paymentType, desc: "Movimiento de Caja", amount: cashFlow.totalAmount })
          }

          this._cashCountService.updateArqueo(cashCount).subscribe(
            cashCount => {
              this.cashCount = cashCount;
              this.onBack();
            },
            error => {
              this.errorMessage = <any>error;
              this.showModalError(this.errorTemplate);
            }
          )
        }        
      },
      error => {
        this.errorMessage = <any>error;
      }
    )
  }

  saveCashFlow(){
    this._cashFlowService.saveCashFlow(this.newCashFlow).subscribe(
      cashFlow =>{ this.newCashFlow = cashFlow,
                   this.saveCashFlowIntoCashCount(this.newCashFlow);
                   this.onBack()},
      error => { this.errorMessage = <any>error,
                     this.showModalError(this.errorTemplate)});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  showModalError(errorTemplate: TemplateRef<any>){
    this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
  }

  onBack(): void {
    this._router.navigate(['/sales/cash-flows', { outlets: { edit: ['selectItem'] } }]);
  }

  validateCashRegister(value) {   
    if (value === 'default') {
      this.hasCashRegister = true;
      this.showMessageCashRegister = true;
    } else {
      this.hasCashRegister = false;
      this.showMessageCashRegister = false;
    }
  }

  validatePaymentType(value) { 
    if (value === 'default') {
      this.hasPaymentType = true;
      this.showMessagePaymentType = true;
    } else {
      this.hasPaymentType = false;
      this.showMessagePaymentType = false;
    }
  }

  validateType(value) {   
    if (value === 'default') {
      this.hasType = true;
      this.showMessageType = true;
    } else {
      this.hasType = false;
      this.showMessageType = false;
    }
  }

}
