import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddJobComponent } from './add-job/add-job.component';
import { ListOfJobsComponent } from './list-of-jobs/list-of-jobs.component';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'add-job',
      component: AddJobComponent
    },
    {
      path: 'job-list',
      component: ListOfJobsComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
