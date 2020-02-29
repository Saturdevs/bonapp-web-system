import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { StockControlComponent } from './stock-control.component';
import { ProductResolverService } from '../product/product-list/product-resolver.service';
import { StockControlModifyComponent } from '../stock-control/stock-control-modify/stock-control-modify.component'

@NgModule({
  imports: [
    
    RouterModule.forChild([
    ]),
    SharedModule
  ],
  declarations: [
    StockControlComponent,
    StockControlModifyComponent
  ],
  providers: [
    ProductResolverService
  ]
})
export class StockControlModule { }
