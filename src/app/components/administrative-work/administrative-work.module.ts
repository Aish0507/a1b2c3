import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativeWorkRoutingModule } from './administrative-work-routing.module';
import {ApplicationComponent} from './application/application.component';
import {AddApplicationComponent} from './application/add-application/add-application.component';
import {UpdateApplicationComponent} from './application/update-application/update-application.component';
import {MaterialModule} from "../../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { BuComponent } from './bu/bu.component';
import { AddBuComponent } from './bu/add-bu/add-bu.component';
import { UpdateBuComponent } from './bu/update-bu/update-bu.component';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { UpdateProjectComponent } from './project/update-project/update-project.component';
import { ProjectComponent } from './project/project.component';
import { TestCasesComponent } from './test-cases/test-cases.component';
import { AddTestCaseComponent } from './test-cases/add-test-case/add-test-case.component';
import { UpdateTestCaseComponent } from './test-cases/update-test-case/update-test-case.component';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import {FileUploadComponent} from "../upload/file-upload/file-upload.component";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import { ResultUploadComponent } from '../upload/result-upload/result-upload.component';

@NgModule({
  imports: [
    CommonModule,
    AdministrativeWorkRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    FileUploadModule,
    NgxMatSelectSearchModule,
  ],
  declarations: [
    ApplicationComponent,
    AddApplicationComponent,
    UpdateApplicationComponent,
    BuComponent,
    AddBuComponent,
    UpdateBuComponent,
    ProjectComponent,
    AddProjectComponent,
    UpdateProjectComponent,
    TestCasesComponent,
    AddTestCaseComponent,
    UpdateTestCaseComponent,
    FileUploadComponent,
    ResultUploadComponent
  ],
  entryComponents: [
    AddApplicationComponent,
    UpdateApplicationComponent,
    AddBuComponent,
    UpdateBuComponent,
    AddProjectComponent,
    UpdateProjectComponent,
    AddTestCaseComponent,
    UpdateTestCaseComponent
  ]
})
export class AdministrativeWorkModule { }
