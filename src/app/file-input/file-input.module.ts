import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { FileInputComponent } from '../file-input/file-input.component';
import { FileInputService } from '../../shared/services/file-input.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  exports: [
      FileInputComponent
  ],
  declarations: [
    FileInputComponent    

  ],
  providers: [ 
    FileInputComponent,
    FileInputService,    
  ]
})
export class FileInputModule { }
