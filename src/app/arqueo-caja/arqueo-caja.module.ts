import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { ArqueoCajaListComponent } from './arqueo-caja-list/arqueo-caja-list.component';
import { ArqueoCajaNewComponent } from './arqueo-caja-new/arqueo-caja-new.component';
import { ArqueoCajaEditComponent } from './arqueo-caja-edit/arqueo-caja-edit.component';

import { ArqueoCajaService } from '../../shared/index';
import { ArqueoCajaResolverService } from './arqueo-caja-list/arqueo-caja-resolver.service';
import { ArqueoCajaEditResolverService } from './arqueo-caja-edit/arqueo-caja-edit-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    ArqueoCajaListComponent, 
    ArqueoCajaNewComponent, 
    ArqueoCajaEditComponent
  ],
  providers: [
    ArqueoCajaService,
    ArqueoCajaResolverService,
    ArqueoCajaEditResolverService
  ]
})
export class ArqueoCajaModule { }
