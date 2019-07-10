import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { CashRegister } from '../../../shared/models/cash-register';
import { CashRegisterService } from '../../../shared/services/cash-register.service';

@Component({
  selector: 'app-cash-register-new',
  templateUrl: './cash-register-new.component.html',
  styleUrls: ['./cash-register-new.component.scss']
})
export class CashRegisterNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  cashRegister: CashRegister = new CashRegister();
  cashRegisterForm: FormGroup;
  pageTitle: String = 'Nueva Caja';
  private saveButton: String = 'Guardar';
  private cancelButton: String = 'Cancelar';

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _cashRegisterService: CashRegisterService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.cashRegisterForm = this.formBuilder.group({
      name: ['', Validators.required],      
      available: true   
    });
  }

  saveCashRegister() {
    if (this.cashRegisterForm.dirty && this.cashRegisterForm.valid) {
      let cr = Object.assign({}, this.cashRegisterForm.value);

      this._cashRegisterService.saveCashRegister(cr)
          .subscribe(    
            cashRegister => {
              this.onBack();              
            },        
            (error: any) => {               
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          );
    }
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
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  onBack() {
    this._router.navigate(['/settings/general/cashRegisters', { outlets: { edit: ['selectItem'] } }])
  }

  cancel(){
    this.onBack();
    this.closeModal();
  }

}
