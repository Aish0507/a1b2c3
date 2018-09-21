import { Injectable } from '@angular/core';
import { DashBoardModel } from '../../../models/dashboard.model';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

/* const MENUITEMS = [
  {
    state: '',
    name: 'HOME',
    type: 'link',
    icon: 'explore'
  },
  {
    state: 'aw',
    name: 'Admin Work',
    type: 'sub',
    icon: 'format_line_spacing',
    children: [
      {state: 'app-list', name: 'Application'},
      {state: 'bu-list', name: 'BU'},
      {state: 'pro-list', name: 'Project'},
      {state: 'tc-list', name: 'Test Case'}
    ]
  },
  {
    state: 'ua',
    name: 'User Access',
    type: 'sub',
    icon: 'supervised_user_circle',
    children: [
      {state: 'user-list', name: 'Users'},
      {state: 'add-user', name: 'NewUser'}
    ]
  },
  {
    state: 'jobs',
    name: 'Jobs',
    type: 'sub',
    icon: 'open_with',
    children: [
      {state: 'add-job', name: 'Add Jobs'},
      {state: 'job-list', name: 'Jobs List'}
    ]
  },
  {
    state: '',
    name: 'Sign Out',
    type: 'other',
    icon: 'exit_to_app',
  }
];
 */
@Injectable()
export class MenuService {
  abcd;
  async getAll() {
    /* this.abcd = await DashBoardModel.getMenu();
     console.log(this.abcd); */
   // return (await DashBoardModel.getMenu());
  }
/*
  add(menu: Menu) {
    MENUITEMS.push(menu);
  } */
}
