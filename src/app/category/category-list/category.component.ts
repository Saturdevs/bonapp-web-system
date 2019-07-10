import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  pageTitle: string = 'Categorías';
  private serviceErrorTitle = 'Error de Servicio';   
  private modalErrorTittle: string;
  private modalErrorMessage: string; 
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  public modalRef: BsModalRef;
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
      .subscribe(
        categories => {
          this.categories = categories;
          this.filteredCategories = this.categories;
        },
        error => { 
          this.showModalError(this.serviceErrorTitle, error.error.message);                             
        });
  }

  getCategoriesByMenu(idMenu): void {
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

  async showModalDelete(templateDelete: TemplateRef<any>, templateNoDelete: TemplateRef<any>, idCategory: any){
    this.idCategoryDelete = idCategory;    
    let canDelete = this.categoryService.validateCategoriesBeforeChanges(this.idCategoryDelete);
    if (await canDelete.then(x=>x == true)){
      this.modalDeleteTitle = "Eliminar Categoría";
      this.modalDeleteMessage = "¿Seguro desea eliminar esta Categoría?";
      this.modalRef = this.modalService.show(templateDelete, {backdrop: true});
    }
    else{
      let noDeleteTittle = "Eliminar Categoría";
      let noDeleteMessage = "No se puede eliminar la categoría seleccionada porque tiene productos asociados.";
      this.showModalError(noDeleteTittle, noDeleteMessage);
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
