import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }       from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Menu } from '../../../shared/models/menu';
import { MenuService } from '../../../shared/services/menu.service';
import { FileInputComponent } from '../../file-input/file-input.component';

@Component({
  templateUrl: './menu-modify.component.html'
})

export class MenuModifyComponent implements OnInit {
  
  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;
  
  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;  
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: string;
  pageTitle: string = 'Menu Modify';
  menu: Menu;
  menuNameModified: string;
  menuPicMod: string;
  id: string;
  private sub: Subscription;
  canEdit: Boolean;
  pictureTouched: boolean;
  validPicture: string;
  path: string = '../../../assets/img/menus/';

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private modalService: BsModalService,
              private _menuService: MenuService) { }

  ngOnInit(): void {
    this.menu = this._route.snapshot.data['menu'];
    this.path = this.path + this.menu.picture;

    this.validateMenuBeforeModify();
  }
  
  async validateMenuBeforeModify(){
    let canModify = this._menuService.validateMenuBeforeChanges(this.menu._id);
    if (await canModify.then(x => x == false)){
      let noModifyTitle = "Modificar Carta";
      let noModifyMessage = "No se puede modificar la carta seleccionada porque tiene categorias asociadas.";
      this.showModalError(noModifyTitle, noModifyMessage);
    }
  }
  
  updateMenu(menu: Menu) {
    this._menuService.updateMenu(menu).subscribe(
          menu => { 
            this.menu = menu;
            this.onBack();
          },
          error => { 
            this.showModalError(this.serviceErrorTitle, error.error.message);
          });
  }


  onNotified(validator: Array<string>) {
    validator[1] != '' ? this.validPicture = validator[1]: this.validPicture = '';
    this.pictureTouched = true;
    if(this.validPicture != ''){
      this.menu.picture = this.validPicture;
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  showModalCancel(template: TemplateRef<any>){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }
  
  onBack(): void {
    this._router.navigate(['/restaurant/menu']);
  }
  
  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }
  closeModalAndGoBack(){
    this.closeModal();
    this.onBack();
    return true;  
  }


}
