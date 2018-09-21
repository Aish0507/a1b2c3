// import { Model } from 'browser-model';
import { Model } from './model';
import * as _ from 'underscore';
import { API } from './../helpers/api.helper';
import { Util } from './../helpers/util.helper';

export class UserAcModel extends Model {
  apiUpdateValues: Array<string> = ['id']; // these are the values that will be sent to the API
  id;
  name;
  constructor(obj: object) {
    super(obj);
  }

  // Static
  static to(action) {
    return Util.route(action);
  }

  static async getAllUserList() {
    const u_id = this.getlocalStorage('User');
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/user/' + u_id[0].userId + '/getAllUsers'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }

    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res.data;
  }

  static async createNewUser(userInfo: any) {
    let err, res;
    let dataSet: any;
    dataSet = {
      'lanId': userInfo.lName,
      'firstName': userInfo.firstName,
      'lastName': userInfo.lastName,
      'emailId': userInfo.emailId,
      'roleId': userInfo.selectedRole.roleId
    };
    [err, res] = await Util.to(Util.post('/selfService/add/newUser', dataSet));
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    // ToDo - need to check undefined value if user not select data
    if (userInfo.selectedRole.roleType === 'USER') {
      this.storeApplicationDetail(res.data.userId, userInfo, false);
    }
  }

  static async searchUserFromLdap(userInfo: any) {
    let err, res;
    console.log(userInfo);
    [err, res] = await Util.to(Util.post('/selfService/searchUser', {'username': userInfo.lanId, 'domain': userInfo.domain} ));
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res.data;
  }
  static async getApplicationDetailsByUserId(u_id) {
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      // [err, res] = await Util.to(Util.get('/selfService/user/' + u_id + '/getApplicationDetails'));
      [err, res] = await Util.to(Util.get('/selfService/user/' + u_id + '/getUserProjectBuAppDetails'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }

    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res.data;
  }
  static async storeApplicationDetail(user_id, userInfo, isUpdate?: boolean) {
    let error, response;
    let dataSetForApp: any;
    let apiUrl: any;
    dataSetForApp = {
      'userId': user_id,
      'projectId': userInfo.selectedProValue,
      'buId': userInfo.selectedBuValue,
      'applicationId': userInfo.applicationList
    };
    apiUrl = isUpdate ?  '/selfService/add/user/applicationDetail' : '/selfService/update/user/' + user_id + '/applicationDetail';
    [error, response] = await Util.to(Util.post(apiUrl, dataSetForApp));
    if(error) Util.TE(error.message, true);
    if(!response.success) Util.TE(response.message, true);
    return response;
  }
  static async removeApplicationDetailByAppId(appObj) {
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.delete('/selfService/delete/user/' + appObj.userId + '/applicationDetail', appObj));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res;
  }

  static async UpdateRoleType(roleId: any, user_id: any, status: any) {
    let err, res;
    let roleTypeData: any;
    roleTypeData = {
        'userId': user_id,
        'roleId': roleId,
        'status': status
    };
    // console.log(roleTypeData);
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.post('/selfService/updateUserRole', roleTypeData));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if (err) { Util.TE(err.message, true); }
    if (!res.success) { Util.TE(res.message, true); }
    return res.data;
  }
  static async removeUser(user_id) {
    console.log('user id' + user_id);
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.delete('/selfService/user/' + user_id + '/deleteUser'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if (err) {
      Util.TE(err.message, true);
    }
    if (!res.success) {
      Util.TE(res.message, true);
    }
    return res;
  }
  static async getRolesForUser() {
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      // [err, res] = await Util.to(Util.get('/selfService/user/' + u_id + '/getApplicationDetails'));
      [err, res] = await Util.to(Util.get('/selfService/getRoles'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res.data;
  }
  to(action?: any) {
    return Util.route('/user-ac' + action);
  }
  async removeAPI() {
    return API.remove(this, '/user-ac/' + this.id);
  }
}
