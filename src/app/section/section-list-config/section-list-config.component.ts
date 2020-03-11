import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  SectionService,
  Section,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../../shared';

@Component({
  selector: 'app-section-list-config',
  templateUrl: './section-list-config.component.html',
  styleUrls: ['./section-list-config.component.scss']
})
export class SectionListConfigComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  @ViewChild('deleteTemplate') deleteTemplate: TemplateRef<any>;
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
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredSections = this.listFilter ? this.performFilter(this.listFilter) : this.filteredSections;
  }

  constructor(private _sectionService: SectionService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableActions();
      }
    );

    this.route.data.subscribe(
      data => {
        this.sections = data['sections'];
      }
    )

    this.filteredSections = this.sections;
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_SECTION);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_SECTION);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_SECTION);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
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

  showModalDelete(template: TemplateRef<any>, idSection: any) {
    this.idSectionDelete = idSection;
    this.modalRef = this.modalService.show(template, { backdrop: true });
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

  deleteSection() {
    if (this.closeModal()) {
      this._sectionService.deleteSection(this.idSectionDelete).subscribe(success => {
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
