import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectModel } from '../../../../models/project.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoaderService } from '../../../../services/loader.service';
import { Util } from '../../../../helpers/util.helper';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ssp-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {
  @Input() projectobj: any;
  constructor(private loaderService: LoaderService,
              public dialogRef: MatDialogRef<UpdateProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {  }
    projectObj: any = {};
    projectId: number;
    projectName: String;
    projectDetails: String;
    projectStatus: String;
    projectForm = new FormGroup({
      projectName: new FormControl({value: this.data.projectobj.projectName, disabled: true}),
      projectDetails: new FormControl(this.data.projectobj.projectDetails, [Validators.required]),
      // status: new FormControl('', [Validators.required]),
    });
    async ngOnInit() {
      this.projectObj = this.data.projectobj;
    }
  async updateProject(projectObj) {
        this.loaderService.display(true);
        let err, res;
        [err, res] = await Util.to(ProjectModel.updateProject(projectObj));
        if (!err) {
            this.loaderService.display(false);
        } else {
          this.loaderService.display(false);
        }
        this.dialogRef.close();
  }
  getInputErrorMessage(input_name: string) {
    let err_message = '';
    if (this.projectForm.get(input_name).hasError('required')) {
      if (input_name === 'status') {
        err_message = 'You must select status.';
      } else {
        err_message = 'project description can not be empty';
      }
    }
    if (this.projectForm.get(input_name).hasError('custom')) {
      err_message = this.projectForm.get(input_name).getError('custom');
    }

    return err_message;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
