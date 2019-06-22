import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Size } from '../../../shared/models/size';
import { SizeService } from '../../../shared/services/size.service';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';
import { SharedService } from '../../../shared/index';
import { Collections } from '../../../shared/enums/collections.enum';

@Component({
  selector: 'app-size-new',
  templateUrl: './size-new.component.html',
  styleUrls: ['./size-new.component.scss']
})
export class SizeNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>;  
  @ViewChild('nameInvalid') nameInvalidTemplate:TemplateRef<any>; 

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  size: Size = new Size();
  sizeForm: FormGroup;
  pageTitle: String = 'Nuevo Tamaño';
  nameIsAvailable: boolean = false;
  currentCollection : string;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _sizeService: SizeService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private _sharedService: SharedService) { }

  ngOnInit() {
    this.sizeForm = this.formBuilder.group({
      name: ['', Validators.required],      
      available: true   
    });
    this.currentCollection = Collections[8];
  }

  saveSize() {
    if (this.sizeForm.dirty && this.sizeForm.valid) {
      let s = Object.assign({}, this.sizeForm.value);

      this._sizeService.saveSize(s)
          .subscribe(    
            size => {
              this._router.navigate(['/settings/general/sizes', { outlets: { edit: ['selectItem'] } }])
            },        
            (error: any) => { 
              this.showModalError(this.serviceErrorTitle, <any>error);
            }
          );
    }
  }

  showModalError(errorTitleReceived: string, errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  showModalCancel(template: TemplateRef<any>, idSize: any){
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  cancel(){
    this.sizeForm.reset();
    this.closeModal();
  }

  validateName(){
    let p = Object.assign({}, this.sizeForm.value);
      this._sharedService.validateName(this.currentCollection,p.name)
        .subscribe(result => {
          this.nameIsAvailable = result;
          if(this.nameIsAvailable === true){
            this.saveSize();
          }
          else{
            this.modalRef = this.modalService.show(this.nameInvalidTemplate, {backdrop: true});
          }
      })
  }

}
