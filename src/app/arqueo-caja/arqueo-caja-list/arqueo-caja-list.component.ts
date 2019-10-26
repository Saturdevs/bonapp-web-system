import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  ArqueoCaja,
  CashRegister,
  ArqueoCajaService
} from '../../../shared/index';

import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-arqueo-caja-list',
  templateUrl: './arqueo-caja-list.component.html',
  styleUrls: ['./arqueo-caja-list.component.scss']
})
export class ArqueoCajaListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
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
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.arqueos = data['arqueos'];
      }
    )

    this.filteredArqueos = this.arqueos;

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

  /**
   * Recupera los arqueos no eliminados.
   */
  getArqueos(): void {
    this.arqueoService.getAll()
      .subscribe(arqueos => {
        this.arqueos = arqueos;
        this.filteredArqueos = this.arqueos;
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
  } 

  /**
   * Setea la propiedad deleted a true y actualiza el arqueo en la base de datos
   */
  deleteArqueo() {
    if (this.closeModal()) {
      let cashCount = this.arqueos.find(arqueo => arqueo._id === this.idArqueoDelete);
      cashCount.deleted = true;
      this.arqueoService.updateArqueo(cashCount).subscribe(
        () => {
          this.getArqueos();
        },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }
  
  showModalDelete(template: TemplateRef<any>, idArqueo: any) {
    this.idArqueoDelete = idArqueo;
    this.modalDeleteTitle = "Eliminar Arqueo";
    this.modalDeleteMessage = "¿Seguro desea eliminar este Arqueo?";
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  } 

  reloadItems(event) {
    this.getArqueos();
  }
}
