import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  Category,
  Menu,
  CategoryService,
  MenuCategory
} from '../../../shared/index';

import { FileInputComponent } from '../../file-input/file-input.component';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css']
})
export class CategoryNewComponent implements OnInit {

  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  @ViewChild('nameInvalid') nameInvalidTemplate: TemplateRef<any>;

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  newCategory: Category;
  menus: Menu[];
  hasMenu: boolean = true;
  menuTouched: boolean = false;
  pictureTouched: boolean;
  validPicture: string = '';
  private newCategoryPictureData: string;
  menuSelectedId: string;
  checkboxAvailableText: String = 'Disponible';

  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _categoryService: CategoryService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.newCategory = new Category();
    this.newCategory.menu = new MenuCategory();
    this.newCategory.available = true;
    this.menuSelectedId = "default";
    this.menus = this._route.snapshot.data['menus'];
  }

  saveCategory() {
    this.newCategory.menu._id = this.menuSelectedId;
    this._categoryService.saveCategory(this.newCategory).subscribe(
      category => {
        this.newCategory = category;
        this.onBack();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
  }

  onNotified(validator: Array<string>) {
    validator[0] != '' ? this.validPicture = validator[0] : this.validPicture = '';
    validator[1] != '' ? this.newCategoryPictureData = validator[1] : this.newCategoryPictureData = '';
    this.pictureTouched = true;
    if (this.validPicture != '') {
      this.newCategory.picture = this.newCategoryPictureData;
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalCancel(template: TemplateRef<any>, idCashRegister: any) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  onBack(): void {
    this._router.navigate(['/restaurant/category']);
  }

  validateCategory(value) {
    this.menuTouched = true;
    if (value === 'default') {
      this.hasMenu = true;
    } else {
      this.hasMenu = false;
    }
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

}
