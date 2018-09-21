import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApplicationComponent} from "./application/application.component";
import { BuComponent } from './bu/bu.component';
import { ProjectComponent } from './project/project.component';
import { TestCasesComponent } from './test-cases/test-cases.component';
import {FileUploadComponent} from "../upload/file-upload/file-upload.component";
import { ResultUploadComponent } from '../upload/result-upload/result-upload.component';

const routes: Routes = [
{
  path: '',
  children: [{
    path: 'app-list',
    component: ApplicationComponent
  },
  {
    path: '',
    children: [{
      path: 'app-list',
      component: ApplicationComponent
    },
    {
      path: 'bu-list',
      component: BuComponent
    },
    {
      path: 'pro-list',
      component: ProjectComponent
    },
    {
      path: 'tc-list',
      component: TestCasesComponent
    },
    {
      path: 'upload',
      component: FileUploadComponent
     },
     {
      path: 'tc-result',
      component: ResultUploadComponent
     }]
  }
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativeWorkRoutingModule { }
