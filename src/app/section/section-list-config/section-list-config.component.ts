import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { TableService, SectionService, Section } from '../../../shared';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-section-list-config',
  templateUrl: './section-list-config.component.html',
  styleUrls: ['./section-list-config.component.scss']
})
export class SectionListConfigComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  @ViewChild('deleteTemplate') deleteTemplate:TemplateRef<any>; 
  pageTitle: string = "Salas";
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string = "Eliminar Sala";
  private modalDeleteMessage: string = "¿Está seguro que desea eliminar la Sala?";
  public modalRef: BsModalRef;
  sections: Section[];
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
              private _tableService: TableService,
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
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
  }

  showModalDelete(template: TemplateRef<any>, idSection: any){
    this.idSectionDelete = idSection;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  validate(sectionId: string) {
    this._tableService.getTablesBySection(sectionId).subscribe(
      tables => {
        if (tables.length > 0 && !isNullOrUndefined(tables))
        {
          let errorTitle = 'Eliminar Sala';
          let errorMessage = 'La sala no puede ser eliminada porque todavía tiene mesas.';
          this.showModalError(errorTitle, errorMessage);          
        }
        else
        {
          this.showModalDelete(this.deleteTemplate, sectionId);          
        }
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    )
  }

  deleteSection(){
    if (this.closeModal()){
      this._sectionService.deleteSection(this.idSectionDelete).subscribe( success=> {
        this.getSections();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
    }
  }

  reloadItems(event) {
    this.getSections();
  }
}
