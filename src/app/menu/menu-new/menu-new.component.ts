import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }       from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { MenuGuardService } from '../menu-guard.service';
import { Menu } from '../../../shared/models/menu';
import { MenuService } from '../../../shared/services/menu.service';
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

  showModalError(errorTitleReceived: string, errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  onBack(): void {
    this._router.navigate(['/restaurant/menu']);
  }

}
