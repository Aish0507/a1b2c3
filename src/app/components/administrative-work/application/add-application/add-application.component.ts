import { Component, OnInit, Inject } from '@angular/core';
import { ApplicationModel } from '../../../../models/application.model';
import { Util } from '../../../../helpers/util.helper';
import { JobsModel } from '../../../../models/jobs.model';
import { LoaderService } from '../../../../services/loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ssp-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.scss']
})
export class AddApplicationComponent implements OnInit {
  buList: any = [];
  apptypeList: Array<ApplicationModel> = [];
  projectList: any = [];
  appObj: any = {};
  appName: String;
  globalAppId: number;
  appDetails: String;
  buId: number;
  projectId: number;
  appType: Object;
  applicationForm = new FormGroup({
    project: new FormControl('', [Validators.required]),
    bu: new FormControl('', [Validators.required]),
    appType: new FormControl('', [Validators.required]),
    appName: new FormControl('', [Validators.pattern('[a-zA-Z0-9-]+'), Validators.required]),
    // globalAppId: new FormControl('', [Validators.pattern('[0-9]{0-10}+'), Validators.required]),
    appDetails: new FormControl('', [Validators.required]),
  });
  constructor(private loaderService: LoaderService,
    public dialogRef: MatDialogRef<AddApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.projectList = await JobsModel.getAllJobsList();
    this.apptypeList = await ApplicationModel.getAllApplicationTypeList();
  }
  async fetchBuData(projectInfo: any) {
    this.loaderService.display(true);
    let err;
    this.buList = await (JobsModel.getBuByProjectId(projectInfo.value));
    // [err, this.applicationDataSet] = await Util.to(JobsModel.getApplicationByBuId(bu_val.value));
    /* this.isbuEnable = false;*/
    if (this.buList) {
      this.loaderService.display(false);
    }
  }
  async addApplication(appObj) {
    this.loaderService.display(true);
    let err, res;
    [err, res] = await Util.to(ApplicationModel.AddNewApplication(appObj));
    if (!err) {
      this.loaderService.display(false);
      // UserAcModel.to('/bu');
    } else {
      this.loaderService.display(false);
    }
    this.dialogRef.close();
  }
  getInputErrorMessage(input_name: string) {
    let err_message = '';
    if (this.applicationForm.get(input_name).hasError('required')) {
      if (input_name === 'project') {
        err_message = 'You must select a project.';
      } if (input_name === 'globalAppId') {
        err_message = 'Global Application Id can not be empty';
      } else {
        if (input_name === 'bu') {
          err_message = 'You must select a bu.';
        } else {
          if (input_name === 'appType') {
            err_message = 'You must select a Application type.';
          } else {
            if (input_name === 'appName') {
              err_message = 'Application Name can not be empty';
            } else {
              err_message = 'Application Details can not be empty';
            }
          }
        }
      }
    }
    if (this.applicationForm.get(input_name).hasError('pattern')) {
      err_message = 'application name can contain letters and numbers only.';
    }
    if (this.applicationForm.get(input_name).hasError('custom')) {
      err_message = this.applicationForm.get(input_name).getError('custom');
    }

    return err_message;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
