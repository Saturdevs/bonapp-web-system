import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Section } from '../../../shared/models/section';

import { SectionService } from '../../../shared/services/section.service';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective} from 'ng-mdb-pro/free/modals'
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';



@Component({
  selector: 'app-section-new',
  templateUrl: './section-new.component.html',
  styleUrls: ['./section-new.component.scss']
})
export class SectionNewComponent implements OnInit {
  private serviceErrorTitle = 'Error de Servicio';
  pageTitle: String = 'Nueva Sala';
  newSection: Section;
  public modalRef: BsModalRef;
  section: Section = new Section();
  sectionForm: FormGroup;
  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>;
  

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private _sectionService: SectionService) { }

  ngOnInit() {
    this.sectionForm = this.formBuilder.group({
      name: ['', Validators.required]  
    });
  }
  
  saveSection(){
    if (this.sectionForm.dirty && this.sectionForm.valid){
      let s = Object.assign({}, this.sectionForm.value);  
    
      this._sectionService.saveSection(s)
      .subscribe(    
        section => {
          this._router.navigate(['/settings/general/sections', { outlets: { edit: ['selectItem'] } }])
        },        
        (error: any) => { 
          this.showModalError(this.serviceErrorTitle, <any>error);
        }
      );
    }
  }

  onBack(): void {
      this._router.navigate(['/settings/section/tables']);
    }
  
  showModalError(errorTitleReceived: string, errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }
}
