import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { JobsModel } from '../../../models/jobs.model';
import { User } from '../../../models/user.model';
import { JobsList } from '../../../interfaces/jobs-list';
import { UtilService } from '../../../services/util.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { Util } from '../../../helpers/util.helper';
import { TestCaseModel } from '../../../models/test-case.model';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { takeUntil } from 'rxjs/operators';
interface App {
  'applicationId': any;
  'applicationName': any;
  'applicationDetails': any;
  'almTestcaseId': any;
  'applicationType': any;
  'bu': {
    'buId': any;
    'buName': any;
    'buDetails': any;
  };
  'job': {
    'jobId': any;
    'jobName': any;
    'creationTime': any;
  };
}

@Component({
  selector: 'ssp-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss']
})
export class AddJobComponent implements OnInit, OnDestroy {

  dataSource: any;
  @ViewChild(MatSort) sort = MatSort;
  selectedProValue: string;
  selectedBuValue: string;
  selectedAppValue: string;
  selectedEnvValue: string;
  selectedId: any;
  jobs: any = [];
  user: User;
  tc: any;
  applicationDataSet: any = [];
  isApplicationEnable: boolean = true;
  isTcDivEnable: boolean = false;
  scheduleBuildObj: any = {};
  isBuEnable: boolean = true;
  isBuSelected: boolean = true;
  buDataSet: Array<Object>;
  childData: any = [];
  objectsArray: any = [];
  aplicationType: any = [{
    'name': 'SELENIUM',
    'value': 'SELENIUM'
  },
  {
    'name': 'UFT',
    'value': 'UFT'
  }];
  appType: any;
  // appType = new FormControl('all');
  value = 50;
  public selectedAppFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  /** list of banks filtered by search keyword */
  public filteredApp: ReplaySubject<App[]> = new ReplaySubject<App[]>(1);
  singleSelect: any = [];
  config = {
    displayKey: "applicationName", // if objects array passed which key to be displayed defaults to description
    search: true,
  };
  options: any = [];
  constructor(public utilService: UtilService, private router: Router, private loaderService: LoaderService) { }
  async ngOnInit() {
    this.loaderService.display(true);
    this.jobs = await JobsModel.getAllJobsList();
    this.user = User.Auth();
    const ELEMENT_DATA: JobsList[] = this.jobs;
    this.dataSource = new MatTableDataSource(this.jobs);
    this.loaderService.display(false);
    this.scheduleBuildObj.dateInfo = '';
    this.selectedAppFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAppList();
      });
  }
  async fetchTcData(app_val) {
    // console.log(JSON.stringify(this.scheduleBuildObj));
    // debugger;
    this.scheduleBuildObj.selectedAppValue = this.objectsArray[0];
    if (this.objectsArray.length > 0) {
      this.scheduleBuildObj.isAddMoreActive = true;
      this.loaderService.display(true);
      var data: any;
      data = await JobsModel.getTcByAppId(this.objectsArray[0].applicationId);
      for (let i = 0; i < data.length; i++) {
        data[i]['status'] = false;
      }
      this.tc = data;
      this.isTcDivEnable = true;
      if (this.tc) {
        this.loaderService.display(false);
      }
    }
    // alert('hiii');
  }

  async fetchBuData(projectInfo: any) {
    // console.log(projectInfo);
    if (projectInfo !== undefined) {
      this.selectedId = projectInfo.projectId;
      this.loaderService.display(true);
      // let err;
      this.childData = [];
      this.buDataSet = await (JobsModel.getBuByProjectId(projectInfo.projectId));
      // [err, this.applicationDataSet] = await Util.to(JobsModel.getApplicationByBuId(bu_val.value));
      this.isBuEnable = false;
      if (this.buDataSet) {
        this.loaderService.display(false);
      }
    } else {
      this.buDataSet = [];
      this.applicationDataSet = [];
      this.scheduleBuildObj.selectedBuValue = null;
      this.isBuSelected = true;
      // this.applicationDataSet = [...this.applicationDataSet];
      this.options = this.applicationDataSet;
      this.scheduleBuildObj.appType = null;
    }
  }

  async fetchAppData(bu_val) {
    if (bu_val !== undefined) {
      this.scheduleBuildObj.appType = 'all';
      this.loaderService.display(true);
      let err;
      // this.applicationDataSet = await (JobsModel.getApplicationByBuId(bu_val.value, this.scheduleBuildObj.selectedProValue.projectId));
      [err, this.applicationDataSet] = await Util.to(JobsModel.getApplicationByBuId(bu_val,
        this.scheduleBuildObj.selectedProValue.projectId));
      this.isApplicationEnable = false;
      this.isBuSelected = false;
      // console.log(this.applicationDataSet);
      if (this.applicationDataSet) {
        this.options = this.applicationDataSet;
        this.filteredApp.next(this.applicationDataSet.slice());
        this.loaderService.display(false);
      }
    } else {
      this.isBuSelected = true;
      this.applicationDataSet = [];
      // this.applicationDataSet = [...this.applicationDataSet];
      this.objectsArray = [];
      this.options = this.applicationDataSet;
      this.scheduleBuildObj.appType = null;
    }
  }

  async onChangeObj(obj) {
    console.log(obj);
    this.loaderService.display(true);
    let err;
    // this.aplicationList = this.applicationDataSet;
    [err, this.applicationDataSet] = await Util.to(JobsModel.getApplicationByBuId(this.scheduleBuildObj.selectedBuValue,
      this.scheduleBuildObj.selectedProValue.projectId));
    // console.log(this.applicationDataSet);
    if (!err) {
      this.applicationDataSet = this.utilService.filterApplicationArray(this.applicationDataSet, obj);
      this.options = this.applicationDataSet;
      // console.log(this.applicationDataSet);
      this.filteredApp.next(this.applicationDataSet.slice());
      this.loaderService.display(false);
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  filterAppList() {
    if (!this.applicationDataSet) {
      return;
    }
    // get the search keyword
    let search = this.selectedAppFilterCtrl.value;
    // alert(search);
    if (!search) {
      this.filteredApp.next(this.applicationDataSet.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the array ..
    // this.aplicationList = (this.aplicationList.filter(app => app.applicationName.toLowerCase().indexOf(search) > -1));
    this.filteredApp.next(
      this.applicationDataSet.filter(app => app.applicationName.toLowerCase().indexOf(search) > -1)
    );
  }
}
