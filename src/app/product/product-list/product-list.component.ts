import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product';
import { Category } from '../../../shared/models/category';
import { CategoryService } from '../../../shared/services/category.service';

import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  public modalRef: BsModalRef;
  pageTitle: string = 'Productos';
  errorMessage: string;
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
              private route: ActivatedRoute) { }

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
      error => this.errorMessage = <any>error);
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
      error => { this.errorMessage = <any>error; }
      )
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
        error => { this.errorMessage = <any>error }
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
      this.modalRef = this.modalService.show(template, {backdrop: true});
    }
    else{
      this.modalRef = this.modalService.show(templateNoDelete, {backdrop: true});
    }
  }

  deleteProduct(){
    if (this.closeModal()){
      this.productService.deleteProduct(this.idProductDelete).subscribe( success=> {
        this.getProducts();
      });
    }
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }
}
