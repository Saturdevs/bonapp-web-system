import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { SectionNewComponent } from './section-new/section-new.component';
import { SectionEditComponent } from './section-edit/section-edit.component';
import { SectionListComponent } from './section-list/section-list.component';
import { SectionListConfigComponent } from './section-list-config/section-list-config.component';
import { TableListComponent } from '../table/table-list/table-list.component';

import { SectionListResolverService } from './section-list/section-list-resolver.service';
import { SectionEditResolverService } from './section-edit/section-edit-resolver.service';
import { TableListResolverService } from '../table/table-list/table-list-resolver.service';
import { SectionService } from '../../shared/services/section.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      
    ])
  ],
  declarations: [
    SectionNewComponent, 
    SectionEditComponent, 
    SectionListComponent,
    SectionListConfigComponent
  ],
  providers: [ 
    SectionListResolverService,
    SectionService,
    SectionEditResolverService
  ]  
})
export class SectionModule { }
