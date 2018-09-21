import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource, MatDatepicker, MatDialog } from '@angular/material';
import { JobsModel } from '../../../models/jobs.model';
import { User } from '../../../models/user.model';
import { JobsList } from '../../../interfaces/jobs-list';
import { UtilService } from '../../../services/util.service';
import { Util } from '../../../helpers/util.helper';
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs/Subject";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { DashBoardModel } from '../../../models/dashboard.model';
import { TestCaseModel } from '../../../models/test-case.model';
import { JobsModule } from '../jobs.module';

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
  selector: 'ssp-list-of-jobs',
  templateUrl: './list-of-jobs.component.html',
  styleUrls: ['./list-of-jobs.component.scss'],
  providers: [DatePipe]
})
export class ListOfJobsComponent implements OnInit, AfterViewInit, OnDestroy {
  filter = false;
  // date = (new Date(Date.now()));
  startDate = new Date(Date.now());
  endDate = new Date(Date.now());
  endDateVal = new Date();
  startDateVal = new Date();
  dataSource: any;
  @ViewChild(MatSort) sort = MatSort;
  @ViewChild('elementToFocusStart') _inputStart: ElementRef;
  @ViewChild('elementToFocusEnd') _inputEnd: ElementRef;
  selectedProValue = '';
  selectedBuValue = '';
  selectedAppValue = '';
  // selectedEnvValue: string;
  applicationList: any = [];
  tempProjectData: any;
  buList: any;
  advancedFilterdObj: any = {};
  isApplicationEnable: boolean = true;
  isApplicationSelected: boolean = false;
  isRunning: boolean = false;
  jobs: any = [];
  user: User;
  tc: any;
  selectedId: any;
  applicationDataSet: any;
  isTcDivEnable: boolean = false;
  isBuEnable: boolean = true;
  isDateSelected: boolean = true;
  buDataSet: Array<Object>;
  jobData: any = [];
  stDate: any;
  dataSet: any;
  filterData: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  aplicationType: any = [{
    'name': 'SELENIUM',
    'value': 'SELENIUM'
  },
  {
    'name': 'UFT',
    'value': 'UFT'
  }];
  appType: any;
  public selectedAppFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  /** list of filtered by search keyword */
  public filteredApp: ReplaySubject<App[]> = new ReplaySubject<App[]>(1);
  intervalId: any;
  constructor(public utilService: UtilService, private router: Router,
    private loaderService: LoaderService, public dialog: MatDialog, private datePipe: DatePipe) {
    this.fetchTCResult();
  }

  async ngOnInit() {
    this.getJobList();
    this.intervalId = setInterval(() => {
      this.getJobList();
    }, 60000);
  }
  async getJobList() {
    this.loaderService.display(true);
    let err;
    this.jobs = await JobsModel.getAllJobsList();
    this.user = User.Auth();
    const ELEMENT_DATA: JobsList[] = this.jobs;
    // this.dataSource = new MatTableDataSource(this.jobs);
    this.advancedFilterdObj.startDate = this.datePipe.transform(this.startDateVal, 'yyyy-MM-dd');
    this.advancedFilterdObj.endDate = this.datePipe.transform(this.endDateVal, 'yyyy-MM-dd');
    // console.log(dateVal);
    this.dataSet = {
      'startDate': this.advancedFilterdObj.startDate,
      'endDate': this.advancedFilterdObj.endDate
    };
    [err, this.jobData] = await Util.to(JobsModel.getJobDetails(this.dataSet));
    if (!err) {
      this.loaderService.display(false);
    }
    // console.log(JSON.stringify(this.jobData));
    this.selectedAppFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAppList();
      });
  }
  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
  }
  _openCalendarStart(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._inputStart.nativeElement.focus());
  }
  _openCalendarEnd(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._inputEnd.nativeElement.focus());
  }
  async fetchTCResult() {
    this.loaderService.display(true);
    // this.applicationList = await DashBoardModel.getAllAppsList();
    this.tempProjectData = await DashBoardModel.getAllProjectsList();
    this.getBuList();

  }
  async onChangeObj(obj) {
    this.loaderService.display(true);
    let err;
    [err, this.applicationList] = await Util.to(TestCaseModel.getAllApplications());
    if (!err) {
      this.applicationList = this.utilService.filterApplicationArray(this.applicationList, obj.value);
      this.filteredApp.next(this.applicationList.slice());
      this.loaderService.display(false);
    }
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  filterAppList() {
    if (!this.applicationList) {
      return;
    }
    // get the search keyword
    let search = this.selectedAppFilterCtrl.value;
    // alert(search);
    if (!search) {
      this.filteredApp.next(this.applicationList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the array ..
    // this.applicationDataSet = (this.applicationDataSet.filter(app => app.applicationName.toLowerCase().indexOf(search) > -1));
    this.filteredApp.next(
      this.applicationList.filter(app => app.applicationName.toLowerCase().indexOf(search) > -1)
    );
  }
  async getBuList() {
    let buErr;
    [buErr, this.buList] = await Util.to(DashBoardModel.getAllBUList());
    if (!buErr) {
      this.loaderService.display(false);
    }
  }
  async fetchEnvData(env_val) {
    this.advancedFilterdObj.env = env_val.value;
  }
  async fetchStartDate(sdate) {
    this.advancedFilterdObj.startDate = this.datePipe.transform(sdate, 'yyyy-MM-dd');
    this.isDateSelected = true;
    if (this.advancedFilterdObj.startDate > this.advancedFilterdObj.endDate) {
      alert('Start Date Should not be Greater than End Date');
      // this.startDateVal = null;
      // this._inputStart.nativeElement.value = null;
        this.startDateVal = new Date();
        // this.isDateSelected = false;
        if (this.advancedFilterdObj.startDate > this.advancedFilterdObj.endDate) {
          this.endDateVal = new Date();
          this.startDateVal = new Date();
        }
    }
  }
  async fetchEndDate(edate) {
    this.advancedFilterdObj.endDate = this.datePipe.transform(edate, 'yyyy-MM-dd');
    this.isDateSelected = true;
    if (this.advancedFilterdObj.startDate > this.advancedFilterdObj.endDate) {
      alert('End Date Should be Greater than Start Date');
      // this._inputEnd.nativeElement.value = null;
      this.endDateVal = new Date();
      // this.isDateSelected = false;
      if (this.advancedFilterdObj.startDate > this.advancedFilterdObj.endDate) {
        this.endDateVal = new Date();
        this.startDateVal = new Date();
      }
    }
  }

  async scheduledStop(buildId: any) {
    // console.log(buildId);
    // this.jobs.jobList[0].buildStatus =  await JobsModel.stopScheduledJob(buildId);
    if (confirm('Are You sure to Cancel ?')) {
      for (let i = 0; i < this.jobData.length; i++) {
        for (let j = 0; j < this.jobData[i].jobList.length; j++) {
          if (this.jobData[i].jobList[j].buildId === buildId) {
            const statusObj = await (JobsModel.stopScheduledJob(buildId));
            this.jobData[i].jobList[j].buildStatus = statusObj.buildStatus;
          }
        }
      }
    }
  }

  async JobListFilter(filterval: any) {
    this.filterData = {
      'startDate': filterval.startDate,
      'endDate': filterval.endDate,
      'selectedProValue': filterval.selectedProValue,
      'selectedAppValue': filterval.selectedAppValue,
      'selectedBuValue': filterval.selectedBuValue,
    };
    this.loaderService.display(true);
    this.jobData = await (JobsModel.getJobDetails(this.filterData));
    // console.log(JSON.stringify(this.filterData));
    // console.log(JSON.stringify(this.jobData));
    this.loaderService.display(false);
  }
  activeFilter() {
this.filter = !this.filter;
  }
}
