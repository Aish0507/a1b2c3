import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing.module';
import { MaterialModule } from '../../material.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { ListOfJobsComponent } from './list-of-jobs/list-of-jobs.component';
import { AddJobComponent } from './add-job/add-job.component';
import { ListOfTestcasesComponent } from './list-of-testcases/list-of-testcases.component';
import { DailogDatetimeOverviewComponent } from './dailog-datetime-overview/dailog-datetime-overview.component';
import { DailogBuildOverviewComponent } from './dailog-build-overview/dailog-build-overview.component';
import {ToolTipDirective} from "../../_directive/tool-tip.directive";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {SelectDropDownModule} from "ngx-select-dropdown";


@NgModule({
  imports: [
    CommonModule,
    JobsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    NgxMatSelectSearchModule,
    SelectDropDownModule
  ],
  declarations: [
    ListOfJobsComponent,
    AddJobComponent,
    ListOfTestcasesComponent,
    DailogDatetimeOverviewComponent,
    DailogBuildOverviewComponent,
    ToolTipDirective
    ],
  entryComponents: [
    ListOfTestcasesComponent,
    DailogDatetimeOverviewComponent,
    DailogBuildOverviewComponent
  ]
})
export class JobsModule { }
