import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { DeliveryComponent } from './delivery.component';

import { ClientService } from '../../shared/services/client.service';
import { DeliveryResolverService } from './delivery-resolver.service';
import { AgmCoreModule } from "@agm/core";

@NgModule({
  imports: [
    RouterModule.forChild([
         
    ]),
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCmsMHnwnV2P6ibYnIqziwd6yM_aw9XCo8',
      libraries: ["places"]
    })     
  ],
  declarations: [
    DeliveryComponent,
  ],
  providers: [ 
    ClientService,
    DeliveryResolverService
  ]
})
export class DeliveryModule { }
