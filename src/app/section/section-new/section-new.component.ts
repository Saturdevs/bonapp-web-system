import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

import { Section } from '../../../shared/models/section';

import { SectionService } from '../../../shared/services/section.service';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective} from 'ng-mdb-pro/free/modals'

@Component({
  selector: 'app-section-new',
  templateUrl: './section-new.component.html',
  styleUrls: ['./section-new.component.scss']
})
export class SectionNewComponent implements OnInit {
  pageTitle: String = 'Nueva Sala';
  newSection: Section;
  errorMessage: string;
  public modalRef: BsModalRef;

  @Output() notifyParent = new EventEmitter<Boolean>();

  @ViewChild('fluid') public fluid:ModalDirective;

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private modalService: BsModalService,
              private _sectionService: SectionService) { }

  ngOnInit(): void{
    
    this.newSection = new Section(); 
  }

  saveSection(){
    this._sectionService.saveSection(this.newSection).subscribe(
      section => { this.newSection = section,
                  this.callParent();  
                  this.fluid.hide(); },
      error => { this.errorMessage = <any>error,
                 this.showModalError(this.errorTemplate)});
    }

    onBack(): void {
      this._router.navigate(['/settings/section/tables']);
    }
  
    showModalError(errorTemplate: TemplateRef<any>){
      this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
  }
  
    callParent() {
    this.notifyParent.next(true);
  }
}
