import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Section } from '../../../shared/models/section';
import { SectionService } from '../../../shared/services/section.service';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-section-edit',
  templateUrl: './section-edit.component.html',
  styleUrls: ['./section-edit.component.scss']
})
export class SectionEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>;

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
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
          this.onProductRetrieved(this.section);
        }
      )    
    }

    updateSection() {
      let sectionUpdate = Object.assign({}, this.section, this.sectionForm.value);
      this._sectionService.updateSection(sectionUpdate).subscribe(
          section => { this.section = section;
                    this._router.navigate(['/settings/general/sections', { outlets: { edit: ['selectItem'] } }])
                  },
          error => { 
            this.showModalError(this.serviceErrorTitle, <any>error)
          });
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

    showModalCancel(template: TemplateRef<any>, idSection: any){
      this.modalRef = this.modalService.show(template, {backdrop: true});
    }

    cancel(){
      this.sectionForm.reset();
      this.closeModal();
    }

    onProductRetrieved(section: Section): void {
      this.section = section;
      this.sectionNameModified = this.section.name;
      this.sectionForm.patchValue({
        name: this.section.name,
      });
    }

}