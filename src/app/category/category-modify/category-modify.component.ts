import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  Category,
  Menu,
  CategoryService,
  Product
} from '../../../shared/index';

import { FileInputComponent } from '../../file-input/file-input.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-category-modify',
  templateUrl: './category-modify.component.html',
  styleUrls: ['./category-modify.component.css']
})
export class CategoryModifyComponent implements OnInit {

  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: string;
  private noModifyMessage = "Esta categoría no puede ser modificada porque tiene productos asociados.";
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
  product: Product;
  canEdit: Boolean = true;
  private categoryPictureData: string;

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
    this.product = this._route.snapshot.data['product'];
    this.categoryPictureData = this.category.picture;
    
    if (!isNullOrUndefined(this.product)) {
      this.canEdit = false;    
    }    
  }

  updateCategory(category: Category) {
    this._categoryService.updateCategory(category).subscribe(
      category => {
      this.category = category,
        this.onBack()
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
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

  showModalCancel(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
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

  cancel() {
    this.onBack();
    this.closeModal();
  }

}
