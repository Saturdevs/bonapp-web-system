import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }       from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { MenuGuardService } from '../menu-guard.service';
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

   public modalRef: BsModalRef;
   pageTitle: string = 'New Menu';
   menus: Menu[];   
   errorMessage: string;
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
          menu => { this.newMenu = menu,
                    this.onBack()},
          error => { this.errorMessage = <any>error,
                     this.showModalError(this.errorTemplate)});
    
  }

  onNotified(validator: string) {
    console.log(validator);
    validator != '' ? this.validPicture = validator: this.validPicture = '';
    this.pictureTouched = true;
    if(this.validPicture != ''){
      this.newMenu.picture =this.validPicture;
    }
  }

  showModalError(errorTemplate: TemplateRef<any>){
      this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
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
