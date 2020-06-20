import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import { CONFLICT } from 'http-status-codes';

import { 
  ArqueoCaja,
  ArqueoCajaService,
  CashRegister
} from '../../../shared/index';


@Component({
  selector: 'app-arqueo-caja-new',
  templateUrl: './arqueo-caja-new.component.html',
  styleUrls: ['./arqueo-caja-new.component.scss']
})
export class ArqueoCajaNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  public modalRef: BsModalRef;
  cashRegisters: CashRegister[];
  newArqueo: ArqueoCaja;
  errorMsg: string;
  errorTitle: string;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: String;    
  serviceErrorTitle: string = 'Error de Servicio';
  pageTitle: String = 'Nuevo Arqueo';
  cancelButton: String = "Cancelar";
  saveButton: String = "Guardar";
  hasCashRegister = true;
  showMessageCashRegister = false;
  cashRegistersTouched = false;
  /**Determina si se muestra el combo para seleccionar la caja en la vista */
  displayCashRegisterCombo: Boolean;
  dateCreated_at: Date;
  hourCreated_at: Date;
  arqueoOpen: ArqueoCaja;
  errorArqueo: Boolean = false;
  cashRegistersSelect: Array<any> = [];
  
  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _arqueoService: ArqueoCajaService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.newArqueo = new ArqueoCaja();
    this.newArqueo.cashRegisterId = "default";  
    this.errorArqueo = false;  
    
    this._route.data.subscribe(
      data => {
        this.cashRegisters = data['cashRegisters'];
      }
    )
    this.shouldDisplayCashRegisterCombo();  
  }

  /**
   * Setea la variable displayCashRegisterCombo si hay mas de una caja registradora.
   * Si hay una sola caja se la setea al nuevo arqueo y no se muestra el combo para seleccionar una
   * en la vista
   */
  private shouldDisplayCashRegisterCombo() {
    if (this.cashRegisters.length != 0) {
      if (this.cashRegisters.length > 1) {
        this.displayCashRegisterCombo = true;
      }
      else {
        this.newArqueo.cashRegisterId = this.cashRegisters[0]._id;
        this.displayCashRegisterCombo = false;
        this.hasCashRegister = false;
      }
    }
    else {
      this.displayCashRegisterCombo = false;
      this.hasCashRegister = false;
    }
  }

  saveArqueo(){    
    let stringDate = this.dateCreated_at.toString().concat(' ').concat(this.hourCreated_at.toString());
    let dateCreatedAt = new Date(stringDate);
    this.newArqueo.createdAt = dateCreatedAt;
    //Los ingresos y egresos se van a inicializar en el metodo save del backend en caso de que haya movimientos de dinero
    //para esa caja con fecha posterior a la fecha con la que se abre el arqueo.
    this.newArqueo.ingresos = [];
    this.newArqueo.egresos = []; 
    this.newArqueo.createdBy = "5d38ebfcf361ae0cabe45a8e";
    
    this._arqueoService.saveArqueo(this.newArqueo).subscribe(
      arqueo =>
      { 
        this.newArqueo = arqueo,
        this.onBack()
      },
      error => 
      { 
        if (error.status === CONFLICT) {
          this.errorArqueo = true;
          this.errorMsg = error.error.message;
        } else {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      }
    );
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  showModalCancel(template: TemplateRef<any>){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  onBack(): void {
    this.errorArqueo = false;
    this._router.navigate(['/sales/cash-counts', { outlets: { edit: ['selectItem'] } }]);
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

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;    
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }

}
