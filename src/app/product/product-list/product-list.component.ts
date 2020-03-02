import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  ProductService,
  Product,
  Category,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../../shared';

import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  pageTitle: string = 'Productos';
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  public modalRef: BsModalRef;
  filteredProducts: Product[];
  products: Product[];
  _listFilter: string;
  _listFilterCod: string;
  _percentage: number;
  idProductDelete: any;
  categoryProduct: Category;
  categories: Category[];
  categoriesOptions: Array<any> = [];
  selectedValue: string = '';
  previous: any;
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
  }

  get listFilterCod(): string {
    return this._listFilterCod;
  }
  set listFilterCod(value: string) {
    this._listFilterCod = value;
    this.filteredProducts = this.listFilterCod ? this.performFilterCod(this.listFilterCod) : this.products;
  }

  get percentage(): number {
    return this._percentage;
  }
  set percentage(value: number) {
    this._percentage = value;
  }

  constructor(private productService: ProductService,
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

    this.products = this.route.snapshot.data['products'];
    this.filteredProducts = this.products;
    this.categoriesOptions.push({ value: 'default', label: 'Todas', selected: 'true' })
    this.categories = this.route.snapshot.data['categories'];

    for (let cat of this.categories) {
      this.categoriesOptions.push({ value: cat._id, label: cat.name })
    };
    this.selectedValue = 'default';


    this.mdbTable.setDataSource(this.filteredProducts);
    this.filteredProducts = this.mdbTable.getDataSource();
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
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_PRODUCT);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_PRODUCT);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_PRODUCT);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
  }

  performFilter(filterBy: string): Product[] {
    this.listFilterCod = '';
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: Product) =>
      product.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  performFilterCod(filterBy: string): Product[] {
    this.listFilter = '';
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: Product) =>
      product.code.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getProducts(): void {
    this.productService.getAll()
      .subscribe(products => {
        this.products = products;
        this.filteredProducts = this.products;
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        });
  }

  filterByCategoria(value) {
    this._listFilter = '';
    this._listFilterCod = '';
    if (value === 'default') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(pr => pr.category._id === value);
    }
  }

  updatePrice() {
    let data = { productsToUpdate: this.filteredProducts, rate: this.percentage / 100 };
    this.productService.updatePrice(data).subscribe(
      products => {
        this.getProducts();
        this.percentage = 0;
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    )
  }

  async showModalDelete(template: TemplateRef<any>, templateNoDelete: TemplateRef<any>, idProduct: any) {
    this.idProductDelete = idProduct;
    this.modalDeleteTitle = "Eliminar Producto";
    this.modalDeleteMessage = "¿Esta seguro que desea eliminar este producto?";
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }

  deleteProduct() {
    if (this.closeModal()) {
      this.productService.deleteProduct(this.idProductDelete).subscribe(success => {
        this.getProducts();
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
