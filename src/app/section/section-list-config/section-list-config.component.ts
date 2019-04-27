import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { SectionService } from '../../../shared/services/section.service';
import { Section } from '../../../shared/models/section';

@Component({
  selector: 'app-section-list-config',
  templateUrl: './section-list-config.component.html',
  styleUrls: ['./section-list-config.component.scss']
})
export class SectionListConfigComponent implements OnInit {

  pageTitle: string = "Salas";
  public modalRef: BsModalRef;
  sections: Section[];
  errorMessage: string;
  filteredSections: Section[];
  _listFilter: string;
  idSectionDelete: any;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
      this._listFilter = value;
      this.filteredSections = this.listFilter ? this.performFilter(this.listFilter) : this.filteredSections;
  }

  constructor(private _sectionService: SectionService,
              private route: ActivatedRoute,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.sections = data['sections'];
      }
    )

    this.filteredSections = this.sections;
  }

  performFilter(filterBy: string): Section[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.sections.filter((section: Section) =>
           section.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getSections(): void {
    this._sectionService.getAll()
      .subscribe(sections => {
        this.sections = sections;
        this.filteredSections = this.sections;
      },
      error => this.errorMessage = <any>error);
  }

  showModalDelete(template: TemplateRef<any>, idSection: any){
    this.idSectionDelete = idSection;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  deleteSection(){
    if (this.closeModal()){
      this._sectionService.deleteSection(this.idSectionDelete).subscribe( success=> {
        this.getSections();
      });
    }
  }

  reloadItems(event) {
    this.getSections();
  }
}