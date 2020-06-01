import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Size,
  SizeService
} from '../../../shared';

@Component({
  selector: 'app-size-edit',
  templateUrl: './size-edit.component.html',
  styleUrls: ['./size-edit.component.scss']
})
export class SizeEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  private pageTitle: String = 'Editando';
  private cancelButton: String = 'Cancelar';
  private saveButton: String = 'Aceptar';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  size: Size;
  sizeNameModified: String;
  sizeForm: FormGroup;
  checkboxAvailableText: string = 'Disponible';

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
      size => {
        this.size = size;
        this.onBack();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message)
      });
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  showModalCancel(template: TemplateRef<any>, idSize: any) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  cancel() {
    this.onBack();
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

  onBack() {
    this._router.navigate(['/settings/general-settings/size', { outlets: { edit: ['selectItem'] } }]);
  }

}
