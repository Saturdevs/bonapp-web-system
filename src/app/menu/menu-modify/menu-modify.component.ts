import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }       from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { MenuGuardService } from '../menu-guard.service';
import { Menu } from '../../../shared/models/menu';
import { MenuService } from '../../../shared/services/menu.service';
import { isNullOrUndefined } from 'util';

@Component({
  templateUrl: './menu-modify.component.html'
})

export class MenuModifyComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  pageTitle: string = 'Menu Modify';
  menu: Menu;
  menuNameModified: string;
  menuPicMod: string;
  errorMessage: string;
  id: string;
  private sub: Subscription;
  canEdit: Boolean;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private modalService: BsModalService,
              private _menuService: MenuService) { }

  ngOnInit(): void {
    this.menu = this._route.snapshot.data['menu'];

    this._menuService.hasCategory(this.menu._id).subscribe(
      menu => {
        if (isNullOrUndefined(menu)) {
          console.log('a')
          this.canEdit = false;  
        } else {
          console.log('b')
          this.canEdit = true;
        }
      }
    )
    
    console.log(this.canEdit)
  }

  updateMenu(menu: Menu) {
      this._menuService.updateMenu(menu).subscribe(
          menu => { this.menu = menu,
                    this.onBack()},
          error => { this.errorMessage = <any>error,
                     this.showModalError(this.errorTemplate)});
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
