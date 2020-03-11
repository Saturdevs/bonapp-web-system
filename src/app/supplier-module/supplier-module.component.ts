import { Component, OnInit } from '@angular/core';

import { AuthenticationService, AppMenu, User, UtilFunctions } from '../../shared';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-supplier-module',
  templateUrl: './supplier-module.component.html',
  styleUrls: ['./supplier-module.component.scss']
})
export class SupplierModuleComponent implements OnInit {
  currentUser: User;
  appMenus: Array<AppMenu> = [];

  constructor(
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute) { }

  ngOnInit() {
    let menuName = this._route.snapshot.data['menu'];
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        if (!isNullOrUndefined(this.currentUser)) {
          this.appMenus = UtilFunctions.getChildAPpMenus(this.currentUser, menuName);
        }
      }
    );
  }

}
