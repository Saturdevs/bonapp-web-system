import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }       from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Category } from '../../../shared/models/category';
import { Menu } from '../../../shared/models/menu';
import { CategoryService } from '../../../shared/services/category.service';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-category-modify',
  templateUrl: './category-modify.component.html',
  styleUrls: ['./category-modify.component.css']
})
export class CategoryModifyComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  pageTitle: string = 'Category Modify';
  category: Category;
  menus: Menu[];
  categoryNameModified: string;
  categoryMenuModified: string;
  CategoryPicModified: string;
  CategoryNumberOfItemsModified: number;
  errorMessage: string;
  id: string;
  menuSelect: Menu;
  private sub: Subscription;
  hasCategory = false;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _categoryService: CategoryService,
              private modalService: BsModalService,
              private _menuService: MenuService) { }

 ngOnInit(): void {
    this.category = this._route.snapshot.data['category'];
    this.categoryNameModified = this.category.name;
    this.categoryMenuModified = this.category.menuId;
    this.CategoryPicModified = this.category.picture;
    this.CategoryNumberOfItemsModified = this.category.number_of_items;
    this.menus = this._route.snapshot.data['menus'];
  }

  updateCategory(category: Category) {
      this._categoryService.updateCategory(category).subscribe(
          category => { this.category = category,
                        this.onBack()},
          error => { this.errorMessage = <any>error,
                     this.showModalError(this.errorTemplate)});
  }

  onBack(): void {
    this._router.navigate(['/restaurant/category']);
  }
  
  showModalError(errorTemplate: TemplateRef<any>){
      this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  validateCategory(value) {   
    if (value === 'default') {
      this.hasCategory = true;
    } else {
      this.hasCategory = false;
    }
  }

}
