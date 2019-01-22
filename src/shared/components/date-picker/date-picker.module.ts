import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { DatePickerComponent } from './date-picker.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    DatePickerComponent
  ],
  providers:[
    DatePickerComponent
  ],
  exports: [
    DatePickerComponent
  ]
})
export class DatePickerModule { }
