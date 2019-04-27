import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Size } from '../../../shared/models/size';
import { SizeService } from '../../../shared/services/size.service';

@Component({
  selector: 'app-size-new',
  templateUrl: './size-new.component.html',
  styleUrls: ['./size-new.component.scss']
})
export class SizeNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  size: Size = new Size();
  errorMessage: string;
  sizeForm: FormGroup;
  pageTitle: String = 'Nuevo Tamaño';

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _sizeService: SizeService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.sizeForm = this.formBuilder.group({
      name: ['', Validators.required],      
      available: true   
    });
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

  showModalCancel(template: TemplateRef<any>, idSize: any){
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  cancel(){
    this.sizeForm.reset();
    this.closeModal();
  }

}