import {Component, Inject, Injector, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LoaderService} from '../../../services/loader.service';
import {JobsModel} from '../../../models/jobs.model';
import {UserAcModel} from '../../../models/user-ac.model';
import {UtilService} from '../../../services/util.service';
import * as _ from 'lodash';
import {TreeviewComponent} from '../../../../lib/treeview.component';
import {TreeviewItem} from '../../../../lib/treeview-item';
import {TreeviewHelper} from '../../../../lib/treeview-helper';
import {DownlineTreeviewItem} from '../../../../lib/treeview-event-parser';
import {Util} from '../../../helpers/util.helper';
import {DataStorageService} from "../../../services/data-storage.service";


@Component({
  selector: 'ssp-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  registeredUserObj: any = {};
  jobs: any;
  buDataSet: any;
  isbuEnable: boolean = false;
  applicationDataSet: any;
  isApplicationEnable: boolean = false;
  deleteArrayObj: any = [];
  @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
  items: TreeviewItem[];
  rows: string[];
  resultTree: any = [];
  isTreeViewEnable: boolean = false;
  data: any = {};
  childRef: any;
  selectedAll: any;
  selectedRole: any;
  userRoleList: any;
  status: any;
  constructor(private loaderService: LoaderService,
              private utilService: UtilService,
              public injector: Injector,
              private _data: DataStorageService) {
    if (this._data.data === undefined) {
      this.gotToListPage();
    }
  }

  async ngOnInit() {
    if (this._data.data) {
      this.data.body = this._data.data.userInfo;
      if (this.data.body) {
      this.selectedRole = this.data.body.role.roleType;
      // this.getUserRoleVal(this.selectedRole);
      }
      this.status = this.data.body.status;
      this._init();
    }
  }
  async _init() {
    this.jobs = await JobsModel.getAllJobsList();
    this.registeredUserObj.userId = this.data.body.userId;
    this.data.body.moreInfo = await this.getUserInfo(this.data.body.userId);
    this.userRoleList = await UserAcModel.getRolesForUser();
    // this.items = this.getTreeViewData(this.data.body.moreInfo);
  }
  onNoClick(): void {
    this.loaderService.display(false);
  }
  async fetchBuData(projectInfo: any) {
    let err;
    this.buDataSet = await (JobsModel.getBuByProjectId(projectInfo.value));
    if (this.applicationDataSet) {
      if (this.applicationDataSet.length > 0) {
        this.applicationDataSet = [];
      }
    }
    // [err, this.applicationDataSet] = await Util.to(JobsModel.getApplicationByBuId(bu_val.value));
    this.isbuEnable = false;
    if (this.buDataSet) {
    }
  }

  async fetchAppData(bu_val) {
    let err;
    this.loaderService.display(true);
    this.applicationDataSet = await (JobsModel.getApplicationByBuId(bu_val.value, this.registeredUserObj.selectedProValue));
    this.loaderService.display(false);
    this.applicationDataSet = this.utilService.arrayIterationMethods(this.applicationDataSet,
      this.data.body.moreInfo, ['applicationId', 'applicationType', 'applicationDetails', 'applicationName']);
    for (let i = 0; i < this.applicationDataSet.length; i++) {
      this.applicationDataSet[i]['status'] = false;
    }
    // [err, this.applicationDataSet] = await Util.to(JobsModel.getApplicationByBuId(bu_val.value));
    this.isApplicationEnable = false;
    if (this.applicationDataSet) {
    }
  }
  createArrayObj(val) {
    this.deleteArrayObj.push(val);
    this.registeredUserObj.applicationList = this.deleteArrayObj;
  }
  selectSingleVal(id, bool) {
    if (!bool) {
      this.createArrayObj(id);
    } else {
      this.deleteArrayObj.splice(this.deleteArrayObj.indexOf(id), 1);
    }
  }

  async updateUser(registeredUserObj) {
    this.loaderService.display(true);
    let res;
    res = await UserAcModel.storeApplicationDetail(registeredUserObj.userId, registeredUserObj, true);
    if (res.success) {
      this.data.body.moreInfo = await UserAcModel.getApplicationDetailsByUserId(registeredUserObj.userId);
      // this.items = this.getTreeViewData(this.data.body.moreInfo);
      // this.childRef = this.injector.get(TableDataComponent);
      this.onNoClick();
      this.gotToListPage();
    } else {
      Util.TE(res.message);
    }
    // console.log(res);
  }
  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
    this.rows = [];
    try {
      downlineItems.forEach(downlineItem => {
        const item = downlineItem.item;
        const value = item.value;
        const texts = [item.text];
        let parent = downlineItem.parent;
        while (!_.isNil(parent)) {
          texts.push(parent.item.text);
          parent = parent.parent;
        }
        const reverseTexts = _.reverse(texts);
        const row = `${reverseTexts.join(' -> ')} : ${value}`;
        this.rows.push(row);
      });
    } catch (e) {
        if (e) {
          console.log(e);
        }
    }
  }

  async removeItem(item: TreeviewItem) {
    console.log(item);
    let appObj = {
      'projectId': item.projectId,
      'buId': item.buId,
      'applicationId': item.value,
      'userId': this.data.body.userId
    };
    let res;
    res = await UserAcModel.removeApplicationDetailByAppId(appObj);
    let isRemoved = false;
    for (const tmpItem of this.items) {
      if (tmpItem === item) {
        _.remove(this.items, item);
      } else {
        isRemoved = TreeviewHelper.removeItem(tmpItem, item);
        if (isRemoved) {
          break;
        }
      }
    }
    if (isRemoved) {
      this.treeviewComponent.raiseSelectedChange();
    }
    if (res.success) {
      let err, res;
      // this.data.body.moreInfo = await Util.to(UserAcModel.getApplicationDetailsByUserId(appObj.userId));
      [err, res] = await Util.to(UserAcModel.getApplicationDetailsByUserId(appObj.userId));
      if (!err) {
        this.data.body.moreInfo = [];
        this.resultTree = [];
        this.items = [];
        // this.data.body.moreInfo = res;
        console.log(this.data.body.moreInfo);
        this.items = this.getTreeViewData(res);
      }
    } else {
      Util.TE(res.message);
    }
  }
  getTreeViewData(data?: any): TreeviewItem[] {
    var data = data ? data : this.data.body.moreInfo;
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i]['text'] = data[i]['projectName'];
        data[i]['value'] = data[i]['projectId'];
        for (let j = 0; j < data[i]['children'].length; j++) {
          data[i]['children'][j]['text'] = data[i]['children'][j]['buName'];
          data[i]['children'][j]['value'] = data[i]['children'][j]['buId'];
          for (let k = 0; k < data[i]['children'][j]['children'].length; k++) {
            data[i]['children'][j]['children'][k]['text'] = data[i]['children'][j]['children'][k]['applicationName'];
            data[i]['children'][j]['children'][k]['value'] = data[i]['children'][j]['children'][k]['applicationId'];
            data[i]['children'][j]['children'][k]['projectId'] = data[i]['projectId'];
            data[i]['children'][j]['children'][k]['buId'] = data[i]['children'][j]['buId'];
          }
        }
        this.resultTree.push(new TreeviewItem(data[i]));
      }
      return this.resultTree;
    } else {
      return [];
    }
  }

  async removeItemFromTable(item?: any) {
    let appObj = {
      'projectId': item.project.projectId,
      'buId': item.bu.buId,
      'applicationId': item.application.applicationId,
      'userId': this.data.body.userId
    };
    let res;
    res = await UserAcModel.removeApplicationDetailByAppId(appObj);
    if (res.success) {
      let err, res;
      // this.data.body.moreInfo = await Util.to(UserAcModel.getApplicationDetailsByUserId(appObj.userId));
      [err, res] = await Util.to(UserAcModel.getApplicationDetailsByUserId(appObj.userId));
      if (!err) {
        this.data.body.moreInfo = [];
        this.resultTree = [];
        this.items = [];
        return this.data.body.moreInfo = res;
      }
    } else {
      Util.TE(res.message);
    }
  }
  async getUserInfo(userId: any) {
    this.loaderService.display(true);
    let err, res;
    [err, res] = await Util.to(this.getApplicationDetailsByUserId(userId));
    if (!err) {
      this.loaderService.display(false);
      return res;
    } else {
      this.loaderService.display(false);
    }
  }
  async getApplicationDetailsByUserId(u_id: number) {
    return UserAcModel.getApplicationDetailsByUserId(u_id);
  }
  async gotToListPage() {
    UserAcModel.to('dashboard/ua/user-list');
  }
  async updateRoleType(role: any) {
    // console.log(roleType);
    let res, err;
    this.getUserRoleVal(role).then(data => {
        [err, res]  = Util.to(UserAcModel.UpdateRoleType(data[0].roleId, this.registeredUserObj.userId, this.data.body.status));
        if (!err) {
          alert('User role updated successfully');
          UserAcModel.getAllUserList();
          this.gotToListPage();
          // UserAcModel.to('dashboard/ua/user-list');
        }
    });
  }
  async updateStatus(status: any) {
    // console.log(status);
    alert('User status updated successfully');
    let res, err;
    [err, res]  = Util.to(UserAcModel.UpdateRoleType(this.data.body.roleId, this.data.body.userId, status));
    if (!err) {
      UserAcModel.getAllUserList();
      this.gotToListPage();
      // UserAcModel.to('dashboard/ua/user-list');
    }
  }
  async getUserRoleVal(role: any) {
    let roleData = this.userRoleList.filter((data: any) => data.roleType === role);
    return roleData;
}
  selectAll() {
    if (this.selectedAll) {
      for (let i = 0; i < this.applicationDataSet.length; i++) {
        this.applicationDataSet[i].status = this.selectedAll;
        this.createArrayObj(this.applicationDataSet[i]);
      }
    } else {
      this.deleteArrayObj = [];
      for (let i = 0; i < this.applicationDataSet.length; i++) {
        this.applicationDataSet[i].status = this.selectedAll;
      }
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.applicationDataSet.every(function (item: any) {
      return item.status === true;
    });
  }
}
