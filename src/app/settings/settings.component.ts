import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  AuthenticationService,  
  User,
  AppMenu,
  UtilFunctions
} from '../../shared';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
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
