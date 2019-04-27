import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Category } from '../../../shared/models/category';
import { CategoryService } from '../../../shared/services/category.service';
import { MenuService } from '../../../shared/services/menu.service';
import { Menu } from '../../../shared/models/menu';
import { Product } from '../../../shared/models/product';
import { ProductService } from '../../../shared/services/product.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public modalRef: BsModalRef;
  pageTitle: string = 'Categorías';
  errorMessage: string;
  filteredCategories: Category[];
  categories: Category[];
  _listFilter: string;
  idCategoryDelete: any;
  menuCategory: Menu;
  products: Product[];
  menus: Menu[];
  menusSelect: Array<any> = [];
  selectedValue: string = '';

  get listFilter(): string {
      return this._listFilter;
  }
  set listFilter(value: string) {
      this._listFilter = value;
      this.filteredCategories = this.listFilter ? this.performFilter(this.listFilter) : this.categories;
  }

  constructor(private categoryService: CategoryService,
              private _productService: ProductService,
              private modalService: BsModalService,
              private _menuService: MenuService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.categories = this.route.snapshot.data['categories'];
    this.filteredCategories = this.categories;
    this.menusSelect.push({ value: 'default', label: 'Todas', selected: true })
    this.menus = this.route.snapshot.data['menus'];
    
    for (let menu of this.menus){
      this.menusSelect.push({value: menu._id, label:menu.name})
    };
    this.selectedValue = 'default';
  }

  performFilter(filterBy: string): Category[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.categories.filter((category: Category) =>
           category.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getCategories(): void {
    this.categoryService.getCategoriesWithMenu()
      .subscribe(categories => {
                  this.categories = categories;
                  this.filteredCategories = this.categories;
                },
                 error => { this.errorMessage = <any>error;
                             alert(this.errorMessage['message'])
                          });
  }

  getCategoriesByMenu(idMenu): void {
    this.categoryService.getCategoriesByMenu(idMenu)
      .subscribe(categories => {
        this.categories = categories;
        this.filteredCategories = this.categories;
        },
      error => { this.errorMessage = <any>error; }
      )
  }

  async showModalDelete(templateDelete: TemplateRef<any>, templateNoDelete: TemplateRef<any>, idCategory: any){
    this.idCategoryDelete = idCategory;
    let canDelete = this.categoryService.validateCategoriesBeforeChanges(this.idCategoryDelete);
    if (await canDelete.then(x=>x == true)){
      this.modalRef = this.modalService.show(templateDelete, {backdrop: true});
    }
    else{
      this.modalRef = this.modalService.show(templateNoDelete, {backdrop: true});
    }
  }

  filterMenu(value) {
    this._listFilter = '';
    if (value === 'default') {this._productService.getProductsByCategory(this.idCategoryDelete)
      this.getCategories();
    } else {
      this.getCategoriesByMenu(value);      
    }
  }

  deleteCategory(){
    if (this.closeModal()){
      this.categoryService.deleteCategory(this.idCategoryDelete).subscribe( success=> {
        this.getCategories();
      });
    }
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

}
