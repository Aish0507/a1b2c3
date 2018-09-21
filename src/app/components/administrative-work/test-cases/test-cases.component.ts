import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TestCaseModel } from '../../../models/test-case.model';
import { LoaderService } from '../../../services/loader.service';
import { JobsModel } from '../../../models/jobs.model';
import { MatDialog } from '@angular/material';
import { AddTestCaseComponent } from './add-test-case/add-test-case.component';
import { UpdateTestCaseComponent } from './update-test-case/update-test-case.component';

@Component({
  selector: 'ssp-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.scss']
})
export class TestCasesComponent implements OnInit {
  applicationList: Array<TestCaseModel> = [];
  tc;
  // dataSource: any;
  @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
  temp = [];
  columns = [];
  app_val;
  // displayedColumns = ['testCaseId', 'testCaseName', 'testCaseDescription', 'action'];
  constructor(public dialog: MatDialog, private loaderService: LoaderService) { }
  selectedAppValue: String;
  async ngOnInit() {
    this.applicationList = await TestCaseModel.getAllApplications();
  }
  async fetchTcData(app_val) {
    this.app_val = app_val.value;
    // console.log(app_val);
    this.loaderService.display(true);
    let data: any;
    data = await TestCaseModel.getTestcasesByApplicationid(app_val.value);
    this.loaderService.display(false);
    this.tc = data;
    this.temp = [...this.tc];
    // this.dataSource  = this.tc;
  }
  openAddDialog() {

    const dialogRef = this.dialog.open(AddTestCaseComponent, {
      width: '250px',
      data: {  }
    });
    dialogRef.afterClosed().subscribe(result => {
    this.loaderService.display(true);
    TestCaseModel.getTestcasesByApplicationid(this.app_val).then((data) => {
     if (data) {
       this.tc = data;
       this.temp = [...data];
       // this.dataSource = new MatTableDataSource(data);
       this.loaderService.display(false);
     }
    });
 });
  }
  openUpdateDialog(element) {
    const dialogRef = this.dialog.open(UpdateTestCaseComponent, {
    width: '250px',
    data: { tcobj: element }
  });
  dialogRef.afterClosed().subscribe(result => {
  });
}
updateFilter(event) {
  const val = event.target.value.toLowerCase();
  const temp = this.temp.filter(function(d) {
    return d.testcaseName.toLowerCase().indexOf(val) !== -1 || !val;
  });
 this.tc = temp;
}

}
/*
export interface Element {
  testCaseId: number;
  testCaseName: string;
  testCaseDescription: string;
} */
