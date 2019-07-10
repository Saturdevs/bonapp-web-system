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
import { SharedService } from '../../../shared/index';
import { Collections } from '../../../shared/enums/collections.enum';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css']
})
export class CategoryNewComponent implements OnInit {
  
  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>;  
  @ViewChild('nameInvalid') nameInvalidTemplate:TemplateRef<any>; 

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  categories: Category[];
  newCategory: Category;
  menus: Menu[];
  hasCategory: boolean = true;
  menuTouched: boolean = false;
  pictureTouched: boolean;
  validPicture: string = '';
  currentCollection : string;
  nameIsAvailable: boolean = false;
  private newCategoryPictureData: string;

  constructor(private _router: Router,
              private _categoryService: CategoryService,
              private modalService: BsModalService,
              private _menuService: MenuService,
              private _sharedService: SharedService) { }

  ngOnInit() {
    this.newCategory = new Category();
    this.newCategory.menuId = "default";
    this.getMenus();
    this.currentCollection = Collections.Category; 
  }

  saveCategory(){
    this.fileInputComponent.startUpload();
    this._categoryService.saveCategory(this.newCategory).subscribe(
      category =>{ this.newCategory = category,
                   this.onBack()},
      error => { 
        this.showModalError(this.serviceErrorTitle, error.error.message);
      });
  }

  onNotified(validator: Array<string>) {
    console.log(validator);
    validator[0] != '' ? this.validPicture = validator[0]: this.validPicture = '';
    validator[1] != '' ? this.newCategoryPictureData = validator[1]: this.newCategoryPictureData = '';
    this.pictureTouched = true;
    if(this.validPicture != ''){
      this.newCategory.picture = this.validPicture;
    }
  }

  validateName(){
      this._sharedService.validateName(this.currentCollection,this.newCategory.name)
        .subscribe(result => {
          this.nameIsAvailable = result;
          if(this.nameIsAvailable === true){
            this.saveCategory();
          }
          else{
            this.modalRef = this.modalService.show(this.nameInvalidTemplate, {backdrop: true});
          }
      })
  }

  getMenus(){
    this._menuService.getAll()
        .subscribe(menus => {
            this.menus = menus
          },
          error => { 
            this.showModalError(this.serviceErrorTitle, error.error.message);
          });
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  showModalCancel(template: TemplateRef<any>, idCashRegister: any){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  onBack(): void {
    this._router.navigate(['/restaurant/category']);
  }

  validateCategory(value) {   
    this.menuTouched = true;
    if (value === 'default') {
      this.hasCategory = true;
    } else {
      this.hasCategory = false;
    }
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;    
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }

}
