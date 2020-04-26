import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserNewComponent } from './user-new/user-new.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { UserService } from '../../shared/services/user.service';
import { UserRoleService } from '../../shared/services/user-role.service';
import { UsersResolverService } from './user-list/users-resolver-service';
import { UsersNewResolverService } from './user-new/user-new-resolver.service';
import { UserEditResolverService } from './user-edit/user-edit-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([

    ]),
    SharedModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    UserListComponent,
    UserNewComponent,
    UserEditComponent],
  providers: [
      UserService,
      UserRoleService,
      UsersResolverService,
      UsersNewResolverService,
      UserEditResolverService
  ]
})
export class UserModule { }
