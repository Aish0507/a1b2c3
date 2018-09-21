import { Model } from './model';
import { User } from './user.model';
import * as _ from 'underscore';
import { API } from './../helpers/api.helper';
import { Util } from './../helpers/util.helper';

export class BUModel extends Model {
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

  static async getAllBUList() {
    const u_id = this.getlocalStorage('User');
    let err, res;
    if (Util.getEnvObj().isApiReady) {
      [err, res] = await Util.to(Util.get('/selfService/' + u_id[0].userId + '/getProjectBU'));
    } else {
      [err, res] = await Util.to(Util.get('/assets/dummyDataJobList.json'));
    }
    if(err) Util.TE(err.message, true);
    if(!res.success) Util.TE(res.message, true);
    return res.data;
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

  static async AddNewBU(buInfo: any) {
    let err, res;
    let dataSet: any;
    dataSet = {
      'projectId': buInfo.projectId,
      'buName': buInfo.buName,
      'buDetails': buInfo.buDetails,
    };
    [err, res] = await Util.to(Util.post('/selfService/addBU', dataSet));
    if(err) Util.TE(err.message, true);
  }
  
  static async updateBU(buInfo: any) {
    let err, res;
    let dataSet: any;
    dataSet = {
      'buName': buInfo.buDetails.buName,
      'buDetails': buInfo.buDetails.buDetails,
      'projectName': buInfo.project.projectName,
    };
    [err, res] = await Util.to(Util.put('/selfService/'+(buInfo.buDetails.buId)+'/updateBU', dataSet));
    if(err) Util.TE(err.message, true);
  }

  
}
