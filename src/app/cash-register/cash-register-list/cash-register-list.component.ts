import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { CashRegister } from '../../../shared/models/cash-register';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-cash-register-list',
  templateUrl: './cash-register-list.component.html',
  styleUrls: ['./cash-register-list.component.scss']
})
export class CashRegisterListComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  pageTitle: string = "Cajas";
  private serviceErrorTitle = 'Error de Servicio';
  private cantDeleteDefaultLabel = 'La caja por defecto no puede ser eliminada.'
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string; 
  private validationMessage: string; 
  public modalRef: BsModalRef;
  cashRegisters: CashRegister[];
  filteredCashRegisters: CashRegister[];
  _listFilter: string;
  idCashRegisterDelete: any;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
      this._listFilter = value;
      this.filteredCashRegisters = this.listFilter ? this.performFilter(this.listFilter) : this.cashRegisters;
  }

  constructor(private _cashRegisterService: CashRegisterService,
              private route: ActivatedRoute,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.cashRegisters = data['cashRegisters'].map(cashRegister => {
          if(cashRegister.available) {
            cashRegister.available = 'Si';
          } else {
            cashRegister.available = 'No';
          }

          return cashRegister;
        })
      }
    )
    
    this.filteredCashRegisters = this.cashRegisters;
  }

  performFilter(filterBy: string): CashRegister[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.cashRegisters.filter((cashRegister: CashRegister) =>
           cashRegister.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getCashRegisters(): void {
    this._cashRegisterService.getAll()
      .subscribe(cashRegisters => {
        this.cashRegisters = cashRegisters.map(cashRegister => {
          if(cashRegister.available) {
            cashRegister.available = 'Si';
          } else {
            cashRegister.available = 'No';
          }

          return cashRegister;
        });
        this.filteredCashRegisters = this.cashRegisters;
      },
      error => {
        this.showModalError(this.serviceErrorTitle, <any>error)
      });
  }

  showModalDelete(template: TemplateRef<any>, idCashRegister: any){
    this.idCashRegisterDelete = idCashRegister;
    this.modalDeleteTitle = "Eliminar Caja Registradora";
    this.modalDeleteMessage = "¿Seguro desea eliminar esta Caja Registradora?";
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  deleteCashRegister(){
    if (this.closeModal()){
      this._cashRegisterService.deleteCashRegister(this.idCashRegisterDelete).subscribe( success=> {        
        this.getCashRegisters();
      },
      error => {                
        if (!isNullOrUndefined(error)) {
          this.validationMessage = error;
        }
        else {
          this.showModalError(this.serviceErrorTitle, <any>error);
        }
      });
    }
  }

  reloadItems(event) {
    this.getCashRegisters();
  }

}
