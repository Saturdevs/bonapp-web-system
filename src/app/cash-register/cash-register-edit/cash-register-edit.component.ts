import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { CashRegister } from '../../../shared/models/cash-register';
import { CashRegisterService } from '../../../shared/services/cash-register.service';

@Component({
  selector: 'app-cash-register-edit',
  templateUrl: './cash-register-edit.component.html',
  styleUrls: ['./cash-register-edit.component.scss']
})
export class CashRegisterEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  cashRegister: CashRegister;
  cashRegisterNameModified: String;
  cashRegisterDefault: Boolean;
  errorMessage: string;
  cashRegisterForm: FormGroup;

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
          if (this.cashRegisterDefault === false && cashRegisterUpdate.default !== this.cashRegisterDefault)
          {
            this._cashRegisterService.unSetDefaultCashRegister(cashRegisterUpdate._id).subscribe(
              data =>
              {
                console.log(data);
              },
              error =>
              {
                console.log(error);
              }
            );
          }
          this._router.navigate(['/settings/general/cashRegisters', { outlets: { edit: ['selectItem'] } }])
        },
        error => 
        { 
          this.errorMessage = <any>error,
          this.showModalError(this.errorTemplate)
        }
    );
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

  onCashRegisterRetrieved(cashRegister: CashRegister): void {
    this.cashRegister = cashRegister;
    this.cashRegisterNameModified = this.cashRegister.name;
    this.cashRegisterDefault = this.cashRegister.default;
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

}
