import { Component, NgZone, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { MenuService } from './menu.service';

import { TranslateService } from '@ngx-translate/core';
import { User } from '../../../models/user.model';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { DashBoardModel } from '../../../models/dashboard.model';

@Component({
  selector: 'app-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
    <mat-nav-list appAccordion class="navigation">
      <mat-list-item appAccordionLink *ngFor="let menuitem of MenuList" group="{{menuitem.state}}"> 
        <a appAccordionToggle class="relative" [routerLink]="['/', menuitem.state]" *ngIf="menuitem.type === 'link'">
         <!-- <mat-icon>{{ menuitem.icon }}</mat-icon>  -->
          <a><img class="icon" src="/assets/images/{{menuitem.icon}}.png"></a>
          <span>{{ menuitem.name | translate }}</span>
          <span fxFlex></span>
          <span class="menu-badge mat-{{ badge.type }}" *ngFor="let badge of menuitem.badge">{{ badge.value }}</span>
        </a>
        <a appAccordionToggle class="relative" href="javascript:;" *ngIf="menuitem.type === 'sub'">
        <!-- <mat-icon>{{ menuitem.icon }}</mat-icon> -->
        <a><img class="icon" src="/assets/images/{{menuitem.icon}}.png"></a>
          <span>{{ menuitem.name | translate }}</span>
          <span fxFlex></span>
          <span class="menu-badge mat-{{ badge.type }}" *ngFor="let badge of menuitem.badge">{{ badge.value }}</span>
          <!--<mat-icon class="menu-caret">arrow_drop_down</mat-icon> -->
          <img style="width:10px; height:10px" class="menu-caret custom-img-style" src="/assets/images/down.png">
        </a>
        <a appAccordionToggle class="relative" href="javascript:;" *ngIf="menuitem.type === 'other'" (click)=onLogout() >
        <!-- <mat-icon>{{ menuitem.icon }}</mat-icon> -->
        <a><img class="icon" src="/assets/images/{{menuitem.icon}}.png"></a>
          <span>{{ menuitem.name | translate }}</span>
          <span fxFlex></span>
          <span class="menu-badge mat-{{ badge.type }}" *ngFor="let badge of menuitem.badge">{{ badge.value }}</span>
        </a>
        <mat-nav-list class="sub-menu" *ngIf="menuitem.type === 'sub'">
          <mat-list-item *ngFor="let childitem of menuitem.children" routerLinkActive="open">
            <a [routerLink]="['/dashboard', menuitem.state, childitem.state ]"
            class="relative">{{ childitem.name | translate }}</a>
          </mat-list-item>
        </mat-nav-list>
      </mat-list-item>
    </mat-nav-list>`,
  providers: [MenuService]
})
export class MenuComponent implements OnInit {
  currentLang = 'en';
  user = User.Auth();
  MenuList: any = [];
  async ngOnInit() {
    this.getMenuList();
  }
  constructor(
    public menuService: MenuService,
    public translate: TranslateService) {
  }
  async getMenuList() {
    this.MenuList = await DashBoardModel.getMenu();
  }
/*
  addMenuItem(): void {
    this.menuService.add({
      state: 'menu',
      name: 'MENU',
      type: 'sub',
      icon: 'trending_flat',
      children: [
        {state: 'menu', name: 'MENU'},
        {state: 'timeline', name: 'MENU'}
      ]
    });
  } */
  onLogout() {
    if (User.Auth()) {
      this.user.logout();
    }
  }
}
