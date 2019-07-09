import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { CashRegister } from '../../../shared/models/cash-register';
import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { ArqueoCajaService } from '../../../shared/services/arqueo-caja.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-cash-register-edit',
  templateUrl: './cash-register-edit.component.html',
  styleUrls: ['./cash-register-edit.component.scss']
})
export class CashRegisterEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  private pageTitle: String = 'Editando';
  private cancelButton: String = 'Cancelar';
  private saveButton: String = 'Aceptar';
  public modalRef: BsModalRef;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  cashRegister: CashRegister;
  cashRegisterNameModified: String;
  cashRegisterDefault: Boolean;
  cashRegisterAvailable: Boolean;
  cashRegisterForm: FormGroup;
  errorArqueo: Boolean = false;
  errorMsg: string;
  errorArqueoOpen = "Esta caja tiene un arqueo abierto y no puede ser marcada como inactiva hasta que el mismo sea cerrado."

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _cashRegisterService: CashRegisterService,
              private _cashCountService: ArqueoCajaService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.cashRegisterForm = this.formBuilder.group({
      name: ['', Validators.required],      
      available: '',
      default: '' 
    });

    this._route.data.subscribe(
      data => {
        this.cashRegister = data['cashRegister'];
        this.onCashRegisterRetrieved(this.cashRegister);
      }
    )
  }

  validate() {
    let cashRegisterUpdate = Object.assign({}, this.cashRegister, this.cashRegisterForm.value);

    if (cashRegisterUpdate.available === false)
    {
      this._cashCountService.getArqueoOpenByCashRegister(cashRegisterUpdate._id).subscribe(
        arqueo => 
        {
          if (!isNullOrUndefined(arqueo))
          {
            this.errorArqueo = true;
            this.errorMsg = this.errorArqueoOpen;          
          }
          else
          {
            this.updateCashRegister(cashRegisterUpdate);
          }
        },
        error => 
        { 
          this.showModalError(this.serviceErrorTitle, <any>error);
        }
      )
    }
    else
    {
      this.updateCashRegister(cashRegisterUpdate);
    }
  }

  updateCashRegister(cashRegisterUpdate) {    
    this._cashRegisterService.updateCashRegister(cashRegisterUpdate).subscribe(
        cashRegister => 
        { 
          this.cashRegister = cashRegister;
          if (this.cashRegisterDefault === false && cashRegisterUpdate.default !== this.cashRegisterDefault)
          {
            this._cashRegisterService.unSetDefaultCashRegister(cashRegisterUpdate._id).subscribe(
              data =>
              {
                console.log(data);
              },
              error =>
              {
                this.showModalError(this.serviceErrorTitle, <any>error);
              }
            );
          }
          this.onBack();
        },
        error => 
        { 
          this.showModalError(this.serviceErrorTitle, <any>error);
        }
    );
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

  showModalCancel(template: TemplateRef<any>, idCashRegister: any){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }

  onCashRegisterRetrieved(cashRegister: CashRegister): void {
    this.cashRegister = cashRegister;
    this.cashRegisterNameModified = this.cashRegister.name;
    this.cashRegisterDefault = this.cashRegister.default;
    this.cashRegisterAvailable = this.cashRegister.available;
    this.cashRegisterForm.patchValue({
      name: this.cashRegister.name,
      available: this.cashRegister.available,
      default: this.cashRegister.default
    });
    if (this.cashRegisterForm.get('default').value === true)
    {
      this.cashRegisterForm.get('default').disable();
      this.cashRegisterForm.get('available').disable();
    }
    else
    {
      this.cashRegisterForm.get('available').enable();
      if (this.cashRegisterForm.get('available').value === true)
      {
        this.cashRegisterForm.get('default').enable();
      }
      else
      {
        this.cashRegisterForm.get('default').disable();
      }
    }
  }

  clickAvailable() {
    if (this.cashRegisterForm.get('available').value === true)
    {
      this.cashRegisterForm.get('default').enable();
    }
    else
    {
      this.cashRegisterForm.get('default').disable();
    }
  }

  onBack() {
    this._router.navigate(['/settings/general/cashRegisters', { outlets: { edit: ['selectItem'] } }]);
  }

}
