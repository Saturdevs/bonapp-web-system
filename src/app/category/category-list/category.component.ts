import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Category,
  CategoryService,
  Menu,
  Product,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../../shared/index';

import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  pageTitle: string = 'Categorías';
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  private deleteTitle = "Eliminar Categoría";
  public modalRef: BsModalRef;
  filteredCategories: Category[];
  categories: Category[];
  _listFilter: string;
  idCategoryDelete: String;
  menuCategory: Menu;
  products: Product[];
  menus: Menu[];
  menusSelect: Array<{ value: String, label: string, selected: Boolean }> = [];
  selectedValue: string = '';
  previous: any;
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective,{static: true}) mdbTable: MdbTableDirective

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredCategories = this.listFilter ? this.performFilter(this.listFilter) : this.categories;
  }

  constructor(private categoryService: CategoryService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableActions();
      }
    );

    this.categories = this.route.snapshot.data['categories'];
    this.filteredCategories = this.categories;
    this.menusSelect.push({ value: 'default', label: 'Todas', selected: true })
    this.menus = this.route.snapshot.data['menus'];

    for (let menu of this.menus) {
      this.menusSelect.push({ value: menu._id, label: menu.name, selected: false })
    };
    this.selectedValue = 'default';

    this.mdbTable.setDataSource(this.filteredCategories);
    this.filteredCategories = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }


  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(12);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_CATEGORY);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_CATEGORY);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_CATEGORY);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
  }

  performFilter(filterBy: string): Category[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.categories.filter((category: Category) =>
      category.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getCategories(): void {
    this.categoryService.getAll()
      .subscribe(
        categories => {
          this.categories = categories;
          this.filteredCategories = this.categories;
        },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        });
  }

  getCategoriesByMenu(idMenu: String): void {
    this.categoryService.getCategoriesByMenu(idMenu)
      .subscribe(
        categories => {
          this.categories = categories;
          this.filteredCategories = this.categories;
        },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      )
  }

  async showModalDelete(templateDelete: TemplateRef<any>, templateNoDelete: TemplateRef<any>, idCategory: String) {
    this.idCategoryDelete = idCategory;
    this.modalDeleteTitle = this.deleteTitle;
    this.modalDeleteMessage = "¿Seguro desea eliminar esta Categoría?";
    this.modalRef = this.modalService.show(templateDelete, { backdrop: true });
  }

  filterMenu(value: string) {
    this._listFilter = '';
    if (value === 'default') {
      this.getCategories();
    } else {
      this.getCategoriesByMenu(value);
    }
  }

  deleteCategory() {
    if (this.closeModal()) {
      this.categoryService.deleteCategory(this.idCategoryDelete).subscribe(success => {
        this.getCategories();
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
