import { Component, OnInit, Input, Inject } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Util } from '../../../../helpers/util.helper';
import { BUModel } from '../../../../models/bu.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ssp-update-bu',
  templateUrl: './update-bu.component.html',
  styleUrls: ['./update-bu.component.scss']
})
export class UpdateBuComponent implements OnInit {
  @Input() buObject: any;
  constructor(private loaderService: LoaderService,
    public dialogRef: MatDialogRef<UpdateBuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  buObj: any = {};
  buId: number;
  buName: String;
  buDetails: String;
  buForm = new FormGroup({
    projectName: new FormControl({value: this.data.buObject.project.projectName, disabled: true}),
    buName: new FormControl({value: this.data.buObject.buDetails.buName, disabled: true}),
    buDetails: new FormControl(this.data.buObject.buDetails.buDetails, [Validators.required]),
  });
  ngOnInit() {
    this.buObj = this.data.buObject;
  }
  async updateBU(buObj) {
    this.loaderService.display(true);
    let err, res;
    [err, res] = await Util.to(BUModel.updateBU(buObj));
    if (!err) {
        this.loaderService.display(false);
    } else {
      this.loaderService.display(false);
    }
    this.dialogRef.close();
}
getInputErrorMessage(input_name: string) {
  let err_message = '';
  if (this.buForm.get(input_name).hasError('required')) {
    if (input_name === 'buDetails') {
      err_message = 'bu description can not be empty';
    }
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
