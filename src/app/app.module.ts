import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

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
import { JwtInterceptor } from '../shared/helpers/jwt.interceptor';
import { ErrorInterceptor } from '../shared/helpers/error.interceptor';
import { LoginModule } from './login/login.module';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserNewComponent } from './user/user-new/user-new.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserModule } from './user/user.module';
import { UserRolesModule } from './user-roles/user-roles.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
    UserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    LoginModule,
    UserRolesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]        
      },
      defaultLanguage: 'es'      
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
