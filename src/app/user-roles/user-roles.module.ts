import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { UserRolesListComponent } from './user-roles-list/user-roles-list.component';
import { UserRolesNewComponent } from './user-roles-new/user-roles-new.component';
import { UserRolesEditComponent } from './user-roles-edit/user-roles-edit.component';
import { UserRolesResolverService } from './user-roles-list/user-roles-resolver.service';
import { UserRolesEditResolverService } from './user-roles-edit/user-roles-edit-resolver.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      
    ])
  ],
  declarations: [
    UserRolesListComponent,
    UserRolesNewComponent,
    UserRolesEditComponent
  ],
  providers: [
    UserRolesResolverService,
    UserRolesEditResolverService
  ]
})
export class UserRolesModule { }
