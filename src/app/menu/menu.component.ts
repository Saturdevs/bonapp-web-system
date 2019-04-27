import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Menu } from '../../shared/models/menu';
import { MenuService } from '../../shared/services/menu.service';
import { MenuGuardService } from './menu-guard.service';
import { Category } from '../../shared/models/category';
import { CategoryService } from '../../shared/services/category.service';
import { ApiService } from '../../shared/services/api.service';
import { isNullOrUndefined } from 'util';

@Component({
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
      public modalRef: BsModalRef;
      pageTitle: string = 'Cartas';
      errorMessage: string;
      filteredMenus: Menu[];
      menus: Menu[];
      _listFilter: string;
      idMenuDelete: any;
      categories: Category[];
      
      get listFilter(): string {
          return this._listFilter;
      }
      set listFilter(value: string) {
          this._listFilter = value;
          this.filteredMenus = this.listFilter ? this.performFilter(this.listFilter) : this.menus;
      }

      constructor(private _menuService: MenuService,
                  private _categoryService: CategoryService,
                  private modalService: BsModalService,
                  private route: ActivatedRoute) { 

        }

      ngOnInit(): void {
        this.menus = this.route.snapshot.data['menus'];
        this.filteredMenus = this.menus;
      }

      performFilter(filterBy: string): Menu[] {
            filterBy = filterBy.toLocaleLowerCase();
            return this.menus.filter((menu: Menu) =>
                  menu.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
      }

      getMenus(): void {
        this._menuService.getAll()
            .subscribe(menus => { 
              this.menus = menus;
              this.filteredMenus = this.menus
            },
            error => this.errorMessage = <any>error);
      }

      async showModalDelete(templateDelete: TemplateRef<any>, templateNoDelete: TemplateRef<any>, idMenu: any){
        this.idMenuDelete = idMenu;       
        let canDelete = this._menuService.validateMenuBeforeChanges(this.idMenuDelete);
        if(await canDelete.then(x => x == true)){
          this.modalRef = this.modalService.show(templateDelete, {backdrop: true});    
        }
        else{
          this.modalRef = this.modalService.show(templateNoDelete, {backdrop: true});     
        }                          
      }

      deleteMenu(){
        if (this.closeModal()){
          this._menuService.deleteMenu(this.idMenuDelete).subscribe( success=> {
            this.getMenus();
          });
         }
      }
      closeModal(){
        this.modalRef.hide();
        this.modalRef = null;
        return true;        
      }
}
