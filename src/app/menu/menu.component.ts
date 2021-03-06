import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Menu,
  MenuService,
  Category,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../shared';

@Component({
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  public modalRef: BsModalRef;
  private serviceErrorTitle = 'Error de Servicio';
  pageTitle: string = 'Cartas';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  filteredMenus: Menu[];
  menus: Menu[];
  _listFilter: string;
  idMenuDelete: any;
  categories: Category[];
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
    this.filteredMenus = this.listFilter ? this.performFilter(this.listFilter) : this.menus;
  }

  constructor(private _menuService: MenuService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private _authenticationService: AuthenticationService) {

  }

  ngOnInit(): void {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableActions();
      }
    );

    this.menus = this.route.snapshot.data['menus'];
    this.filteredMenus = this.menus;
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_MENU);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_MENU);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_MENU);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
  }

  performFilter(filterBy: string): Menu[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.menus.filter((menu: Menu) =>
      menu.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getMenus(): void {
    this._menuService.getAll()
      .subscribe(menus => {
        this.menus = menus;
        this.filteredMenus = this.menus
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        });
  }

  async showModalDelete(templateDelete: TemplateRef<any>, templateNoDelete: TemplateRef<any>, idMenu: any) {
    this.idMenuDelete = idMenu;
    this.modalDeleteTitle = "Eliminar Carta";
    this.modalDeleteMessage = "¿Seguro desea eliminar esta Carta?";
    this.modalRef = this.modalService.show(templateDelete, { backdrop: true });
  }

  deleteMenu() {
    if (this.closeModal()) {
      this._menuService.deleteMenu(this.idMenuDelete).subscribe(success => {
        this.getMenus();
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        });
    }
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
}
