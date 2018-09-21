import { Component, OnInit, Input, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepicker } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobsModel } from '../../../models/jobs.model';
import { User } from '../../../interfaces/user';
import { JobsList } from '../../../interfaces/jobs-list';
import { UtilService } from '../../../services/util.service';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
  selector: 'dailog-datetime-overview',
  templateUrl: './dailog-datetime-overview.component.html',
  styleUrls: ['./dailog-datetime-overview.component.scss'],
  providers: [DatePipe]
})
export class DailogDatetimeOverviewComponent implements OnInit {
  minDate = new Date(Date.now());
  scheduleBuildObjDate = new Date();
  // serializedDate = new FormControl((new Date()).toISOString());
  scheduleBuildObjTime = new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes();
  jobs: any = [];
  user: User;
  scheduleBuildName: any;
  buildEnvName: any;
  @Input() scheduleBuildObj: any = {};
  @ViewChild('elementToFocus') _input: ElementRef;

  form = new FormGroup({
    buildName: new FormControl('', [Validators.required]),
    env: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required])
  });
  async ngOnInit() {
    // throw new Error("Method not implemented.");
    /* this.form = this.fb.group( {
      unique: [null, Validators.compose([Validators.required])],
    } ); */
    this.jobs = await JobsModel.getAllJobsList();
    const ELEMENT_DATA: JobsList[] = this.jobs;
    this.scheduleBuildObj.date =  this.datePipe.transform(this.scheduleBuildObjDate, 'yyyy-MM-dd');
    this.scheduleBuildObj.time =  this.scheduleBuildObjTime;
  }
  constructor(
    public dialogRef: MatDialogRef<DailogDatetimeOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private datePipe: DatePipe,
    private utilService: UtilService, private atp: AmazingTimePickerService, private fb: FormBuilder) {
       this.buildEnvName = utilService.getDailogData();
      if ( this.buildEnvName !== undefined) {
        this.scheduleBuildName = this.buildEnvName.buildName;
        this.scheduleBuildObj.selectedEnvValue = this.buildEnvName.selectedEnvValue;
      }
  }

  async fetchEnvData(env_val) {
      // console.log(env_val.value);
      this.scheduleBuildObj.env = env_val.value;
      // console.log(this.scheduleBuildObj)
  }
  onNoClick(): void {
    if ( this.buildEnvName !== undefined) {
      this.buildEnvName.buildName = '';
      this.buildEnvName.selectedEnvValue = '';
    }
    this.dialogRef.close();
  }

  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._input.nativeElement.focus());
  }

  _closeCalendar(e) {
    setTimeout(() => this._input.nativeElement.blur());
  }

  updateDate(date) {
    this.scheduleBuildObj.date = this.datePipe.transform(date, 'yyyy-MM-dd');
   // console.log(date);
  }
  updateTime(time) {
    this.scheduleBuildObj.time = time;
  }
  updateBuildName(build) {
    this.scheduleBuildObj.buildName = build;
  }
  open() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.scheduleBuildObjTime = time;
    });
  }
  getInputErrorMessage(input_name: string) {
    let err_message = '';
    if (this.form.get(input_name).hasError('required')) {
      if (input_name === 'buildName') {
        err_message = 'buildName can not be empty';
      } else {
        if (input_name === 'env') {
          err_message = 'env can not be empty';
        } else {
          if (input_name === 'date') {
            err_message = 'date can not be empty';
          } else {
              err_message = 'time can not be empty';
            }
        }
      }
    }
    return err_message;
  }
}
