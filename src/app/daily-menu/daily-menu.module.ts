import { NgModule } from '@angular/core';
import { DailyMenuListComponent } from './daily-menu-list/daily-menu-list.component';
import { DailyMenuNewComponent } from './daily-menu-new/daily-menu-new.component';
import { DailyMenuModifyComponent } from './daily-menu-modify/daily-menu-modify.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FileInputModule } from '../file-input/file-input.module';
import { DailyMenuService } from '../../shared/services/daily-menu.service';
import { DailyMenuResolverService } from './daily-menu-list/daily-menu-resolver.service';
import { DailyMenuAvailablePipe } from '../../shared/pipes/daily-menu-available.pipe';
import { DailyMenuModifyResolverService } from './daily-menu-modify/daily-menu-modify-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule,
    FileInputModule
  ],
  declarations: [
    DailyMenuListComponent,
    DailyMenuModifyComponent,
    DailyMenuNewComponent,
    DailyMenuAvailablePipe,
  ],
  providers: [ 
    DailyMenuService,
    DailyMenuResolverService,
    DailyMenuModifyResolverService
  ]
})
export class DailyMenuModule { }
