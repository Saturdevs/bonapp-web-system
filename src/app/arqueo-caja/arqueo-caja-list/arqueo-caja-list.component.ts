import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { ArqueoCajaService } from '../../../shared/services/arqueo-caja.service';
import { ArqueoCaja } from '../../../shared/models/arqueo-caja';

import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { CashRegister } from '../../../shared/models/cash-register';
import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-arqueo-caja-list',
  templateUrl: './arqueo-caja-list.component.html',
  styleUrls: ['./arqueo-caja-list.component.scss']
})
export class ArqueoCajaListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  pageTitle: string = "Arqueos de Caja";
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
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
  previous: any;

  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective
  
  constructor(private arqueoService: ArqueoCajaService,
              private cashRegisterService: CashRegisterService,
              private route: ActivatedRoute,
              private modalService: BsModalService,
              private cdRef: ChangeDetectorRef) { }

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
              this.showModalError(this.serviceErrorTitle, error.error.message);
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

    this.mdbTable.setDataSource(this.filteredArqueos);
    this.filteredArqueos = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }


  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(12);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
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
              this.showModalError(this.serviceErrorTitle, error.error.message);
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
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  showModalDelete(template: TemplateRef<any>, idArqueo: any){
    this.idArqueoDelete = idArqueo;    
    this.modalDeleteTitle = "Eliminar Arqueo";
    this.modalDeleteMessage = "¿Seguro desea eliminar este Arqueo?";
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
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
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          );
        },
        error => { 
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
    }
  }

  reloadItems(event) {
    this.getArqueos();
  }

}
