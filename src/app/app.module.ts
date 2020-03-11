import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { CategoryModule } from './category/category.module';
import { MenuModule } from './menu/menu.module';
import { ProductModule } from './product/product.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { SalesModule } from './sales/sales.module';
import { DeliveryModule } from './delivery/delivery.module';
import { TableModule } from './table/table.module';
import { OrderModule } from './order/order.module';
import { SalesListModule } from './sales-list/sales-list.module';
import { SettingsModule } from './settings/settings.module';
import { SectionModule } from './section/section.module';
import { GeneralSettingsModule } from './general-settings/general-settings.module';
import { SizeModule } from './size/size.module';
import { PaymentTypeModule } from './payment-type/payment-type.module';
import { CashRegisterModule } from './cash-register/cash-register.module';
import { CashFlowsModule } from './cash-flows/cash-flows.module';
import { ArqueoCajaModule } from './arqueo-caja/arqueo-caja.module';
import { ClientModuleModule } from './client-module/client-module.module';
import { ClientModule } from './client/client.module';
import { ClientAccountTransactionsModule } from './client-account-transactions/client-account-transactions.module';
import { SupplierModuleModule } from './supplier-module/supplier-module.module';
import { SupplierModule } from './supplier/supplier.module';
import { SharedModule } from './../shared/shared.module';
import { FileInputModule } from './file-input/file-input.module';

import { AppComponent } from './app.component';
import { CounterComponent } from './counter/counter.component';
import { SelectItemComponent } from './select-item/select-item.component';
import { DailyMenuModule } from './daily-menu/daily-menu.module';
import { StockControlModule } from './stock-control/stock-control.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    SelectItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,    
    CategoryModule,
    DeliveryModule,
    MenuModule,
    ProductModule,
    RestaurantModule,
    SalesModule,
    TableModule,
    OrderModule,
    SalesListModule,
    SettingsModule,
    SectionModule,
    GeneralSettingsModule,
    SizeModule,
    PaymentTypeModule,
    CashRegisterModule,
    CashFlowsModule,
    ArqueoCajaModule,
    ClientModuleModule,
    ClientModule,
    DailyMenuModule,
    StockControlModule,
    ClientAccountTransactionsModule,
    SupplierModuleModule,
    SupplierModule,
    AppRoutingModule,
    SharedModule,
    FileInputModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  schemas: [ NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
