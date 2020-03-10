import { Component, OnInit } from '@angular/core';

import { AuthenticationService, AppMenu, User, UtilFunctions } from '../../shared';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {
  currentUser: User;
  appMenus: Array<AppMenu> = [];

  constructor(
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute
  ) { }

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
