import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Size } from '../../../shared/models/size';
import { SizeService } from '../../../shared/services/size.service';

@Component({
  selector: 'app-size-edit',
  templateUrl: './size-edit.component.html',
  styleUrls: ['./size-edit.component.scss']
})
export class SizeEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  size: Size;
  sizeNameModified: String;
  errorMessage: string;
  sizeForm: FormGroup;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _sizeService: SizeService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.sizeForm = this.formBuilder.group({
      name: ['', Validators.required],      
      available: ''   
    });

    this._route.data.subscribe(
      data => {
        this.size = data['size'];
        this.onProductRetrieved(this.size);
      }
    )    
  }

  updateSize() {
    let sizeUpdate = Object.assign({}, this.size, this.sizeForm.value);
    this._sizeService.updateSize(sizeUpdate).subscribe(
        size => { this.size = size;
                  this._router.navigate(['/settings/general/sizes', { outlets: { edit: ['selectItem'] } }])
                },
        error => { this.errorMessage = <any>error,
                   this.showModalError(this.errorTemplate)});
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

  onProductRetrieved(size: Size): void {
    this.size = size;
    this.sizeNameModified = this.size.name;
    this.sizeForm.patchValue({
      name: this.size.name,
      available: this.size.available
    });
  }

}
 