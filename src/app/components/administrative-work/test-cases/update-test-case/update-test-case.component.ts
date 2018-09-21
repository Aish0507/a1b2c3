import { Component, OnInit, Inject } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util } from '../../../../helpers/util.helper';
import { TestCaseModel } from '../../../../models/test-case.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'ssp-update-test-case',
  templateUrl: './update-test-case.component.html',
  styleUrls: ['./update-test-case.component.scss']
})
export class UpdateTestCaseComponent implements OnInit {

  constructor(private loaderService: LoaderService,
    public dialogRef: MatDialogRef<UpdateTestCaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  tcObj: any = {};
  testcaseId: number;
  testcaseName: string;
  testcaseDescription: string;
  tcForm = new FormGroup({
    testcaseName: new FormControl({value: this.data.tcobj.testcaseName, disabled: true}),
    testcaseDescription: new FormControl(this.data.tcobj.testcaseDescription, [Validators.required]),
  });
    async ngOnInit() {
      this.tcObj = this.data.tcobj;

    }
  async updateTC(tcObj) {
        this.loaderService.display(true);
        let err, res;
        [err, res] = await Util.to(TestCaseModel.updateTC(tcObj));
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
      if (input_name === 'testcaseDescription') {
        err_message = 'Test Case Description can not be empty';
      }
    }
    if (this.tcForm.get(input_name).hasError('custom')) {
      err_message = this.tcForm.get(input_name).getError('custom');
    }

    return err_message;
  }
}
