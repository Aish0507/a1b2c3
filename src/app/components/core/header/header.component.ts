import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

import * as screenfull from 'screenfull';
import { User } from "../../../models/user.model";
import { Util } from "../../../helpers/util.helper";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, // this means it is not active checking for data changes
})
export class HeaderComponent implements OnInit {
  user: User;
  env;
  fullName: string;
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleNotificationSidenav = new EventEmitter<void>();

  constructor(private cd: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.user = User.Auth();
    this.fullName = this.user.full_name;
    this.env = Util.env;
    User.on(['auth', 'saveApi'], (auth_state) => {// data will be different depending on which event was emitted
      console.log('the user has:', auth_state);
      this.user = User.Auth();
      this.cd.markForCheck(); // this makes the view check for updates once
    });
    console.log(this.user.firstName);
  }

  fullScreenToggle(): void {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
  onLogout() {
    if (User.Auth()) this.user.logout();
  }
}
