import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import {
  Section,
  SectionService
} from '../../../shared';

@Component({
  selector: 'app-section-edit',
  templateUrl: './section-edit.component.html',
  styleUrls: ['./section-edit.component.scss']
})
export class SectionEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  serviceErrorTitle = 'Error de Servicio';
  pageTitle: String = 'Editando';
  cancelButton: String = 'Cancelar';
  saveButton: String = 'Aceptar';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  section: Section;
  sectionNameModified: String;
  sectionForm: FormGroup;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _sectionService: SectionService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.sectionForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this._route.data.subscribe(
      data => {
        this.section = data['section'];
        this.onSectionRetrieved(this.section);
      }
    )
  }

  updateSection() {
    let sectionUpdate = Object.assign({}, this.section, this.sectionForm.value);
    this._sectionService.updateSection(sectionUpdate).subscribe(
      section => {
        this.section = section;
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

  showModalCancel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "??Est?? seguro que desea cancelar los cambios?";
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

  onSectionRetrieved(section: Section): void {
    this.section = section;
    this.sectionNameModified = this.section.name;
    this.sectionForm.patchValue({
      name: this.section.name,
    });
  }

  onBack() {
    this._router.navigate(['/settings/general-settings/sections', { outlets: { edit: ['selectItem'] } }]);
  }

}