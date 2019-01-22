import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { SizeListComponent } from './size-list/size-list.component';
import { SizeNewComponent } from './size-new/size-new.component';
import { SizeEditComponent } from './size-edit/size-edit.component';

import { SizeService } from '../../shared/services/size.service';
import { SizeResolverService } from './size-list/size-resolver.service';
import { SizeEditResolverService } from './size-edit/size-edit-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    SizeListComponent, 
    SizeNewComponent, 
    SizeEditComponent
  ],
  providers: [
    SizeService,
    SizeResolverService,
    SizeEditResolverService
  ]
})
export class SizeModule { }
