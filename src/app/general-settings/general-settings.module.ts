import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { GeneralSettingsComponent } from './general-settings.component';

@NgModule({
  imports: [ 
    RouterModule.forChild([  
    ]),
    SharedModule
  ],
  declarations: [GeneralSettingsComponent]
})
export class GeneralSettingsModule { }
