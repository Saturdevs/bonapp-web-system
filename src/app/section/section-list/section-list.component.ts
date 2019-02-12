import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Section } from '../../../shared/models/section';

import { SectionService } from '../../../shared/services/section.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { SectionNewComponent } from '../section-new/section-new.component';
//import { SectionDeleteComponent } from './../section-delete/section-delete.component';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss']
})
export class SectionListComponent implements OnInit, AfterViewInit {

  @ViewChild(SectionNewComponent)
  private newSection: SectionNewComponent;
  public modalRef: BsModalRef;
  private sections: Array<Section>;
  settingsActive: Boolean;
  ordersActive: Boolean;
  idSectionDelete: any;
  activeSection: any;
  
  constructor(private _sectionService: SectionService,
              private modalService: BsModalService,
              private _route: ActivatedRoute,
              private _router: Router ) { }

  ngOnInit() {
   // this.sections = this._route.snapshot.data['sections'];
    this._route.data.subscribe(
    data => { 
      this.sections = data['sections']; 
    });
   
    if(this.isSettingsActive()) {
			this.settingsActive = true;
		}
		
		if(this.isOrdersActive()) {
			this.ordersActive = true;
    }    
    
  }
  
  ngAfterViewInit(): void {
    document.getElementById("tab0").click();
  }

  isSettingsActive() {
		return this._router.isActive('/settings/section', true);
	}

	isOrdersActive() {
		return this._router.isActive('/orders/section', true);
  }
  
  reloadSections(closed: Boolean){
    if (closed === true){
      this._sectionService.getAll()
        .subscribe(
          data => {
            this.sections = data;
          });
      }
  }

  setActiveSection(activeSection: any){
    this.activeSection = activeSection;
    console.log(activeSection);
  } 

  showModalDelete(template: TemplateRef<any>, section: any){
    this.idSectionDelete = section._id;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  deleteSection(){
    if (this.closeModal()){
      this._sectionService.deleteSection(this.idSectionDelete).subscribe( success=> {
        this.reloadSections(true);
        this.activeSection = null;
      });
    }
  }
  
  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  } 

}
