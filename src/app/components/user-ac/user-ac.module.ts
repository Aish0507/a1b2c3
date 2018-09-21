import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAcRoutingModule } from './user-ac-routing.module';
import { AddUserAcComponent } from './add-user-ac/add-user-ac.component';
import { TableDataComponent } from './table-data/table-data.component';
import { UserAcComponent } from './user-ac.component';
import { ViewUserComponent } from './view-user/view-user.component';
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {TreeviewModule} from '../../../lib/treeview.module';

@NgModule({
  imports: [
    CommonModule,
    UserAcRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    TreeviewModule.forRoot()
  ],
  declarations: [
    AddUserAcComponent,
    UserAcComponent,
    ViewUserComponent,
    TableDataComponent
  ],
  entryComponents: []
})
export class UserAcModule { }
