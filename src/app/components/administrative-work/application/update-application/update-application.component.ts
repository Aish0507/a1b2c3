import { Component, OnInit, Inject } from '@angular/core';
import { ApplicationModel } from '../../../../models/application.model';
import { LoaderService } from '../../../../services/loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UpdateProjectComponent } from '../../project/update-project/update-project.component';
import { Util } from '../../../../helpers/util.helper';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ssp-update-application',
  templateUrl: './update-application.component.html',
  styleUrls: ['./update-application.component.scss']
})
export class UpdateApplicationComponent implements OnInit {
  apptypeList: any = [];
  appObj: any = {};
  applicationName: String;
  applicationDetails: String;
  appId: number;
  applicationType: Object;
  constructor(private loaderService: LoaderService,
    public dialogRef: MatDialogRef<UpdateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    debugger;
    applicationForm = new FormGroup({
      applicationName: new FormControl({value: this.data.appobj.application.applicationName, disabled: true}),
      applicationType: new FormControl(this.data.appobj.application.applicationType, [Validators.required]),
      applicationDetails: new FormControl(this.data.appobj.application.applicationDetails, [Validators.required]),
    });
  async ngOnInit() {
    this.appObj = this.data.appobj.application;
    // console.log(this.data.appobj.application.applicationType);
    this.apptypeList = await ApplicationModel.getAllApplicationTypeList();
  }
  async updateApplication(appObj) {
    // console.log(appObj);
    this.loaderService.display(true);
    let err, res;
    [err, res] = await Util.to(ApplicationModel.updateApplication(appObj));
    if (!err) {
      this.loaderService.display(false);
    } else {
      this.loaderService.display(false);
    }
    this.dialogRef.close();
  }
  getInputErrorMessage(input_name: string) {
    let err_message = '';
    if (this.applicationForm.get(input_name).hasError('required')) {
      if (input_name === 'applicationType') {
        err_message = 'You must select application type.';
      } else {
        err_message = 'project description can not be empty';
      }
    }
    if (this.applicationForm.get(input_name).hasError('custom')) {
      err_message = this.applicationForm.get(input_name).getError('custom');
    }

    return err_message;
  }

  // close the dialog box
  async closeDialog() {
    this.dialogRef.close();
  }
}
