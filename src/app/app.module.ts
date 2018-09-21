import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AgmCoreModule } from '@agm/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { FlexLayoutModule } from '@angular/flex-layout';
import {BidiModule} from '@angular/cdk/bidi';

import {
  MenuComponent,
  HeaderComponent,
  SidebarComponent,
  OptionsComponent,
  AdminLayoutComponent,
  AuthLayoutComponent,
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective} from './components/core';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import {LoaderService} from './services/loader.service';
import {HttpModule} from '@angular/http';
import {MaterialModule} from './material.module';
import {DialogDefaultComponent} from './components/dialogs/dialog-default/dialog-default.component';
import {DialogRemoveComponent} from './components/dialogs/dialog-remove/dialog-remove.component';
import { UtilService } from './services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { ApiGuard } from './guards/api.guard';
import {ReadMoreComponent} from './components/read-more/read-more.component';
import {DataStorageService} from './services/data-storage.service';
import { ToolTipDirective } from './_directive/tool-tip.directive';
import {DataTableModule} from './data-table/index';
import {SelectDropDownModule} from "ngx-select-dropdown";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    OptionsComponent,
    MenuComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    DialogDefaultComponent,
    DialogRemoveComponent,
    ReadMoreComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {useHash: true}),
    FormsModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    LoadingBarRouterModule,
    MaterialModule,
    FlexLayoutModule,
    BidiModule,
    AmazingTimePickerModule,
    AgmCoreModule.forRoot({apiKey: 'YOURAPIKEY'}),
    PerfectScrollbarModule
  ],
  entryComponents: [
    DialogDefaultComponent,
    DialogRemoveComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    LoaderService,
    UtilService,
    CookieService,
    ApiGuard,
    DataStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 constructor(injector: Injector) {
    AppInjector = injector;
  }
}
export let AppInjector: Injector;
