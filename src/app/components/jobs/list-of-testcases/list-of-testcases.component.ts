import {
  Component, OnInit, Input, ViewChild, ElementRef, Inject, Output, Injector, OnChanges,
  AfterViewInit
} from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatDialog, TooltipPosition} from '@angular/material';
import { DailogDatetimeOverviewComponent } from '../dailog-datetime-overview/dailog-datetime-overview.component';
import { JobsModel } from '../../../models/jobs.model';
import { AddJobComponent } from '../add-job/add-job.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LoaderService } from '../../../services/loader.service';
import { DailogBuildOverviewComponent } from '../dailog-build-overview/dailog-build-overview.component';
import { FormControl } from '@angular/forms';
import * as jquery from 'jquery';
import { UtilService } from '../../../services/util.service';
@Component({
  selector: 'ssp-list-of-testcases',
  templateUrl: './list-of-testcases.component.html',
  styleUrls: ['./list-of-testcases.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush // this means it is not active checking for data changes
})
export class ListOfTestcasesComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() tcList: any;
  @Input() scheduleBuildObj: any = {};

  isTrue: boolean = false;
  selectedTestValue: any;
  scheduleBuildObjDate: string;
  scheduleBuildObjTime: string;
  scheduleBuildName: string;
  scheduleBuildObjDateTime: any;
  deleteArrayObj: any = [];
  isSelectedTestValue: boolean = false;
  public jobDetailList: any = [];
  isAddMoreClicked: boolean = false;
  isSelectedDateTime: boolean = false;
  projectname: string;
  jobData: any = {};
  buildData: any;
  selectedAll: any;
  tcName: any = [];
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);
  scheduleBuilTime = new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes();

    constructor(public dialog: MatDialog, private injector: Injector,
    private _parent: AddJobComponent, private loaderService: LoaderService,
    private  utilService: UtilService, private datetime: DatePipe) {}
  ngOnInit() {
    // this.messageEvent.emit(this.deleteArrayObj);
  }
  ngAfterViewInit() {
   //  jquery('[data-toggle="tooltip"]').tooltip();
   //  console.log(this.tcList);
  }
  ngOnChanges() {
    this.deleteArrayObj = [];
    this.selectedAll = true;
    if (this.tcList.length > 0 ) {
      this.selectAll();
    }
  }
  createArrayObj(val) {
    this.deleteArrayObj.push(val);
    this.scheduleBuildObj.data = this.deleteArrayObj;
  }
  selectTestcases(id, bool) {
    if (!bool) {
      this.createArrayObj(id);
    } else {
      this.deleteArrayObj.splice(this.deleteArrayObj.indexOf(id), 1);
    }
    this.isSelectedTestValue = true;
  }

  RunningTarget(target: any) {
    this.scheduleBuildObj.data[0].target = target;
  }
 async openDialog() {
    const config = { width: '250px', data: { title: 'Add Time', body: this.scheduleBuildObj }};
    const dialogRef = this.dialog.open(DailogDatetimeOverviewComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      this.scheduleBuildObj.dateInfo = result;
      if (this.scheduleBuildObj.dateInfo !== undefined) {
      if (this.scheduleBuildObj.dateInfo.date === this.datetime.transform(new Date(), 'yyyy-MM-dd')) {
        if ( this.scheduleBuildObj.dateInfo.time < this.scheduleBuilTime) {
          alert('Schedule time Can\'t less than Current time');
          // console.log(JSON.stringify(this.scheduleBuildObj.dateInfo));
          this.utilService.setDailogData(this.scheduleBuildObj.dateInfo);
          this.openDialog();
        } else {
          if (this.scheduleBuildObj.dateInfo !== undefined) {
            this.isSelectedDateTime = true;
            this.loaderService.display(true);
            this.isSelectedDateTime = true;
            const date = this.datetime.transform(new Date(), 'yyyy-MM-dd');
            this.buildData = (JobsModel.getBuildDetails(this.jobDetailList, this.scheduleBuildObj.dateInfo ));
            this.loaderService.display(false);
            JobsModel.to('dashboard/jobs/job-list');
          }
        }
      } else {
        this.isSelectedDateTime = true;
        this.loaderService.display(true);
        this.isSelectedDateTime = true;
        const date = this.datetime.transform(new Date(), 'yyyy-MM-dd');
        this.buildData = (JobsModel.getBuildDetails(this.jobDetailList, this.scheduleBuildObj.dateInfo ));
        this.loaderService.display(false);
        JobsModel.to('dashboard/jobs/job-list');
      }
    }
    });
   //  this.selectedAll = false;
  }

  async openBuildDialog() {
    const config = { width: '250px', data: { title: 'Add Time', body: this.scheduleBuildObj }};
    const dialogRef = this.dialog.open(DailogBuildOverviewComponent, config);
    dialogRef.afterClosed().subscribe(result => {
    this.scheduleBuildObj.buildInfo = result;
      if (result !== undefined) {
        this.loaderService.display(true);
        this.buildData = (JobsModel.getBuildDetails(this.jobDetailList, this.scheduleBuildObj.buildInfo));
        this.loaderService.display(false);
        JobsModel.to('dashboard/jobs/job-list');
      }
    });
  }
  deleteJobDetails(index: any) {
    this.jobDetailList.splice(index, 1);
    this.jobDetailList = [...this.jobDetailList];
  }

  jobDetails(val: any) {
    this.isTrue = true;
    const array = [];
    this.jobData = {
      'selectedProValue': val.selectedProValue,
      'selectedBuValue': val.selectedBuValue,
      'selectedEnvValue': val.selectedEnvValue,
      'selectedAppValue': {
          'applicationId': val.selectedAppValue.applicationId,
          'applicationName': val.selectedAppValue.applicationName,
          'applicationDetails': val.selectedAppValue.applicationDetails,
          'applicationType': val.selectedAppValue.applicationType,
          'bu': {
              'buId': val.selectedAppValue.bu.buId,
              'buName': val.selectedAppValue.bu.buName,
              'buDetails': val.selectedAppValue.bu.buDetails
            }
        },
      'data': array
    };
    for (let j = 0; j < val.data.length; j++) {
        this.jobData.data.push({
          'testcaseId': val.data[j].testcaseId,
          'testcaseDescription': val.data[j].testcaseDescription,
          'testcaseName': val.data[j].testcaseName,
          'status': val.data[j].status
        });
    }
    for (let i = 0; i < array.length; i++) {
      this.tcName.push(array[i].testcaseName);
    }
    this.tcName = [...this.tcName];
    //  console.log(this.tcName);
    this.jobDetailList.push(this.jobData);
    this.jobDetailList = [...this.jobDetailList];
    this._parent.isBuSelected = true;
    this.isSelectedTestValue = false;
    this._parent.scheduleBuildObj.isAddMoreActive = false;
    this.deleteArrayObj = [];
    this._parent.scheduleBuildObj = {};
    this._parent.scheduleBuildObj.selectedBuValue = null;
    this._parent.buDataSet = [];
    this._parent.objectsArray = [];
    this._parent.options = [];
    this._parent.scheduleBuildObj.isAddMoreActive = false;
    this.selectedAll = false;
   // console.log(this.selectedAll);
  }
  selectAll() {
    if (this.selectedAll) {
      for (let i = 0; i < this.tcList.length; i++) {
        this.tcList[i]['status'] = this.selectedAll;
        this.createArrayObj(this.tcList[i]);
      }
    } else {
      this.deleteArrayObj = [];
      for (let i = 0; i < this.tcList.length; i++) {
        this.tcList[i]['status'] = this.selectedAll;
      }
    }
  }
  checkIfAllSelected() {
    this.selectedAll = this.tcList.every(function (item: any) {
      return item.status === true;
    });
  }

  /* async toBeBuild() {
    this.loaderService.display(true);
    this.isSelectedDateTime = true;
    const date = this.datetime.transform(new Date(), 'yyyy-MM-dd');
    const time = new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes();
    this.scheduleBuildObjDateTime = {
      'date': date,
      'time': time
    };
    this.buildData = await (JobsModel.getBuildDetails(this.jobDetailList,
                                this.scheduleBuildObj.dateInfo ? this.scheduleBuildObj.dateInfo : this.scheduleBuildObjDateTime));
    this.loaderService.display(false);
   // console.log(this.buildData);
  } */
}
