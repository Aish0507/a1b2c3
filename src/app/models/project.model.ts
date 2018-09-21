// import { Model } from 'browser-model';
import { Model } from './model';
import { User } from './user.model';
import * as _ from 'underscore';
import { API } from './../helpers/api.helper';
import { Util } from './../helpers/util.helper';

export class ProjectModel extends Model {
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

  static async getAllProjectsList() {
    const u_id = this.getlocalStorage('User');
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/' + u_id[0].userId + '/getProjects'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }

    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res.data;
  }
  static async AddNewProject(projectInfo: any) {
    let err, res;
    let dataSet: any;
    dataSet = {
      'projectName': projectInfo.projectName,
      'projectDetails': projectInfo.projectDescription,
      'projectStatus': projectInfo.projectStatus,
    };
    [err, res] = await Util.to(Util.post('/selfService/add/project', dataSet));
    if(err) Util.TE(err.message, true);
    
  }
  static async updateProject(projectInfo: any) {
    let err, res;
    let dataSet: any;
    dataSet = {
      'projectDetails': projectInfo.projectDetails,
    };
    [err, res] = await Util.to(Util.put('/selfService/update/'+(projectInfo.projectId)+'/project', dataSet));
    if(err) Util.TE(err.message, true);
    
    //console.log(projectInfo);
  }

  
}
