// import { Model } from 'browser-model';
import { Model } from './model';
import { User } from './user.model';
import * as _ from 'underscore';
import { API } from './../helpers/api.helper';
import { Util } from './../helpers/util.helper';
import { JobsModel } from './jobs.model';
import { ProjectModel } from './project.model';
import { DashBoardModel } from './dashboard.model';

export class TestCaseModel extends Model {
  apiUpdateValues: Array<string> = ['id']; // these are the values that will be sent to the API
  static async getAllProjects() {
    return (await ProjectModel.getAllProjectsList());

  }
  static async getAllApplications() {
    const u_id = this.getlocalStorage('User');
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/' + u_id[0].userId + '/getApplications'));
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
  static async getApplicationByBuId(id: number, pro_id?: number) {
    return (await JobsModel.getApplicationByBuId(id, pro_id));
  }
  static async getTestcasesByApplicationid(appId) {
    const u_id = this.getlocalStorage('User');
    let res;
    res = JobsModel.getTcByAppId(appId);
    return res;

  }
  static async AddNewTC(tcObj: any) {
    let err, res;
    let dataSet: any;
    dataSet = {
      'applicationId': tcObj.applicationId,
      'testcaseName': tcObj.testcaseName,
      'testcaseDescription': tcObj.testcaseDescription,
    };
    [err, res] = await Util.to(Util.post('/selfService/application/addTestcase', dataSet));
    if (err) {
        Util.TE(err.message, true);
    }
  }
  static async updateTC(tcObj: any) {
    let err, res;
    let dataSet: any;
    dataSet = {
      'testcaseName': tcObj.testcaseName,
      'testcaseDescription': tcObj.testcaseDescription
    };
    [err, res] = await Util.to(Util.put('/selfService/application/' + tcObj.testcaseId + '/updateTestcase', dataSet));
    if (err) {
        Util.TE(err.message, true);
    }
  }
  static async uploadTestcasesByAppID(file: any, appId: any) {
    let err, res;
    // console.log(file);
    const u_id = this.getlocalStorage('User');
    let fileData = new FormData();
    fileData.append('file', file, file.name);
    fileData.append('applicationIds', appId);
    fileData = fileData;
    // console.log("fileData", fileData);
    [err, res] = await Util.to(Util.post('/selfService/user/' + u_id[0].userId
    + '/applications/excel/uploadTestcases', fileData, true));
    if (err) {
        Util.TE(err.message, true);
    } else {
      return res;
    }
  }
  static async uploadTestcaseResult(file: any, appId: any, buId: any, projectId: any, env: any) {
    let err, res;
    const u_id = this.getlocalStorage('User');
    const fileData = new FormData();
    fileData.append('file', file, file.name);
    fileData.append('applicationIds', appId);
    fileData.append('buId', buId);
    fileData.append('projectId', projectId);
    fileData.append('targetEnvId', env);
    // console.log(fileData);
    [err, res] = await Util.to(Util.post('/selfService/user/' + u_id[0].userId
    + '/excel/uploadTestcasesResult', fileData, true));
    if (err) {
        Util.TE(err.message, true);
    } else {
      return res;
    }
  }
  static async getTargetEnv() {
    return (await DashBoardModel.getTargetEnv());
  }
}
