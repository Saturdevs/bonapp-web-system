import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product';
import { Category } from '../../../shared/models/category';
import { CategoryService } from '../../../shared/services/category.service';
import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
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
              private categoryService: CategoryService,
              private modalService: BsModalService,
              private route: ActivatedRoute,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.products = this.route.snapshot.data['products'].map(product => {
      if(product.available) {
        product.available = 'Si';
      } else {
        product.available = 'No';
      }

      return product;
    });
    this.filteredProducts = this.products;
    this.categoriesOptions.push({ value: 'default', label: 'Todas', selected: 'true' })
    this.categories = this.route.snapshot.data['categories'];

    for (let cat of this.categories){
      this.categoriesOptions.push({value: cat._id, label:cat.name})
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
    this.productService.getProductsWithCategory()
      .subscribe(products => {
        this.products = products.map(product => {
          if(product.available) {
            product.available = 'Si';
          } else {
            product.available = 'No';
          }

          return product;
        });
        this.filteredProducts = this.products;
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
  }

  getProductsByCategory(idCategory): void {
    this.productService.getProductsByCategory(idCategory)
      .subscribe(products => {
        this.products = products.map(product => {
          if(product.available) {
            product.available = 'Si';
          } else {
            product.available = 'No';
          }

          return product;
        });
        this.filteredProducts = this.products;
      },
      error => { 
        this.showModalError(this.serviceErrorTitle, error.error.message);
      })
  }

  filterByCategoria(value) {
    this._listFilter = '';
    this._listFilterCod = '';
    if (value === 'default') {
      this.getProducts();
    } else {
      this.getProductsByCategory(value);
    }
  }

  updateProduct(product: Product) {
    this.productService.updateProduct(product)
      .subscribe(
        product => {},
        error => { 
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
  }

  updatePrice() {
    this.filteredProducts = this.filteredProducts.map(product => {
      product.price = product.price + (product.price * this.percentage) / 100;
      this.updateProduct(product);
      return product;
    })   
    this.percentage = 0; 
  }

  async showModalDelete(template: TemplateRef<any>,templateNoDelete: TemplateRef<any>, idProduct: any){
    this.idProductDelete = idProduct;
    let canDelete = this.productService.validateProductsBeforeChanges(this.idProductDelete);
    if(await canDelete.then(x => x == true)){
      this.modalDeleteTitle = "Eliminar Producto";
      this.modalDeleteMessage = "¿Esta seguro que desea eliminar este producto?";
      this.modalRef = this.modalService.show(template, {backdrop: true});
    }
    else{      
      let noDeleteTitle = "Eliminar Producto";
      let noDeleteMessage = "El producto no puede ser eliminado ya que ya ha sido adicionado en ventas."
      this.showModalError(noDeleteTitle, noDeleteMessage);
    }
  }

  deleteProduct(){
    if (this.closeModal()){
      this.productService.deleteProduct(this.idProductDelete).subscribe( success=> {
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
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }
}
