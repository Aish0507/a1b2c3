// import { Model } from 'browser-model';
import { Model } from './model';
import * as _ from 'underscore';
import * as jwt_decode from 'jwt-decode';
// interfaces
import { LoginInfo } from './../interfaces/login-info';
import { API } from './../helpers/api.helper';
import { Util } from './../helpers/util.helper';

export class User extends Model {
  apiUpdateValues: Array<string> = ['emailId', 'phone', 'firstName', 'lastName', 'role']; // these are the values that will be sent to the API
  userId;
  firstName;
  lastName;
  auth;
  token;
  emailId;
  phone;
  role;
  exp;
  static SCHEMA = {
    userId: {type: 'string', primary: true}, // this means every time you make a new object you must give it a _id
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    emailId: {type: 'string'},
    phone: {type: 'string'},
    auth: {type: 'boolean'},
    role: {type: 'any'},
    token: {type: 'string'},
    exp: {type: 'string'}
  };

  constructor(obj: object) {
    super(obj);
  }

  set full_name(name: string) {
    if (name){
      let split = name.split(' ');
      this.firstName = split[0];
      if (split[1]) this.lastName = split[1];
    } else {
      this.firstName = '';
      this.lastName = '';
    }
  }

  get full_name(){
    let full_name = '';
    if (this.firstName) full_name = `${this.firstName}`;
    if (this.lastName) full_name = `${full_name} ${this.lastName}`;
    return full_name;
  }


  logout() {
    this.remove();
    localStorage.clear(); // remove all data in storage
    Util.route('/session/signin');
    this.emit(['logout', 'auth'], 'logout', true);
  }

  async saveAPI(){
    return API.save(this, '/api/v1/users');
  }

  to(action) {
    // return Util.route('/jobs/' + action);
    return Util.route(action);
  }

  parseToken(){
    return jwt_decode(this.token);
  }

  // ************************************
  // ********* STATIC METHODS ***********
  // ************************************

  static Auth(){// Grabs currently authenticated user
    let user:User = <User> this.findOne({auth:true});
    if (user) {
      let parse = user.parseToken();

      let cur_time_date = new Date();
      let cur_time = cur_time_date.getTime()/1000;
      let time = this.getlocalStorage('User');
      // console.log(cur_time, exp[0].exp);
      // Note - if want to check that token is exp or not then use below comment
      if (cur_time >= time[0].exp) {// get the users token expiration time if it is up log them out
        user.logout();
        return null;
      }
    }

    return user;
  }

  static Login(info: LoginInfo){
    let user_info: any = info.user.data;
    user_info.auth  = true;
    user_info.token = info.token;
    let cur_time_date = new Date();
    let cur_time = cur_time_date.getTime() / 1000;
    user_info.exp = cur_time + 2000;
    let user = <User> User.create(user_info);
    user.emit(['login', 'auth'], 'login', true);
    return user;
  }

  static async LoginReg(data: Object){
    let res: any;
    let err;
    if (Util.getEnvObj().isApiReady) {
      // [err, res] = await Util.to(Util.post('/api/v1/users/login', data));
      [err, res] = await Util.to(Util.post('/selfService/login', data));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyData.json'));
    }
    console.log(err);
    if(err) Util.TE(err.message ? 'Internal server error / Service not available' : err, true);

    if(!res.success) Util.TE(res.message, true);
    res.token = Util.getEnvObj().token;
    var login_info: LoginInfo = {
      token: res.token,
      user: res,
    };

    let user = this.Login(login_info);
    return user;
  }

  static async CreateAccount(data:Object){
    let err, res:any;
    [err, res] = await Util.to(Util.post('/api/v1/users', data));

    if(err) Util.TE(err, true);
    if(!res.success) Util.TE(res.error, true);

    var login_info: LoginInfo = {
      token: res.token,
      user: res.user,
    };

    let user = this.Login(login_info);
    return user;
  }
}
