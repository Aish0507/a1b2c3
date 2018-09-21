import { Model } from './model';
import { User } from './user.model';
import * as _ from 'underscore';
import { API } from './../helpers/api.helper';
import { Util } from './../helpers/util.helper';

export class ApplicationModel extends Model {
  apiUpdateValues: Array<string> = ['id']; // these are the values that will be sent to the API
  id;
  name;
  constructor(obj: object){
    super(obj);
  }
  to(action) {
    return Util.route('/jobs/' + action + '/' + this.id);
  }
  async saveAPI(){
    return API.save(this, '/v1/jobs/' + this.id);
  }
  async removeAPI(){
    return API.remove(this, '/v1/jobs/' + this.id);
  }
  //Static
  static to(action){
    return Util.route('/jobs/' + action);
  }

  static async getAllApplicationList() {
    const u_id = this.getlocalStorage('User');
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/getProjectBuApplications'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res.data;
  }
  static async getAllApplicationTypeList() {
    //const u_id = this.getlocalStorage('User');
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/getAllJobTypes'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res.data;
    
  }
  static async getAllBUList() {
    const u_id = this.getlocalStorage('User');
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/' + u_id[0].userId + '/getAllBu'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res.data;
  }

  static async AddNewApplication(appInfo: any) {
  //  console.log(appInfo);
    let err, res;
    let dataSet: any;
    dataSet = {
      'projectId': appInfo.projectId,
      'buId':appInfo.buId,
      'applicationName':appInfo.appName,
      // 'globalAppId':appInfo.globalAppId,
      'applicationType':appInfo.appType.jobName,
      'applicationDetails':appInfo.appDetails,
      'jobId':appInfo.appType.jobId
      
    };
    // console.log(dataSet);
    [err, res] = await Util.to(Util.post('/selfService/addApplication', dataSet));
    if(err) Util.TE(err.message, true);
  }
  
  static async updateApplication(appInfo: any) {
    let err, res;
    let dataSet: any;
    dataSet = {
      'applicationType':appInfo.applicationType,
      'applicationDetails':appInfo.applicationDetails
    };
    [err, res] = await Util.to(Util.put('/selfService/'+appInfo.applicationId+'/updateApplication', dataSet));
    if(err) Util.TE(err.message, true);
   // console.log(appInfo);
  }

  
}
