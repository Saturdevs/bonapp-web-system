import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import {
  ProductService,
  Product,
  Category,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions,
  Constants
} from '../../../shared';

import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';
import { ProductSearchPipe } from '../../../shared/pipes/product-search.pipe';

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
  _percentage: number;
  idProductDelete: any;
  categories: Category[];
  categoriesOptions: Array<any> = [];
  selectedValue: string = '';
  previous: any;
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;
  productName: string;
  categoryProduct: string
  _listFilter: string;

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.performFilter();
    this.mdbTable.setDataSource(this.filteredProducts);
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
    this.categoriesOptions.push({ value: Constants.DEFAULT, label: 'Todas', selected: 'true' })
    this.categories = this.route.snapshot.data['categories'];

    for (let cat of this.categories) {
      this.categoriesOptions.push({ value: cat._id, label: cat.name })
    };
    this.selectedValue = Constants.DEFAULT;

    this.categoryProduct = Constants.DEFAULT;

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

  performFilter(): void {  
    const productSearch = new ProductSearchPipe();
    this.filteredProducts = productSearch.transform(this.products, this.listFilter, this.categoryProduct);
    this.mdbTable.setDataSource(this.filteredProducts);
  }

  filterByCategoria(value) {
    this.performFilter();
  }

  getProducts(): void {
    this.productService.getAll()
      .subscribe(products => {
        this.products = products;
        this.filteredProducts = this.products;
        this.mdbTable.setDataSource(this.filteredProducts);
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        });
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
