import {Component, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import {TestCaseModel} from '../../../models/test-case.model';
import {UtilService} from '../../../services/util.service';
import {Util} from '../../../helpers/util.helper';
import {LoaderService} from '../../../services/loader.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {FormControl} from '@angular/forms';
import { JobsModel } from '../../../models/jobs.model';
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
  'job':{
    'jobId': any;
    'jobName': any;
    'creationTime': any;
  };
}

@Component({
  selector: 'app-result-upload',
  templateUrl: './result-upload.component.html',
  styleUrls: ['./result-upload.component.scss']
})
export class ResultUploadComponent implements OnInit, OnDestroy {
  @ViewChild('uploadTCResult') uploadTCResult: any;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  aplicationList: any = [];
  aplicationType: any = [{
    'name' : 'SELENIUM',
    'value' : 'SELENIUM'
  },
    {
      'name' : 'UFT',
      'value' : 'UFT'
    }];
  appType: any;
  /* public selectedProjectFilterCtrl: FormControl = new FormControl();
  public selectedBUFilterCtrl: FormControl = new FormControl(); */
  public selectedAppFilterCtrl: FormControl = new FormControl();

  private _onDestroy = new Subject<void>();
  /** list of filtered by search keyword */
  public filteredApp: ReplaySubject<App[]> = new ReplaySubject<App[]>(1);
  appId: any;
  projectId: any;
  buId: any;
  targetEnvId: any;
  env: any;
  projectList: any ;
  buList: any ;
  isBuEnable = true;
  isApplicationEnable = true;
  selectedId: any;
  buDataSet: Array<Object>;
  childData: any = [];
  constructor (private utilService: UtilService,
               private loaderService: LoaderService) {
    this.uploader = new FileUploader({
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        this.onFileChange(item);
      }
    });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe( res => this.response = res );
  }
  targetEnvList: any;
  async ngOnInit() {
    let err;
    this.loaderService.display(true);
    [err, this.projectList] = await Util.to(this.getProjects());
    // console.log(this.projectList);
    if (!err) {
      this.targetEnvList = await(this.targetEnv());
      this.loaderService.display(false);
    }
    this.selectedAppFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAppList();
      });
  }
  async targetEnv() {
    return (TestCaseModel.getTargetEnv());
  }
async getProjects() {
  return (TestCaseModel.getAllProjects());
}
async fetchBuData(projectInfo: any) {
  this.selectedId = projectInfo.value;
  console.log(this.selectedId);
  this.loaderService.display(true);
  // let err;
  this.childData = [];
  this.buDataSet = await (JobsModel.getBuByProjectId(this.selectedId));
  // [err, this.applicationDataSet] = await Util.to(JobsModel.getApplicationByBuId(bu_val.value));
  this.isBuEnable = false;
  if (this.buDataSet) {
    this.loaderService.display(false);
  }
  console.log(this.buDataSet);
}
async fetchAppData(bu_val) {
  this.loaderService.display(true);
  let err;
  // this.applicationDataSet = await (JobsModel.getApplicationByBuId(bu_val.value, this.scheduleBuildObj.selectedProValue.projectId));
   [err, this.aplicationList] = await Util.to(TestCaseModel.getApplicationByBuId(bu_val.value, this.projectId));
    this.isApplicationEnable = false;
  // console.log(this.applicationDataSet);
  if (this.aplicationList) {
    this.loaderService.display(false);
  }
}
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  async onChangeObj(obj) {
    // console.log(obj);
    this.loaderService.display(true);
    let err;
    // [err, this.aplicationList] = await Util.to(TestCaseModel.getAllApplications());
    if (!err) {
      this.aplicationList = this.utilService.filterApplicationArray(this.aplicationList, obj);
      // console.log(this.aplicationList);
      this.filteredApp.next(this.aplicationList.slice());
      this.loaderService.display(false);
    }
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  filterAppList() {
    if (!this.aplicationList) {
      return;
    }
    // get the search keyword
    let search = this.selectedAppFilterCtrl.value;
    // alert(search);
    if (!search) {
      this.filteredApp.next(this.aplicationList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the array ..
    // this.applicationDataSet = (this.applicationDataSet.filter(app => app.applicationName.toLowerCase().indexOf(search) > -1));
    this.filteredApp.next(
      this.aplicationList.filter(app => app.applicationName.toLowerCase().indexOf(search) > -1)
    );
  }
  async onFileChange(file) {
    // console.log(typeof this.appId);
    this.loaderService.display(true);
    let err, res;
    [err, res] = await Util.to(TestCaseModel.uploadTestcaseResult(file._file,
      '', this.buId, this.projectId, this.targetEnvId));
    if (!err) {
      this.uploader.clearQueue();
      this.appId = null;
      this.appType = null;
      this.uploadTCResult.nativeElement.value = null;
      this.loaderService.display(false);
      const config = {data: { title: 'Alert', body: res.message }};
      Util.openDefaultDialog(config);
    }
  }
  clearUploadTCResultQueue() {
    this.uploader.clearQueue();
    this.appId = null;
    this.appType = null;
    this.projectId = null;
    this.buId = null;
    this.targetEnvId = null;
    this.uploadTCResult.nativeElement.value = null;
  }
}
