import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ApplicationModel } from '../../../models/application.model';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AddApplicationComponent } from './add-application/add-application.component';
import { LoaderService } from '../../../services/loader.service';
import { UpdateApplicationComponent } from './update-application/update-application.component';

@Component({
  selector: 'ssp-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  AplicationList: Array<ApplicationModel> = [];
  dataSource: any;
  displayedColumns = ['project', 'BU', 'job', 'application', 'Action'];
  @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
  temp = [];
  columns = [];
  constructor(public dialog: MatDialog, private loaderService: LoaderService) { }

  async ngOnInit() {
    this.AplicationList = await ApplicationModel.getAllApplicationList();
    this.temp = [...this.AplicationList];
  }
  openUpdateDialog(element) {
    const dialogRef = this.dialog.open(UpdateApplicationComponent, {
    width: '350',
    data: { appobj: element }
  });
  dialogRef.afterClosed().subscribe(result => {
  });
}
  openAddDialog() {
    const dialogRef = this.dialog.open(AddApplicationComponent, {
      width: '350',
    data: {  }
  });
  dialogRef.afterClosed().subscribe((result) => {
    this.loaderService.display(true);
    ApplicationModel.getAllApplicationList().then((data) => {
     if (data) {
       this.AplicationList = data;
       this.temp = [...data];
       // this.dataSource = new MatTableDataSource(data);
       this.loaderService.display(false);
     }
    });
 });
}

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.application.applicationName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the AplicationList
    this.AplicationList = temp;
  }

}
export interface Element {
  BU: String;
  job: string;
  Application: string;
  project:String;
  //Action:String;
}
