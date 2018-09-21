import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TestCaseModel } from '../../../models/test-case.model';
import { ProjectModel } from '../../../models/project.model';
import { BUModel } from '../../../models/bu.model';
import { DashBoardModel } from '../../../models/dashboard.model';
import { FormControl } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDatepicker } from '@angular/material';
import { Util } from '../../../helpers/util.helper';
import { LoaderService } from '../../../services/loader.service';
import { DatePipe } from '@angular/common';
// import {MatDatepickerModule} from '@angular/material';
import { DataTable, DataTableTranslations, DataTableResource } from '../../../data-table';

@Component({
  selector: 'app-defect-info',
  templateUrl: './defect-info.component.html',
  styleUrls: ['./defect-info.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('oneState', [
      state('inactive', style({
        // backgroundColor: "blue"
      })),
      state('active', style({
        // backgroundColor: "red"
      })),
      transition('inactive => active', animate('600ms ease-in')),
      transition('active => inactive', animate('1000ms ease-out'))
    ]),
    trigger('twoState', [
      state('inactive', style({
        // backgroundColor: "green"
      })),
      state('active', style({
        // backgroundColor: "black"
      })),
      transition('inactive => active', animate('1000ms ease-out')),
      transition('active => inactive', animate('600ms ease-in'))
    ]),
  ]
})
export class DefectInfoComponent implements OnInit {
  rows = [];
  startDate = new Date();
  endDate = new Date();
  startDateFilter = new Date();
  endDateFilter = new Date();
  chartData: any;
  defectResultSet: any;
  isChartFilterActive = false;
  projectFilter = new FormControl('');
  tempProjectData: any;
  objFilter = {
    'project': '',
    'startDate': new Date(),
    'endDate': new Date()
  };
  isFilterApplied = false;
  isDateSelected = true;
  @ViewChild('elementToFocusChartStart') _inputStart: ElementRef;
  @ViewChild('elementToFocusChartEnd') _inputEnd: ElementRef;
  // doughnutChartLabels = ['highSeverityLevelCount', 'criticalSeverityLevelCount'];
  @ViewChild('baseChart') chart: BaseChartDirective;
  @ViewChild('lineChart') lineChart: BaseChartDirective;
  @ViewChild('doughnutChart') doughnutChart: BaseChartDirective;
  @ViewChild('elementToFocus') _input: ElementRef;
  reorderable = true;
  pieChartFx = 100;
  pieChartheight;
  tableData: any = [];
  testExecutionResource: any;
  tEResultSet = [];
  tECount = 0;
  translations = <DataTableTranslations>{
    expandColumn: 'Expand column',
    selectColumn: 'Select column',
    paginationLimit: 'Max results',
    paginationRange: 'Result range'
  };
  /* divConfig: Object = {
    'application_div': '33.33',
    'application_div_full': '100',
    'application_div_xs': '50',
    'application_div_filter': '30',
    'application_div_xs_filter': '50',
    'application_div_full_filter': '100',
    'job_div': '33.33',
    'job_div_filter': '30',
    'job_div_xs': '50',
    'job_div_xs_filter': '50',
    'job_div_full': '100',
    'job_div_full_filter': '100',
    'defect_div': '33.33',
    'defect_div_filter': '30',
    'defect_div_xs': '50',
    'defect_div_xs_filter': '50',
    'defect_div_full': '100',
    'defect_div_full_filter': '100',
    'layoutProp' : 'row'
  }; */
  filterFlagObj: Object = {
    'isApplicationFilterActive': false,
    'isJobFilterActive': false,
    'isDefectFilterActive': false
  };
  globalChartOptions: any = {
    responsive: true,
    legend: {
      display: true,
      position: 'left'
    },
    maintainAspectRatio: true
  };
  doughnutChartColors: any[] = [{
    backgroundColor: ['#f44336', '#3f51b5', '#ffeb3b', '#ccc', '#4caf50']
  }];
  doughnutChartColorsPriority: any[] = [{
    backgroundColor: ['#f44336', '#ffeb3b', '#ccc', '#4caf50']
  }];
  // doughnutChartLabels: string[] = ['By RootCause', 'By Stage', 'By Priority'];
  doughnutChartData: number[] = [350, 450, 100];
  doughnutChartType = 'doughnut';
  doughnutOptions: any = Object.assign({
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    cutoutPercentage: 78
  }, this.globalChartOptions);
  constructor(public loaderService: LoaderService, public date: DatePipe) {
  }
  cellColor(car) {
    return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7) / 1.3) * 100)) + ')';
  }
  async ngOnInit() {
    let pieErr;
    let err, res;
    this.startDate.setHours(0, 0, 0, 0);
    this.startDateFilter.setHours(0, 0, 0, 0);
    this.loaderService.display(true);
    [pieErr, res] = await (Util.to(this.getChartData()));
    if (!pieErr) {
      this.chartData = res[0];
      [err, this.defectResultSet] = await (Util.to(this.getTableData()));
      this.testExecutionResource = new DataTableResource(this.defectResultSet);
      this.reloadDefectData({ sortBy: 'defectSeverityLevel', sortAsc: false, offset: 0, limit: 4 });
      this.testExecutionResource.count().then(count => this.tECount = count);
      this.loaderService.display(false);
      // console.log(this.defectResultSet);
    }

  }
  async getprojectList() {
    this.tempProjectData = await (DashBoardModel.getAllProjectsList());
  }
  async getTargetEnv() {
    return (DashBoardModel.getTargetEnv());
  }
  async getChartData() {
    //  this.loaderService.display(true);
    return (await (DashBoardModel.getDefectChartData()));
  }
  async getTableData() {
    return (await (DashBoardModel.getDefectTableData(
      this.date.transform(this.startDate, 'yyyy-MM-dd'), this.date.transform(this.endDate, 'yyyy-MM-dd'))));
  }
  reloadDefectData(params) {
    // console.log(params);
    this.testExecutionResource.query(params).then(df => this.defectResultSet = df);
  }
  activeFilter() {
    this.isChartFilterActive = !this.isChartFilterActive;
    if (this.isChartFilterActive) {
      this.getprojectList();
    }
  }
  _openCalendarChartStartDate(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._inputStart.nativeElement.focus());
  }
  _openCalendarChartEndDate(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._inputEnd.nativeElement.focus());
  }
  changeStartDate() {
    // this.endDateFilter = this.startDateFilter;
    this.isDateSelected = true;
    if (this.startDateFilter > this.endDateFilter) {
      alert('start date can\'t be greater than end date');
      // this.startDateFilter = undefined;
      //  this._inputStart.nativeElement.value = null;
      //  this.isDateSelected = false;
      this.startDateFilter = new Date();
      if (this.startDateFilter > this.endDateFilter) {
        this.startDateFilter = new Date();
        this.endDateFilter = new Date();
      }
    }
  }
  changeEndDate() {
    this.isDateSelected = true;
    if (this.startDateFilter > this.endDateFilter) {
      alert('end date can\'t be lesser than start date');
      // this._inputEnd.nativeElement.value = null;
      // this.isDateSelected = false;
      this.endDateFilter = new Date();
      if (this.startDateFilter > this.endDateFilter) {
        this.startDateFilter = new Date();
        this.endDateFilter = new Date();
      }
    }
  }
  async applyFilter() {
    this.loaderService.display(true);
    this.isFilterApplied = true;
    let err;
    if (this.projectFilter) {
      this.objFilter.project = this.projectFilter.value;
    }
    if (this.startDateFilter) {
      this.objFilter.startDate = this.startDateFilter;
    }
    if (this.endDateFilter) {
      this.objFilter.endDate = this.endDateFilter;
    }
    // console.log(this.objFilter);
    [err, this.defectResultSet] = await Util.to(DashBoardModel.getDefectTableData(
      this.date.transform(this.objFilter.startDate, 'yyyy-MM-dd'),
      this.date.transform(this.objFilter.endDate, 'yyyy-MM-dd'), this.objFilter.project));
    if (!err) {
      this.loaderService.display(false);
      this.testExecutionResource = new DataTableResource(this.defectResultSet);
      this.reloadDefectData({ sortBy: 'defectSeverityLevel', sortAsc: false, offset: 0, limit: 4 });
      this.testExecutionResource.count().then(count => this.tECount = count);
      // console.log(this.defectResultSet);
    } else {
      this.loaderService.display(false);
    }
    this.isChartFilterActive = !this.isChartFilterActive;
  }
  async resetFilterValue() {
    let err;
    this.projectFilter.reset();
    this.startDateFilter = new Date();
    this.endDateFilter = new Date();
    this.objFilter.startDate = this.startDateFilter;
    this.objFilter.endDate = this.endDateFilter;
    this.startDateFilter.setHours(0, 0, 0, 0);
    this.isFilterApplied = false;
    this.loaderService.display(true);
    [err, this.defectResultSet] = await (Util.to(this.getTableData()));
    this.testExecutionResource = new DataTableResource(this.defectResultSet);
    this.reloadDefectData({ sortBy: 'defectSeverityLevel', sortAsc: false, offset: 0, limit: 4 });
    this.testExecutionResource.count().then(count => this.tECount = count);
    this.loaderService.display(false);
    this.isChartFilterActive = !this.isChartFilterActive;
  }
  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  // Line Chart
  /* lineChartData: Array <any> = [{
    data: [6, 5, 8, 8, 5, 5, 4],
    label: 'Series A',
    borderWidth: 1
  }, {
    data: [5, 4, 4, 2, 6, 2, 5],
    label: 'Series B',
    borderWidth: 1
  }];
  lineChartLabels: Array <any> = ['1', '2', '3', '4', '5', '6', '7'];
  lineChartOptions: any = Object.assign({
    animation: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        ticks: {
          beginAtZero: true,
          suggestedMax: 9,
        }
      }]
    }
  }, this.globalChartOptions);
  lineChartColors: Array <any> = [{ // grey
    backgroundColor: '#7986cb',
    borderColor: '#3f51b5',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, { // dark grey
    backgroundColor: '#eeeeee',
    borderColor: '#e0e0e0',
    pointBackgroundColor: '#e0e0e0',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  }, { // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];
  lineChartLegend = true;
  lineChartType = 'line';
  lineChartSteppedData: Array <any> = [{
    data: [6, 5, 8, 8, 5, 5, 4],
    label: 'Series A',
    borderWidth: 1,
    fill: false,
    steppedLine: true
  }, {
    data: [5, 4, 4, 2, 6, 2, 5],
    label: 'Series B',
    borderWidth: 1,
    fill: false,
    steppedLine: true
  }];
  lineChartPointsData: Array <any> = [{
    data: [6, 5, 8, 8, 5, 5, 4],
    label: 'Series A',
    borderWidth: 1,
    fill: false,
    pointRadius: 10,
    pointHoverRadius: 15,
    showLine: false
  }, {
    data: [5, 4, 4, 2, 6, 2, 5],
    label: 'Series B',
    borderWidth: 1,
    fill: false,
    pointRadius: 10,
    pointHoverRadius: 15,
    showLine: false
  }]; */
}
