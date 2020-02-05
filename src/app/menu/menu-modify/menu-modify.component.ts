import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  Menu,
  MenuService,
  Category
} from '../../../shared';

import { FileInputComponent } from '../../file-input/file-input.component';
import { isNullOrUndefined } from 'util';

import { CONFLICT } from 'http-status-codes';

@Component({
  templateUrl: './menu-modify.component.html'
})

export class MenuModifyComponent implements OnInit {

  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';

  @ViewChild('confirmDisableMenuAndCategoriesAndProductsTemplate') confirmDisableMenuAndCategoriesAndProductsTemplate: TemplateRef<any>;

  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: string;
  private cancelTitle = "Cancelar Cambios";
  private cancelMessage = "¿Está seguro que desea cancelar los cambios?";
  pageTitle: string = 'Menu Modify';
  menu: Menu;
  menuNameModified: string;
  menuPicMod: string;
  id: string;
  private sub: Subscription;
  pictureTouched: boolean;
  validPicture: string;
  path: string = '../../../assets/img/menus/';
  category: Category;
  private menuPictureData: string;
  checkboxAvailableText: String = 'Disponible';

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private modalService: BsModalService,
    private _menuService: MenuService) { }

  ngOnInit(): void {
    this.menu = this._route.snapshot.data['menu'];
    this.category = this._route.snapshot.data['category'];
    this.path = this.path + this.menu.picture;
    this.menuPictureData = this.menu.picture;
  }

  updateMenu(menu: Menu) {
    this._menuService.updateMenu(menu).subscribe(
      menu => {
        this.menu = menu;
        this.onBack();
      },
      error => {
        if (error.status === CONFLICT) {
          let modalTitle = 'Inhabilitar Menu';
          this.showModalCancel(this.confirmDisableMenuAndCategoriesAndProductsTemplate, error.error.message, modalTitle);
        }
        else {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      }
    );
  }

  disableMenuAndCategoriesAndProducts(menuId) {
    this._menuService.disableMenuAndCategoriesAndProducts(menuId).subscribe(
      success => {
        this.cancel()
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  onNotified(validator: Array<string>) {
    validator[0] != '' ? this.validPicture = validator[0] : this.validPicture = '';
    validator[1] != '' ? this.menuPictureData = validator[1] : this.menuPictureData = '';
    this.pictureTouched = true;
    if (this.validPicture != '') {
      this.menu.picture = this.menuPictureData;
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalCancel(template: TemplateRef<any>, modalMessage: string, modalTitle: string) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = modalTitle;
    this.modalCancelMessage = modalMessage;
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

  onBack(): void {
    this._router.navigate(['/restaurant/menu']);
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
}
