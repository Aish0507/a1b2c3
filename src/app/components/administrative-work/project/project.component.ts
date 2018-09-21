import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ProjectModel } from '../../../models/project.model';
import {MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import { UpdateProjectComponent } from './update-project/update-project.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { Util } from '../../../helpers/util.helper';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'ssp-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projectList: Array<ProjectModel> = [];
  projectName: string;
  @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
  temp = [];
  columns = [];
  tempProjectData: any;
  constructor(public dialog: MatDialog, private loaderService: LoaderService) { }

  async ngOnInit() {
    this.tempProjectData = await ProjectModel.getAllProjectsList();
    this.projectList = this.tempProjectData['projects'];
    this.temp = [...this.projectList];
  }
  openUpdateDialog(element) {
      const dialogRef = this.dialog.open(UpdateProjectComponent, {
      width: '350px',
      data: { projectobj: element }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  async openAddDialog() {
      const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '350px',
      data: {  }
    });
     dialogRef.afterClosed().subscribe((result) => {
       this.loaderService.display(true);
      ProjectModel.getAllProjectsList().then((data) => {
        if (data) {
          this.tempProjectData = data;
          this.projectList = this.tempProjectData['projects'];
          this.temp = [...this.projectList];
          this.loaderService.display(false);
        }
      });
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d) {
      return d.projectName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.projectList = temp;
  }
}
