import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Category } from '../../../shared/models/category';
import { Menu } from '../../../shared/models/menu';
import { CategoryService } from '../../../shared/services/category.service';
import { MenuService } from '../../../shared/services/menu.service';
import { FileInputComponent } from '../../file-input/file-input.component';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css']
})
export class CategoryNewComponent implements OnInit {
  
  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  categories: Category[];
  newCategory: Category;
  menus: Menu[];
  hasCategory = false;
  pictureTouched: boolean;
  validPicture: string;

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
    this.fileInputComponent.startUpload();
    this._categoryService.saveCategory(this.newCategory).subscribe(
      category =>{ this.newCategory = category,
                   this.onBack()},
      error => { 
        this.showModalError(<any>error);
      });
  }

  onNotified(validator: string) {
    console.log(validator);
    validator != '' ? this.validPicture = validator: this.validPicture = '';
    this.pictureTouched = true;
    if(this.validPicture != ''){
      this.newCategory.picture = this.validPicture;
    }
  }

  getMenus(){
    this._menuService.getAll()
        .subscribe(menus => {
            this.menus = menus
          },
          error => { 
            this.showModalError(<any>error['message']);
          });
  }

  showModalError(errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = this.serviceErrorTitle;
    this.modalRef.content.errorMessage = errorMessageReceived;
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
