import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { CashFlow } from '../../../shared/models/cash-flow';
import { CashFlowService } from '../../../shared/services/cash-flow.service';
import { CashRegister } from '../../../shared/models/cash-register';
import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { PaymentType } from '../../../shared/models/payment-type';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';

@Component({
  selector: 'app-cash-flows-edit',
  templateUrl: './cash-flows-edit.component.html',
  styleUrls: ['./cash-flows-edit.component.scss']
})
export class CashFlowsEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  paymentTypes: PaymentType[];
  cashRegisters: CashRegister[];
  cashFlow: CashFlow;
  typesArray: Array<string> = new Array("Ingreso", "Egreso");
  paymentTypeName: String;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _cashFlowService: CashFlowService,
              private _cashRegisterService: CashRegisterService,
              private _paymentTypeService: PaymentTypeService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this._route.data.subscribe(
      data => {
        this.cashFlow = data['cashFlow'];
        
        this._cashRegisterService.getCashRegister(this.cashFlow.cashRegisterId).subscribe(
          cashRegister => {
            this.cashFlow.cashRegister = cashRegister.name;
          },
          error => {
            this.showModalError(this.serviceErrorTitle, <any>error);
          }
        );

        this._paymentTypeService.getPaymentType(this.cashFlow.paymentType).subscribe(
          paymentType => {
            this.paymentTypeName = paymentType.name;
          },
          error => {
            this.showModalError(this.serviceErrorTitle, <any>error);
          }
        )
      }
    )
    this.cashRegisters = this._route.snapshot.data['cashRegisters'];
    this.paymentTypes = this._route.snapshot.data['paymentTypes'];
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  onBack(): void {
    this._router.navigate(['/sales/cash-flows', { outlets: { edit: null } }]);
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;
  }

}
