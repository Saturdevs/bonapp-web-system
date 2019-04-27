import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }       from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { MenuGuardService } from '../menu-guard.service';
import { Menu } from '../../../shared/models/menu';
import { MenuService } from '../../../shared/services/menu.service';
import { isNullOrUndefined } from 'util';
import { FileInputComponent } from '../../file-input/file-input.component';

@Component({
  templateUrl: './menu-modify.component.html'
})

export class MenuModifyComponent implements OnInit {
  
  @ViewChild(FileInputComponent)
  private fileInputComponent: FileInputComponent;
  
  
  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  @ViewChild('noModify') noModifyTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  pageTitle: string = 'Menu Modify';
  menu: Menu;
  menuNameModified: string;
  menuPicMod: string;
  errorMessage: string;
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
      this.modalRef = this.modalService.show(this.noModifyTemplate, {backdrop: true});
    }
  }
  
  updateMenu(menu: Menu) {
    this.fileInputComponent.startUpload();
    this._menuService.updateMenu(menu).subscribe(
          menu => { this.menu = menu,
                    this.onBack()},
          error => { this.errorMessage = <any>error,
                     this.showModalError(this.errorTemplate)});
  }


  onNotified(validator: string) {
    console.log(validator);
    validator != '' ? this.validPicture = validator: this.validPicture = '';
    this.pictureTouched = true;
    if(this.validPicture != ''){
      this.menu.picture = this.validPicture;
    }
  }

  showModalError(errorTemplate: TemplateRef<any>){
      this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
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
