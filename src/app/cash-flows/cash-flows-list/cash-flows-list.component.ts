import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { CashFlowService } from '../../../shared/services/cash-flow.service';
import { CashFlow } from '../../../shared/models/cash-flow';

import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { CashRegister } from '../../../shared/models/cash-register';

import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-cash-flows-list',
  templateUrl: './cash-flows-list.component.html',
  styleUrls: ['./cash-flows-list.component.scss']
})
export class CashFlowsListComponent implements OnInit {

  pageTitle: string = "Movimientos de Caja";
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  cashFlows: CashFlow[];
  filteredCashFlows: CashFlow[];
  _listFilter: string;
  idCashFlowsDelete: any;
  cashRegister: CashRegister;
  cashRegisters: CashRegister[];
  cashRegistersSelect: Array<any> = [];
  typesSelect: Array<any> = [];
  typeSelectedValue: string;
  cashSelectedValue: string;
  startDate: Date;
  endDate: Date;
  typesArray: Array<string> = new Array("Ingreso", "Egreso");

  constructor(private cashFlowService: CashFlowService,
              private cashRegisterService: CashRegisterService,
              private route: ActivatedRoute,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.cashFlows = data['cashFlows'].map(cashFlow => {
          this.cashRegisterService.getCashRegister(cashFlow.cashRegisterId).subscribe(
            cashRegister => {
              cashFlow.cashRegister = cashRegister.name                
            },  
            error => { 
              this.showModalError(this.serviceErrorTitle, <any>error);
            }
          );

          return cashFlow;
        })
      }
    )

    this.route.data.subscribe(
      data => {
        this.cashRegisters = data['cashRegisters']
      }
    )

    this.typesSelect.push({ value: 'default', label: 'Todos', selected: true })    
    for (let type of this.typesArray){
      this.typesSelect.push({value: type, label:type})
    };
    this.typeSelectedValue = 'default';

    this.cashRegistersSelect.push({ value: 'default', label: 'Todas', selected: true })    
    for (let cashRegister of this.cashRegisters){
      this.cashRegistersSelect.push({value: cashRegister._id, label:cashRegister.name})
    };
    this.cashSelectedValue = 'default';

    this.filteredCashFlows = this.cashFlows;
  }

  getCashFlows(): void {
    this.cashFlowService.getAll()
      .subscribe(cashFlows => {
        this.cashFlows = cashFlows.map(cashFlow => {
          this.cashRegisterService.getCashRegister(cashFlow.cashRegisterId).subscribe(
            cashRegister => {
              cashFlow.cashRegister = cashRegister.name                
            },  
            error => { 
              this.showModalError(this.serviceErrorTitle, <any>error);
            }
          );  

          return cashFlow;
        });

        this.filteredCashFlows = this.cashFlows;
      },
      error => {
        this.showModalError(this.serviceErrorTitle, <any>error);
      })
  }

  showModalDelete(template: TemplateRef<any>, idCashFlow: any){
    this.idCashFlowsDelete = idCashFlow;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  showModalError(errorTitleReceived: string, errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  deleteCashFlow(){
    if (this.closeModal()){
      this.cashFlowService.deleteCashFlow(this.idCashFlowsDelete).subscribe( success=> {
        this.getCashFlows();
      });
    }
  }

  onValueChangedStartDate(value) {
    this.startDate = value;
  }

  onValueChangedEndDate(value) {
    this.endDate = value;
  }

  reloadItems(event) {
    this.getCashFlows();
  }
}
