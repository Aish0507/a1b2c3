import { Component, OnInit, Inject } from '@angular/core';
import { BUModel } from '../../../../models/bu.model';
import { LoaderService } from '../../../../services/loader.service';
import { Util } from '../../../../helpers/util.helper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {UserAcModel} from '../../../../models/user-ac.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'ssp-add-bu',
  templateUrl: './add-bu.component.html',
  styleUrls: ['./add-bu.component.scss']
})
export class AddBuComponent implements OnInit {

  constructor(private loaderService: LoaderService,
    public dialogRef: MatDialogRef<AddBuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  projects: any = [];
  buObj: any = {};
  buName: String;
  buDetails: String;
  projectId: number;
  buForm = new FormGroup({
    project: new FormControl('', [Validators.required]),
    bu: new FormControl('',  [Validators.pattern('[a-zA-Z0-9-]+'), Validators.required]),
    buDetails: new FormControl('', [Validators.required]),
  });
  async ngOnInit() {
    this.projects = await BUModel.getAllProjectsList();
  }
  async addBU(buObj) {
    this.loaderService.display(true);
    let err, res;
    [err, res] = await Util.to(BUModel.AddNewBU(buObj));
    if (!err) {
      this.loaderService.display(false);
      // UserAcModel.to('/bu');
    } else {
      this.loaderService.display(false);
    }
    this.dialogRef.close();
  }
  getInputErrorMessage(input_name: string) {
    let err_message: string = '';
    if (this.buForm.get(input_name).hasError('required')) {
      if (input_name === 'project') {
        err_message = 'You must select a project.';
      } else {
        if (input_name === 'bu') {
          err_message = 'bu name can not be empty';
        } else {
          err_message = 'bu Details can not be empty';
        }
      }
    }
    if (this.buForm.get(input_name).hasError('pattern')) {
      err_message = 'bu name can contain letters and numbers only.';
    }
    if (this.buForm.get(input_name).hasError('custom')) {
      err_message = this.buForm.get(input_name).getError('custom');
    }

    return err_message;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
