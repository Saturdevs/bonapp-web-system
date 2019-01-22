import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { MenuComponent } from './menu.component';
import { MenuNewComponent } from './menu-new/menu-new.component';
import { MenuModifyComponent } from './menu-modify/menu-modify.component';

import { MenuService } from '../../shared/services/menu.service';
import { MenuGuardService } from './menu-guard.service';
import { MenuModifyResolverService } from './menu-modify/menu-modify-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
         
    ]),
    SharedModule
  ],
  declarations: [
    MenuComponent,
    MenuModifyComponent,
    MenuNewComponent
  ],
  providers: [ 
    MenuService,
    MenuGuardService,
    MenuModifyResolverService
  ]
})
export class MenuModule { }
