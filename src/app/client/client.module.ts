import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { ClientListComponent } from './client-list/client-list.component';
import { ClientNewComponent } from './client-new/client-new.component';
import { ClientEditComponent } from './client-edit/client-edit.component';

import { ClientService } from '../../shared/services/client.service';
import { ClientResolverService } from './client-list/client-resolver.service';
import { ClientEditResolverService } from './client-edit/client-edit-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    ClientListComponent, 
    ClientNewComponent, 
    ClientEditComponent
  ],
  providers: [
    ClientService,
    ClientResolverService,
    ClientEditResolverService
  ]
})
export class ClientModule { }
