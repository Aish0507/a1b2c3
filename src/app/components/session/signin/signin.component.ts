import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../helpers/util.helper';
import { User } from './../../../models/user.model';
import {LoaderService} from '../../../services/loader.service';

export interface UserLoginInfo {
  unique: string,
  password?: string,
  confirm_password?: string,
  domain: any
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  user_info: UserLoginInfo = <UserLoginInfo>{ };
  title: string = 'Login';
  register: boolean = false;
  user:any;
  domains = [
    {value: 'R1-core'},
    {value: 'R3-core'},
    {value: 'R7-core'}
  ];
  loginForm = new FormGroup({
    unique: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    domain: new FormControl(this.domains[0].value, [Validators.required])
  });
  constructor(private fb: FormBuilder,
              private router: Router,
              private loaderService: LoaderService) {
    if (User.Auth()) {
      Util.route('/dashboard');
    }
    this.user_info.domain = this.domains[0].value;
  }
  getInputErrorMessage(input_name: string) {
    let err_message: string = '';
    if (this.loginForm.get(input_name).hasError('required') &&
      this.loginForm.get(input_name).touched) {
      if (input_name == 'unique') {
        err_message = 'username can not be empty.';
      } else {
        if (input_name == 'password') {
          err_message = 'password can not be empty.';
        } else {
          err_message = 'You must select a domain.';
        }
      }
    }
    if (this.loginForm.get(input_name).hasError('custom')) {
      err_message = this.loginForm.get(input_name).getError('custom');
    }

    return err_message;
  }

  throwInputError(input_name: string, message: string) {
    this.loginForm.get(input_name).setErrors({custom: message});
  }

  ngOnInit() {
  }

  onSubmit() {
    var data = {
      username : this.user_info.unique,
      password : btoa(this.user_info.password),
      domain: this.user_info.domain
    };
    this.register === false ? this.login(data) : this.create(data);
    return;
    // this.router.navigate ( [ '/dashboard' ] );
  }
  onTryLogin() {
    this.register = false;
    this.title = 'Log in / Register';
    let unique = this.user_info.unique;
    this.loginForm.reset({unique:unique});
    this.loginForm.setErrors(null);
  }

  async login(data: Object) {
    this.loaderService.display(true);
    let err;
    [err, this.user] = await Util.to(User.LoginReg(data));
    if (err) {
      if (err.message.includes('password') || err.message.includes('Password')) {
        this.throwInputError('password', err.message);
      } else if (err.message === 'Not registered') {
        this.title = 'Please Register';
        this.register = true;
      } else {
        this.throwInputError('unique', err.message);
      }
      this.loaderService.display(false);
      // this.loginForm.reset();
      this.loginForm.controls['unique'].reset();
      this.loginForm.controls['password'].reset();
      this.user_info.domain = this.domains[0].value;
      return;
    }
    this.loaderService.display(false);
    return this.user.to('/dashboard');
  }

  async create(data: Object) {
    if (this.user_info.confirm_password != this.user_info.password) {
      this.throwInputError('confirmPassword', 'Passwords do not match');
      return;
    }

    let err;
    [err, this.user] = await Util.to(User.CreateAccount(data));
    if(err) Util.TE(err);
    return this.user.to('update');
  }
  getCssBasedOnBrowser() {
    let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    if (!isIEOrEdge) {
      return {
        'margin-top': '-22%'
      };
    } else {
      return {

      }
    }
  }

}
