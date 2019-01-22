import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { SectionNewComponent } from './section-new/section-new.component';
import { SectionEditComponent } from './section-edit/section-edit.component';
import { SectionListComponent } from './section-list/section-list.component';
import { TableListComponent } from '../table/table-list/table-list.component';

import { SectionListResolverService } from './section-list/section-list-resolver.service';
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
    SectionListComponent
  ],
  providers: [ 
    SectionListResolverService,
    SectionService
  ]  
})
export class SectionModule { }
