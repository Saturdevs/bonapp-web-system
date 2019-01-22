import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

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

  public modalRef: BsModalRef;
  cashRegister: CashRegister = new CashRegister();
  errorMessage: string;
  cashRegisterForm: FormGroup;
  pageTitle: String = 'Nueva Caja';

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
              this._router.navigate(['/settings/general/cashRegisters', { outlets: { edit: ['selectItem'] } }])
            },        
            (error: any) => { 
              this.errorMessage = <any>error,
              this.showModalError(this.errorTemplate)
            }
          );
    }
  }

  showModalError(errorTemplate: TemplateRef<any>){
    this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  showModalCancel(template: TemplateRef<any>, idCashRegister: any){
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  cancel(){
    this.cashRegisterForm.reset();
    this.closeModal();
  }

}
