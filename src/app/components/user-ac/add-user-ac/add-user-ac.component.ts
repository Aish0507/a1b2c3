import { Component, OnInit } from '@angular/core';
import {Util} from '../../../helpers/util.helper';
import {UserAcModel} from "../../../models/user-ac.model";
import {LoaderService} from "../../../services/loader.service";
import {JobsModel} from "../../../models/jobs.model";
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ssp-add-user-ac',
  templateUrl: './add-user-ac.component.html',
  styleUrls: ['./add-user-ac.component.scss']
})
export class AddUserAcComponent implements OnInit {
  newUserObj: any = {};
  isLdapApisuccess: boolean = false;
  jobs: any;
  isNewUserEnable: boolean = false;
  selectedAll: any;
  isDisable: boolean = false;
  userRoleList: any;
  isApplicationEnable: boolean = true;
  isbuEnable: boolean = true;
  applicationDataSet: Array<Object>;
  deleteArrayObj: any = [];
  buDataSet: Array<Object>;
  domain = [
    {value: 'R1-core'},
    {value: 'R3-core'},
    {value: 'R7-core'}
  ];
  userForm = new FormGroup({
    domain: new FormControl('', [Validators.required]),
    lName: new FormControl('', [Validators.required]),
    firstName: new FormControl({value: this.newUserObj.firstName, disabled: true}),
    lastName: new FormControl({value: this.newUserObj.lastName, disabled: true}),
    emailId: new FormControl({value: this.newUserObj.emailId, disabled: true}),
    project: new FormControl('', [Validators.required]),
    bu: new FormControl('', [Validators.required]),
    status: new FormControl(''),
    selectedAll: new FormControl('')
  });
  selectedRole: any;
  constructor(private loaderService: LoaderService) {
    this.newUserObj.domain = this.domain[0].value;
  }

  ngOnInit() {
  }

  async searchUserFromLDap() {
    this.loaderService.display(true);
    let err, res, roleErr;
    const config = {width: '250px', height: '280px', data: { title: 'Alert!', body: 'Please enter Lan Id and domain' }};
    if (this.newUserObj.lName === '' || this.newUserObj.lName === undefined || this.newUserObj.domain === undefined) {
      Util.openDefaultDialog(config);
      this.loaderService.display(false);
    } else {
     const userInfo = {
        'lanId': this.newUserObj.lName,
        'domain': this.newUserObj.domain
      };
      [err, res] = await Util.to(UserAcModel.searchUserFromLdap(userInfo));
      if (!err) {
        // res = this.dummyLdapData;
        // console.log(JSON.stringify(res));
        this.newUserObj.firstName = res.firstName;
        this.newUserObj.lastName = res.lastName;
        this.newUserObj.emailId = res.emailId;
        this.isLdapApisuccess = true;
        // console.log(this.isDisable);
        this.isDisable = true;
        // console.log(this.isDisable);
        [roleErr, this.userRoleList] = await Util.to(UserAcModel.getRolesForUser());
        this.newUserObj.selectedRole = this.userRoleList[1];
        this.jobs = await JobsModel.getAllJobsList();
        this.loaderService.display(false);
      } else {
        const error = {width: '250px', height: '280px', data: { title: '', body: err.message }};
        // Util.openDefaultDialog(error);
        this.loaderService.display(false);
      }
    }
  }

  async fetchAppData(bu_val) {
    this.loaderService.display(true);
    let err;
    this.applicationDataSet = await (JobsModel.getApplicationByBuId(bu_val.value, this.newUserObj.selectedProValue));
    for (let i = 0; i < this.applicationDataSet.length; i++) {
      this.applicationDataSet[i]['status'] = false;
    }
    // [err, this.applicationDataSet] = await Util.to(JobsModel.getApplicationByBuId(bu_val.value));
    this.isApplicationEnable = false;
    if (this.applicationDataSet) {
      this.loaderService.display(false);
    }
    this.isNewUserEnable = true;
  }
  createArrayObj(val) {
    this.deleteArrayObj.push(val);
    this.newUserObj.applicationList = this.deleteArrayObj;
  }
  selectSingleVal(id, bool) {
    if (!bool) {
      this.createArrayObj(id);
    } else {
      this.deleteArrayObj.splice(this.deleteArrayObj.indexOf(id), 1);
    }
  }
  async addNewUser(userObj) {
    this.loaderService.display(true);
    let err, res;
    if (userObj.applicationList !== undefined) {
      // console.log (userObj.applicationList);
      [err, res] = await Util.to(UserAcModel.createNewUser(userObj));
      if (!err) {
        this.loaderService.display(false);
        UserAcModel.to('dashboard/ua/user-list');
      } else {
        this.loaderService.display(false);
        /* if (userObj.applicationList === []) {
          alert('No application selected');
        } */
      }
    } else {
      alert('No application selected');
      this.loaderService.display(false);
    }
  }
  async fetchBuData(projectInfo: any) {
    this.loaderService.display(true);
    let err;
    this.buDataSet = await (JobsModel.getBuByProjectId(projectInfo.value));
    // [err, this.applicationDataSet] = await Util.to(JobsModel.getApplicationByBuId(bu_val.value));
    this.isbuEnable = false;
    if (this.buDataSet) {
      this.loaderService.display(false);
    }
  }
  goBack(uri) {
    UserAcModel.to(uri);
  }
  selectAll() {
    if (this.selectedAll) {
      for (let i = 0; i < this.applicationDataSet.length; i++) {
        this.applicationDataSet[i]['status'] = this.selectedAll;
        this.createArrayObj(this.applicationDataSet[i]);
      }
    } else {
      this.deleteArrayObj = [];
      for (let i = 0; i < this.applicationDataSet.length; i++) {
        this.applicationDataSet[i]['status'] = this.selectedAll;
      }
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.applicationDataSet.every(function (item: any) {
      return item.status === true;
    });
  }
  getInputErrorMessage(input_name: string) {
    let err_message = '';
    if (this.userForm.get(input_name).hasError('required')) {
      if (input_name === 'lName') {
        err_message = 'Lan Id can not be empty';
      } else {
        if (input_name === 'project') {
          err_message = 'You must select project.';
        } else {
          if (input_name === 'bu') {
            err_message = 'You must select bu.';
          } else {
            if (input_name === 'domain') {
              err_message = 'You must select domain.';
            }
          }
        }
      }
    }
    if (this.userForm.get(input_name).hasError('custom')) {
      err_message = this.userForm.get(input_name).getError('custom');
    }

    return err_message;
  }
  resetLanId() {
    this.userForm.reset();
    // this.userForm.controls['domain'].setValue = this.domain[0].value;
    this.newUserObj.domain = this.domain[0].value;
    // console.log(this.newUserObj.domain);
    this.applicationDataSet = null;
    // this.newUserObj.lName = '';
    // this.buDataSet = null;
    this.isDisable = false;
    this.isLdapApisuccess = false;
  }
}
