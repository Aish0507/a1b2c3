import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { User } from '../../../interfaces/user';
import { JobsModel } from '../../../models/jobs.model';
import { JobsList } from '../../../interfaces/jobs-list';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dailog-build-overview',
  templateUrl: './dailog-build-overview.component.html',
  styleUrls: ['./dailog-build-overview.component.scss']
})
export class DailogBuildOverviewComponent implements OnInit {
  jobs: any = [];
  user: User;
  @Input() scheduleBuildObj: any = {};
  @ViewChild('elementToFocus') _input: ElementRef;
  scheduleBuildName: any;

  form = new FormGroup({
    buildName: new FormControl('', [Validators.required]),
    env: new FormControl('', [Validators.required])
  });
  constructor(public dialogRef: MatDialogRef<DailogBuildOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

 async ngOnInit() {
  this.jobs = await JobsModel.getAllJobsList();
  const ELEMENT_DATA: JobsList[] = this.jobs;
  }

  async fetchEnvData(env_val) {
    // console.log(env_val.value);
    this.scheduleBuildObj.env = env_val.value;
    // console.log(this.scheduleBuildObj)
  }
  onNoClick(): void {
    this.dialogRef.close();
   // JobsModel.to('dashboard/jobs/add-job');
  }
  updateBuildName(build) {
    this.scheduleBuildObj.buildName = build;
  }

  getInputErrorMessage(input_name: string) {
    let err_message = '';
    if (this.form.get(input_name).hasError('required')) {
      if (input_name === 'buildName') {
        err_message = 'buildName can not be empty';
      } else {
          err_message = 'time can not be empty';
        }
    }
    return err_message;
  }
}
