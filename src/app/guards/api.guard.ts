import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { User } from './../models/user.model';
import { Util } from './../helpers/util.helper';

@Injectable()
export class ApiGuard implements CanActivate {
  constructor() {}
  canActivate(): boolean {
    if (User.Auth()) {
      return true;
    } else {
      Util.route('/session/signin');
      return false;
    }
  }
}
