import { Model } from './model';
import { User } from './user.model';
import * as _ from 'underscore';
import { API } from './../helpers/api.helper';
import { Util } from './../helpers/util.helper';
import { BUModel } from './bu.model';
import { TestCaseModel } from './test-case.model';

export class DashBoardModel extends Model {
  apiUpdateValues: Array<string> = ['id']; // these are the values that will be sent to the API
  constructor(obj: object) {
    super(obj);
  }
 /*  to(action) {
    return Util.route('/jobs/' + action + '/' + this.id);
  }
  async saveAPI() {
    return API.save(this, '/v1/jobs/' + this.id);
  }
  async removeAPI() {
    return API.remove(this, '/v1/jobs/' + this.id);
  } */
  // Static
  static to(action) {
    return Util.route('/jobs/' + action);
  }

  static async getAllBUList() {
      return (await BUModel.getAllBUList());
  }
  static async getAllProjectsList() {
    return (await BUModel.getAllProjectsList());
  }

  static async getAllAppsList() {
      return (await TestCaseModel.getAllApplications());
  }
  static async getMenu() {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/user/' + u_id[0].userId + '/getMenuBar'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if (err) {
      Util.TE(err.message, true);
    }
    if (!res.success) {
      Util.TE(res.message, true);
    }
    return res.data;
  }
  static async getResultSet() {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/user/' + u_id[0].userId + '/dashboard/getTestCaseResult'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if (err) {
      Util.TE(err.message, true);
    }
    if (!res.success) {
      Util.TE(res.message, true);
    }
    return res.data;
  }
  static async getBuLevelResult(startDate, endDate,  otherData?: any) {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    let dataSet: any;
    dataSet = {
      'startDate': startDate + ' 00:00:00',
      'endDate': endDate + ' 23:59:00'
    };
    if (otherData) {
      dataSet.projectId = otherData.projectId;
    }
    [err, res] = await Util.to(Util.post('/selfService/user/' + u_id[0].userId + '/dashboard/piechart/getBuLevelData', dataSet));
    if (err) {
      Util.TE(err.message, true);
    } else {
      return res.data;
    }
  }
  static async getAppLevelResult(startDate, endDate) {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    let dataSet: any;
    dataSet = {
      'startDate': startDate + ' 00:00:00',
      'endDate': endDate + ' 23:59:00'
    };
    [err, res] = await Util.to(Util.post('/selfService/user/' + u_id[0].userId + '/dashboard/getApplicationResult', dataSet));
    if (err) {
      Util.TE(err.message, true);
    } else {
      return res.data;
    }
  }

  static async getTabularJobsApplicationResults(startDate, endDate, otherData?: any) {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    let dataSet: any;
    dataSet = {
      'startDate': startDate + ' 00:00:00',
      'endDate': endDate + ' 23:59:00'
    };
    if (otherData) {
      dataSet.projectId = otherData.project;
      dataSet.buId = otherData.bu;
      dataSet.applicationId = otherData.app;
      dataSet.environmentId = otherData.env;
    }
    // console.log(dataSet);
    [err, res] = await Util.to(Util.post('/selfService/user/' +
     u_id[0].userId + '/dashboard/jobs/getTabularJobsApplicationResults', dataSet));
    if (err) {
      Util.TE(err.message, true);
    } else {
      return res;
    }
  }
  static async getTargetEnv() {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/' + u_id[0].userId + '/getEnvironments'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if (err) {
      Util.TE(err.message, true);
    }
    if (!res.success) {
      Util.TE(res.message, true);
    }
    return res.data;
  }
  static async getDefectChartData() {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get
        ('/selfService/user/' + u_id[0].userId + '/dashboard/chart/getDefectsLevel'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if (err) {
      Util.TE(err.message, true);
    }
    if (!res.success) {
      Util.TE(res.message, true);
    }
    // console.log(res.data);
    return res.data;
  }
  static async getDefectTableData(startDate, endDate, otherData?: any) {
  let err, res; // get from API
  const u_id = this.getlocalStorage('User');
  let dataSet: any;
  dataSet = {
    'startDate': startDate ,
    'endDate': endDate
  };
  // console.log(otherData);
  if (otherData) {
    dataSet.projectId = otherData;
  }
  // console.log(dataSet);
  [err, res] = await Util.to(Util.post('/selfService/user/' +
   u_id[0].userId + '/dashboard/getTabularDefectsList', dataSet));
  if (err) {
    Util.TE(err.message, true);
  } else {
    return res.data;
  }
}
}
