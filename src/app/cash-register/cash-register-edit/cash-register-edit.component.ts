import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import { CONFLICT } from 'http-status-codes';

import { 
  CashRegisterService,
  CashRegister
} from '../../../shared/index';

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
  cashRegisterAvailable: Boolean;
  cashRegisterForm: FormGroup;
  errorCashRegister: Boolean = false;
  errorMsg: string;
  checkboxAvailableText = "Disponible";
  checkboxDefaultText = "Caja por defecto"

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _cashRegisterService: CashRegisterService,
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

  updateCashRegister() {    
    let cashRegisterUpdate = Object.assign({}, this.cashRegister, this.cashRegisterForm.value);
    this._cashRegisterService.updateCashRegister(cashRegisterUpdate).subscribe(
        cashRegister => 
        { 
          this.cashRegister = cashRegister;
          this.onBack();
        },
        error => 
        { 
          if (error.status === CONFLICT) {
            this.errorCashRegister = true;
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

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  showModalCancel(template: TemplateRef<any>){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }

  onCashRegisterRetrieved(cashRegister: CashRegister): void {
    this.errorCashRegister = false;
    this.errorMsg = '';
    this.cashRegister = cashRegister;
    this.cashRegisterNameModified = this.cashRegister.name;
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
    this._router.navigate(['/settings/general-settings/cash-register', { outlets: { edit: ['selectItem'] } }]);
  }

}
