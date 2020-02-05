import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription }       from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  Menu,
  MenuService
} from '../../../shared';

import { FileInputComponent } from '../../file-input/file-input.component';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-menu-new',
  templateUrl: './menu-new.component.html',
  styleUrls: ['./menu-new.component.css']
})
export class MenuNewComponent implements OnInit {
  

  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent; 

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: String;
  private newMenuPictureData: string = '';
  pageTitle: string = 'New Menu'; 
  newMenu: Menu;
  validPicture: string = '';
  pictureTouched: boolean;
  checkboxAvailableText: String = 'Disponible';

   private sub: Subscription;

  constructor(private _router: Router,
              private modalService: BsModalService,
              private _menuService: MenuService) { }

  ngOnInit(): void {
    this.newMenu = new Menu();
  }


  saveMenu(){
    this._menuService.saveMenu(this.newMenu).subscribe(
          menu => { 
            this.newMenu = menu;
            this.onBack();
          },
          error => { 
            this.showModalError(this.serviceErrorTitle, error.error.message);
          });
    
  }

  onNotified(validator: Array<string>) {
    validator[0] != '' ? this.validPicture = validator[0]: this.validPicture = '';
    validator[1] != '' ? this.newMenuPictureData = validator[1]: this.newMenuPictureData = '';
    this.pictureTouched = true;
    if(this.validPicture != ''){
      this.newMenu.picture = this.newMenuPictureData;
    }
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

  cancel(){    
    this.onBack();
    this.closeModal();
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  onBack(): void {
    this._router.navigate(['/restaurant/menu']);
  }

}
