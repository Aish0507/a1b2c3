import { Component, OnInit, Inject } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TestCaseModel } from '../../../../models/test-case.model';
import { Util } from '../../../../helpers/util.helper';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ssp-add-test-case',
  templateUrl: './add-test-case.component.html',
  styleUrls: ['./add-test-case.component.scss']
})
export class AddTestCaseComponent implements OnInit {
  applicationList: Array<TestCaseModel> = [];
  tcObj: any = {};
  applicationId: number;
  testcaseName: string;
  testcaseDescription: string;
  constructor(private loaderService: LoaderService,
    public dialogRef: MatDialogRef<AddTestCaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    tcForm = new FormGroup({
      application: new FormControl('', [Validators.required]),
      testcaseName: new FormControl('',  [Validators.pattern('[a-zA-Z0-9-]+'), Validators.required]),
      testcaseDescription: new FormControl('', [Validators.required]),
    });
  async ngOnInit() {
    this.applicationList = await TestCaseModel.getAllApplications();
  }
  async addtestCase(tcObj) {
    this.loaderService.display(true);
    let err, res;
    [err, res] = await Util.to(TestCaseModel.AddNewTC(tcObj));
    if (!err) {
      this.loaderService.display(false);
    } else {
      this.loaderService.display(false);
    }
    this.dialogRef.close();
  }
  getInputErrorMessage(input_name: string) {
    let err_message = '';
    if (this.tcForm.get(input_name).hasError('required')) {
      if (input_name === 'application') {
        err_message = 'You must select an application.';
      } else {
        if (input_name === 'testcaseName') {
          err_message = 'Test Case Name can not be empty';
        } else {
          err_message = 'Test Case Description can not be empty';
        }
      }
    }
    if (this.tcForm.get(input_name).hasError('pattern')) {
      err_message = 'test case name can contain letters and numbers only.';
    }
    if (this.tcForm.get(input_name).hasError('custom')) {
      err_message = this.tcForm.get(input_name).getError('custom');
    }

    return err_message;
  }
}
