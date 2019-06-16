import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }       from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Menu } from '../../../shared/models/menu';
import { MenuService } from '../../../shared/services/menu.service';
import { FileInputComponent } from '../../file-input/file-input.component';

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
  pageTitle: string = 'New Menu';
  menus: Menu[];   
  newMenu: Menu;
  validPicture: string = '';
  pictureTouched: boolean;

   private sub: Subscription;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private modalService: BsModalService,
              private _menuService: MenuService) { }

  ngOnInit(): void {
    this.newMenu = new Menu();      
  }


  saveMenu(){
    this.fileInputComponent.startUpload();
    this._menuService.saveMenu(this.newMenu).subscribe(
          menu => { 
            this.newMenu = menu;
            this.onBack();
          },
          error => { 
            this.showModalError(this.serviceErrorTitle, <any>error);
          });
    
  }

  onNotified(validator: string) {
    console.log(validator);
    validator != '' ? this.validPicture = validator: this.validPicture = '';
    this.pictureTouched = true;
    if(this.validPicture != ''){
      this.newMenu.picture =this.validPicture;
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

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;    
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }

  onBack(): void {
    this._router.navigate(['/restaurant/menu']);
  }

}
