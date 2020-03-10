import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  Size,
  SizeService
} from '../../../shared';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-size-new',
  templateUrl: './size-new.component.html',
  styleUrls: ['./size-new.component.scss']
})
export class SizeNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  @ViewChild('nameInvalid') nameInvalidTemplate: TemplateRef<any>;

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  size: Size = new Size();
  sizeForm: FormGroup;
  pageTitle: String = 'Nuevo Tamaño';
  private saveButton: String = 'Guardar';
  private cancelButton: String = 'Cancelar';
  checkboxAvailableText: string = 'Disponible';

  constructor(private _router: Router,
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
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

  onBack() {
    this._router.navigate(['/settings/general-settings/size', { outlets: { edit: ['selectItem'] } }]);
  }

}
