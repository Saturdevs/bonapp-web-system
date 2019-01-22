import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Category } from '../../../shared/models/category';
import { Menu } from '../../../shared/models/menu';
import { CategoryService } from '../../../shared/services/category.service';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css']
})
export class CategoryNewComponent implements OnInit {
  
  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  categories: Category[];
  errorMessage: string;
  newCategory: Category;
  menus: Menu[];
  hasCategory = false;

  constructor(private _router: Router,
              private _categoryService: CategoryService,
              private modalService: BsModalService,
              private _menuService: MenuService) { }

  ngOnInit() {
    this.newCategory = new Category();
    this.newCategory.menuId = "default";
    this.getMenus();
  }

  saveCategory(){
    this._categoryService.saveCategory(this.newCategory).subscribe(
      category =>{ this.newCategory = category,
                   this.onBack()},
      error => { this.errorMessage = <any>error,
                     this.showModalError(this.errorTemplate)});
  }

  getMenus(){
    this._menuService.getAll()
        .subscribe(menus => {
            this.menus = menus
          },
          error => { this.errorMessage = <any>error['message'],
                     this.showModalError(this.errorTemplate),
                     this.onBack()});
  }

  showModalError(errorTemplate: TemplateRef<any>){
      this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  onBack(): void {
    this._router.navigate(['/restaurant/category']);
  }

  validateCategory(value) {   
    if (value === 'default') {
      this.hasCategory = true;
    } else {
      this.hasCategory = false;
    }
  }

}
