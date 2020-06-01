import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Category,
  Menu,
  CategoryService  
} from '../../../shared/index';

import { FileInputComponent } from '../../file-input/file-input.component';

import { CONFLICT } from 'http-status-codes';

@Component({
  selector: 'app-category-modify',
  templateUrl: './category-modify.component.html',
  styleUrls: ['./category-modify.component.css']
})
export class CategoryModifyComponent implements OnInit {

  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;

  @ViewChild('confirmDisableCategoryAndProductsTemplate') confirmDisableCategoryAndProductsTemplate:TemplateRef<any>;

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: string;
  private cancelTitle = "Cancelar Cambios";
  private cancelMessage = "¿Está seguro que desea cancelar los cambios?";
  pageTitle: string = 'Category Modify';
  category: Category;
  menus: Menu[];
  categoryNameModified: string;
  categoryMenuModified: string;
  CategoryPicModified: string;
  id: string;
  menuSelect: Menu;
  private sub: Subscription;
  hasCategory = false;
  pictureTouched: boolean;
  validPicture: string;
  menuTouched: boolean = false;
  path: string = '../../../assets/img/categories/';  
  private categoryPictureData: string;
  checkboxAvailableText: String = 'Disponible';

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _categoryService: CategoryService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.category = this._route.snapshot.data['category'];
    this.path = this.path + this.category.picture;
    this.categoryNameModified = this.category.name;
    this.categoryMenuModified = this.category.menu.name;
    this.CategoryPicModified = this.category.picture;
    this.menus = this._route.snapshot.data['menus'];
    this.categoryPictureData = this.category.picture;
  }

  updateCategory(category: Category) {
    this._categoryService.updateCategory(category).subscribe(
      category => {
        this.category = category,
          this.onBack()
      },
      error => {
        if (error.status === CONFLICT) {
          let modalTitle = 'Inhabilitar Categoria';
          this.showModalCancel(this.confirmDisableCategoryAndProductsTemplate, error.error.message, modalTitle);
        }
        else {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      }
    )
  }

  showModalCancel(template: TemplateRef<any>, modalMessage: string, modalTitle: string){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = modalTitle;
    this.modalCancelMessage = modalMessage;
	}

  onNotified(validator: Array<string>) {
    validator[0] != '' ? this.validPicture = validator[0] : this.validPicture = '';
    validator[1] != '' ? this.categoryPictureData = validator[1] : this.categoryPictureData = '';
    this.pictureTouched = true;
    if (this.validPicture != '') {
      this.category.picture = this.categoryPictureData;
    }
  }

  onBack(): void {
    this._router.navigate(['/restaurant/category']);
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

  closeModalAndGoBack() {
    this.closeModal();
    this.onBack();
    return true;
  }

  validateCategory(value) {
    this.menuTouched = true;
    if (value === 'default') {
      this.hasCategory = true;
    } else {
      this.hasCategory = false;
    }
  }

  disableCategoryAndProducts(categoryId) {
    this._categoryService.disableCategoryAndProducts(categoryId).subscribe(
      success => {
        this.cancel()
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

}
