import { Routes } from '@angular/router';

import { AdminLayoutComponent, AuthLayoutComponent } from './components/core';
import {ApiGuard} from "./guards/api.guard";

export const AppRoutes: Routes = [
  { path: '',
    redirectTo: '/session/signin',
    pathMatch: 'full'
  },
  {
  path: 'dashboard',
  component: AdminLayoutComponent,
  children: [{
    path: '',
    loadChildren: './components/dashboard/dashboard.module#DashboardModule',
    canActivate: [ApiGuard]
  },
    {
    path: 'tables',
    loadChildren: './components/tables/tables.module#TablesModule'
  },
    {
      path: 'aw',
      loadChildren: './components/administrative-work/administrative-work.module#AdministrativeWorkModule',
      canActivate: [ApiGuard]
    },
    {
      path: 'ua',
      loadChildren: './components/user-ac/user-ac.module#UserAcModule',
      canActivate: [ApiGuard]
    },
    {
      path: 'jobs',
      loadChildren: './components/jobs/jobs.module#JobsModule',
      canActivate: [ApiGuard]
    }]
}, {
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: 'session',
    loadChildren: './components/session/session.module#SessionModule'
  }]
}, {
  path: '**',
  redirectTo: 'session/404'
}];

