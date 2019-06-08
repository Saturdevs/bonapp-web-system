import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { ArqueoCajaService } from '../../../shared/services/arqueo-caja.service';
import { ArqueoCaja } from '../../../shared/models/arqueo-caja';

import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { CashRegister } from '../../../shared/models/cash-register';

import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { error } from 'util';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-arqueo-caja-list',
  templateUrl: './arqueo-caja-list.component.html',
  styleUrls: ['./arqueo-caja-list.component.scss']
})
export class ArqueoCajaListComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  pageTitle: string = "Arqueos de Caja";
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  arqueos: ArqueoCaja[];
  filteredArqueos: ArqueoCaja[];
  _listFilter: string;
  idArqueoDelete: any;
  cashRegister: CashRegister;
  cashRegisters: CashRegister[];
  cashRegistersSelect: Array<any> = [];
  totalIngresos: number;
  totalEgresos: number;
  realAmount: number;

  constructor(private arqueoService: ArqueoCajaService,
              private cashRegisterService: CashRegisterService,
              private route: ActivatedRoute,
              private modalService: BsModalService) { }

  ngOnInit() {    

    this.route.data.subscribe(
      data => {
        this.arqueos = data['arqueos'].map(arqueo => {
          this.totalIngresos = 0;
          this.totalEgresos = 0;
          this.realAmount = 0;

          this.cashRegisterService.getCashRegister(arqueo.cashRegisterId).subscribe(
            cashRegister => {
              arqueo.cashRegister = cashRegister.name;
            },
            error => {
              this.showModalError(<any>error);
            }
          );

          arqueo.ingresos.map(ingreso => {
            this.totalIngresos += ingreso.amount;
          })
      
          arqueo.egresos.map(egreso => {
            this.totalEgresos += egreso.amount;
          })

          arqueo.realAmount.map(amount => {
            this.realAmount += amount.amount;
          })
          
          arqueo.realAmountTotal = this.realAmount;
          arqueo.estimatedAmount = arqueo.initialAmount + this.totalIngresos - this.totalEgresos;
          return arqueo;
        })
      }
    )
    
    this.filteredArqueos = this.arqueos;
    console.log(this.filteredArqueos)
  }

  getArqueos(): void {
    this.arqueoService.getAll()
      .subscribe(arqueos => {
        this.arqueos = arqueos.map(arqueo => {
          this.totalIngresos = 0;
          this.totalEgresos = 0;
          this.realAmount = 0;

          this.cashRegisterService.getCashRegister(arqueo.cashRegisterId).subscribe(
            cashRegister => {
              arqueo.cashRegister = cashRegister.name;
            },
            error => {
              this.showModalError(<any>error);
            }
          );

          arqueo.ingresos.map(ingreso => {
            this.totalIngresos += ingreso.amount;
          })
      
          arqueo.egresos.map(egreso => {
            this.totalEgresos += egreso.amount;
          })

          arqueo.realAmount.map(amount => {
            this.realAmount += amount.amount;
          })
          
          arqueo.realAmountTotal = this.realAmount;
          arqueo.estimatedAmount = arqueo.initialAmount + this.totalIngresos - this.totalEgresos;
          return arqueo;
        });

        this.filteredArqueos = this.arqueos;
      },
      error => {
        this.showModalError(<any>error);
      }
    );
  }

  showModalDelete(template: TemplateRef<any>, idArqueo: any){
    this.idArqueoDelete = idArqueo;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  showModalError(errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = this.serviceErrorTitle;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  deleteArqueo(){
    if (this.closeModal()){
      this.arqueoService.getArqueo(this.idArqueoDelete).subscribe( 
        cashCount => {
          cashCount.deleted = true;
          this.arqueoService.updateArqueo(cashCount).subscribe(
            () => {
              this.getArqueos();
            },
            error => { 
              this.showModalError(<any>error)
            }
          );
        },
        error => { 
          this.showModalError(<any>error)
        }
      );
    }
  }

  reloadItems(event) {
    this.getArqueos();
  }

}
