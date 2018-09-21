// import { Model } from 'browser-model';
import { Model } from './model';
import { User } from './user.model';
import * as _ from 'underscore';
import { API } from './../helpers/api.helper';
import { Util } from './../helpers/util.helper';
import { BUModel } from './bu.model';
import { TestCaseModel } from './test-case.model';

export class JobsModel extends Model {
  apiUpdateValues: Array<string> = ['id']; // these are the values that will be sent to the API
  id;
  name;
  constructor(obj: object) {
    super(obj);
  }
  static to(action) {
    return Util.route(action);
  }

  static async getAllJobsList() {
    const u_id = this.getlocalStorage('User');
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/' + u_id[0].userId + '/getProjects'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if (err) {
      Util.TE(err.message, true);
    }
    if (!res.success) {Util.TE(res.message, true);}
    return res.data;

  }

  static resCreate(res_jobs) { // create jobs instance from a jobs response
    let jobs = this.findById(res_jobs.id);
    if (jobs) {
      return jobs;
    }
    const jobs_info = res_jobs;
    jobs_info.id = res_jobs.id;

    jobs_info.users = res_jobs.users;

    jobs = this.create(jobs_info);
    return jobs;
  }

  static async CreateAPI(jobsInfo: any) {
    let err, res;
    [err, res] = await Util.to(Util.post('/v1/jobs', jobsInfo));
    if (err) {
      Util.TE(err.message, true);
    }
    if (!res.success) {
      Util.TE(res.message, true);
    }
    const jobs = this.resCreate(res.jobs);
    jobs.emit(['newly-created'], jobsInfo, true);
    return jobs;
  }

  static async getApplicationByBuId(id: number, pro_id?: number) {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    if (Util.getEnvObj().isApiReady) {
    [err, res] = await Util.to(Util.get('/selfService/' + u_id[0].userId + '/project/' + pro_id + '/bu/' + id + '/getApplications'));
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

  static async getTcByAppId(id: number) {
    let err, res; // get from API
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/application/' + id + '/getTestcases'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if (err) {
      Util.TE(err.message, true);
    }
    if (!res.success) {
      Util.TE(res.error, true);
    }
    return res.data;
  }
  static async getBuByProjectId(id: number) {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/' + u_id[0].userId + '/project/' + id + '/getBU'));
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

  static async getJobDetails(val: any) {
    let err, res; // get from API
    const u_id = this.getlocalStorage('User');
    let filterData;
    filterData = {
      'startDate': val.startDate + ' 00:00:00',
      'endDate': val.endDate + ' 23:59:00',
      'projectId': val.selectedProValue,
      'applicationId': val.selectedAppValue,
      'buId': val.selectedBuValue,
    };
    // console.log(filterData);
    if (Util.getEnvObj().isApiReady) {
      // [err, res] = await Util.to(Util.get('/selfService/user/' + u_id[0].userId + '/getJobList'));
       [err, res] = await Util.to(Util.post('/selfService/user/' + u_id[0].userId + '/getJobList', filterData));

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

  static async getAllBUList() {
    return (await BUModel.getAllBUList());
  }
  static async getAllProjectsList() {
  return (await BUModel.getAllProjectsList());
  }

  static async getAllAppsList() {
    return (await TestCaseModel.getAllApplications());
  }

  static async getBuildDetails(jobs: any, dateTime: any) {
    let err, res;
    const u_id = this.getlocalStorage('User');
    const dataSet: any = [];
    let tc: any = [];
    let testcaseId: any;
    for (let i = 0 ; i < jobs.length ; i++) {
      for (let j = 0 ; j < jobs[i].data.length; j++) {
        tc.push({
          'testcaseId': jobs[i].data[j].testcaseId
        });
      }
        dataSet.push(
          {
            'applicationId': jobs[i].selectedAppValue.applicationId,
            'buId': jobs[i].selectedAppValue.bu.buId,
            'projectId': jobs[i].selectedProValue.projectId,
            'targetEnvId': dateTime.selectedEnvValue,
            'scheduledDate': dateTime.date,
            'scheduledTime': dateTime.time,
            'buildExecutionName': dateTime.buildName,
            'testcaseIds': tc
          }
        );
        tc = [];
    }
  //  console.log(JSON.stringify(dataSet));
  if (Util.getEnvObj().isApiReady) {
    [err, res] = await Util.to(Util.post('/selfService/user/' + u_id[0].userId + '/scheduleBuilds', dataSet));
  } else {
    [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
  }
  if (err) {
     Util.TE(err.message, true);
    }
  }

  static async stopScheduledJob(build_id: any) {
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/build/' + build_id + '/stopScheduledBuild'));
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
  to(action) {
    return Util.route('/jobs/' + action + '/' + this.id);
  }
  async saveAPI() {
    return API.save(this, '/v1/jobs/' + this.id);
  }
  async removeAPI() {
    return API.remove(this, '/v1/jobs/' + this.id);
  }
}
