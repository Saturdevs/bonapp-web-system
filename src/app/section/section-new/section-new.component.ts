import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  Section,
  SectionService
} from '../../../shared';

 
@Component({
  selector: 'app-section-new',
  templateUrl: './section-new.component.html',
  styleUrls: ['./section-new.component.scss']
})
export class SectionNewComponent implements OnInit {
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  pageTitle: String = 'Nueva Sala';
  saveButton: String = 'Guardar';
  cancelButton: String = 'Cancelar';
  newSection: Section;
  public modalRef: BsModalRef;
  section: Section = new Section();
  sectionForm: FormGroup;
  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;


  constructor(private _router: Router,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _sectionService: SectionService) { }

  ngOnInit() {
    this.sectionForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  saveSection() {
    if (this.sectionForm.dirty && this.sectionForm.valid) {
      let s = Object.assign({}, this.sectionForm.value);

      this._sectionService.saveSection(s)
        .subscribe(
          section => {
            this.onBack();
          },
          (error: any) => {
            this.showModalError(this.serviceErrorTitle, error.error.message);
          }
        );
    }
  }

  onBack(): void {
    this._router.navigate(['/settings/general-settings/sections', { outlets: { edit: ['selectItem'] } }]);
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalCancel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "??Est?? seguro que desea salir sin guardar los cambios?";
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }
}
