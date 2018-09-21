import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAcComponent } from './user-ac.component';
import { AddUserAcComponent } from './add-user-ac/add-user-ac.component';
import {ViewUserComponent} from "./view-user/view-user.component";

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'user-list',
      component: UserAcComponent
    },
    {
      path: 'add-user',
      component: AddUserAcComponent
    },
    {
      path: 'view-user/:id',
      component: ViewUserComponent
    }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAcRoutingModule { }
