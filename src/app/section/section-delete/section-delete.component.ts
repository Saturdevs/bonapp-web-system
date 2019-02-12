import { Component, OnInit, TemplateRef, Output, EventEmitter, ViewChild, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Section } from '../../../shared/models/section';
import { SectionService } from '../../../shared/services/section.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  selector: 'app-section-delete',
  templateUrl: './section-delete.component.html',
  styleUrls: ['./section-delete.component.scss']
})
export class SectionDeleteComponent implements OnInit {

    
  
    ngOnInit(): void{      
      //this.newSection = new Section(); 
    }
  
  
  
  /*showModalDelete(template: TemplateRef<any>, idSection: any){
    this.idSectionDelete = idSection;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  deleteSection(){
    if (this.closeModal()){
      this._sectionService.deleteSection(this.idSectionDelete).subscribe( success=> {
        this._sectionService.getAll();
      });
    }
  }
  
  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  } */

}