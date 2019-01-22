import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { CashRegister } from '../../../shared/models/cash-register';

@Component({
  selector: 'app-cash-register-list',
  templateUrl: './cash-register-list.component.html',
  styleUrls: ['./cash-register-list.component.scss']
})
export class CashRegisterListComponent implements OnInit {

  pageTitle: string = "Cajas";
  public modalRef: BsModalRef;
  cashRegisters: CashRegister[];
  errorMessage: string;
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
      error => this.errorMessage = <any>error);
  }

  showModalDelete(template: TemplateRef<any>, idCashRegister: any){
    this.idCashRegisterDelete = idCashRegister;
    this.modalRef = this.modalService.show(template, {backdrop: true});
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
      });
    }
  }

  reloadItems(event) {
    this.getCashRegisters();
  }

}
