import { Component, OnInit } from '@angular/core';

import { AuthenticationService, AppMenu, User, UtilFunctions } from '../../shared';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
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
