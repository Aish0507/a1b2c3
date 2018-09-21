import { Component, OnInit, Inject } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';
import { ProjectModel } from '../../../../models/project.model';
import { Util } from '../../../../helpers/util.helper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ssp-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  projectObj: any = {};
  projectName: String;
  projectDescription: String;
  projectStatus: String;
  constructor(private loaderService: LoaderService,
    public dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    projectForm = new FormGroup({
      projectName: new FormControl('', [Validators.pattern('[a-zA-Z0-9-]+'), Validators.required]),
      projectDescription: new FormControl('', [Validators.required]),
      // status: new FormControl('', [Validators.required]),
    });
  ngOnInit() {
  }
  async addProject(projectObj) {
    this.loaderService.display(true);
    let err, res;
    [err, res] = await Util.to(ProjectModel.AddNewProject(projectObj));
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
      if (input_name === 'projectName') {
        err_message = 'project name can not be empty';
      } else {
        if (input_name === 'projectDescription') {
          err_message = 'project description can not be empty';
        } else {
          err_message = 'You must select status.';
        }
      }
    }
    if (this.projectForm.get(input_name).hasError('pattern')) {
      err_message = 'project name can contain letters and numbers only.';
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
