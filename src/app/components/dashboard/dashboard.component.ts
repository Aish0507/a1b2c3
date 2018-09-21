import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TestCaseModel } from '../../models/test-case.model';
import { ProjectModel } from '../../models/project.model';
import { BUModel } from '../../models/bu.model';
import { DashBoardModel } from '../../models/dashboard.model';
import { FormControl } from "@angular/forms";
import { BaseChartDirective } from "ng2-charts";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatDatepicker } from '@angular/material';
import { Util } from "../../helpers/util.helper";
import { LoaderService } from "../../services/loader.service";
import { DatePipe } from '@angular/common';
// import {MatDatepickerModule} from '@angular/material';
import { DataTable, DataTableTranslations, DataTableResource } from '../../data-table';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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
export class DashboardComponent implements OnInit {
  rows = [];
  objFilter = {
    'project': '',
    'bu': '',
    'app': '',
    'env': '',
    'startDate': new Date(),
    'endDate': new Date()
  };
  objChartFilter = {
    'project': '',
    'startDate': new Date(),
    'endDate': new Date()
  };
  application = new FormControl();
  buChartFilter = new FormControl('');
  projectChartFilter = new FormControl('');
  bu = new FormControl();
  app = new FormControl();
  env = new FormControl();
  project = new FormControl();
  isFilterActive: boolean = false;
  isChartFilterActive: boolean = false;
  isDateSelected: boolean = true;
  isTableDateSelected: boolean = true;
  applicationList: Array<TestCaseModel> = [];
  tempProjectData: any;
  buList: any;
  state: string = 'inactive';
  testCaseRowData: any;
  startDate = new Date();
  endDate = new Date();
  startDateChartFilter = new Date();
  endDateChartFilter = new Date();
  isFilterApplied: boolean = false;
  targetEnvList: any;
  @ViewChild('baseChart') chart: BaseChartDirective;
  @ViewChild('lineChart') lineChart: BaseChartDirective;
  @ViewChild('pieChart') pieChart: BaseChartDirective;
  @ViewChild('elementToFocusChartStart') _inputStart: ElementRef;
  @ViewChild('elementToFocusChartEnd') _inputEnd: ElementRef;
  @ViewChild('elementToFocusStart') _start: ElementRef;
  @ViewChild('elementToFocusEnd') _end: ElementRef;
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  buLevelresult: any;
  appLevelresult: any;
  pieChartFx = 100;
  pieChartheight;
  tableData: any = [];
  testExecutionResource: any;
  tEResultSet = [];
  tECount = 0;
  user: User;
  fullName: string;
  @ViewChild(DataTable) filmsTable;
  globalChartOptions: any = {
    responsive: true,
    legend: {
      display: true,
      position: 'left'
    },
    maintainAspectRatio: true
  };

  doughnutChartColors: any[] = [{
    backgroundColor: ['#6093ff', '#ffc44c', '#f87d51']
  }];
  doughnutChartLabels: string[] = ['By RootCause', 'By Stage', 'By Priority'];
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
  pieChartLabels: string[] = ['Total Executed', 'Total Running', 'Total Scheduled'];
  pieChartData: number[] = [300, 500, 100];
  constructor(public loaderService: LoaderService, public date: DatePipe) {
    this.fetchTCResult();
  }
  reloadTestExecution(params) {
    console.log(params);
    this.testExecutionResource.query(params).then(te => this.tEResultSet = te);
  }

  cellColor(car) {
    return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7) / 1.3) * 100)) + ')';
  }
  async getTabularJobsApplicationResults() {
    let err;
    [err, this.tableData] = await Util.to(DashBoardModel.getTabularJobsApplicationResults(
      this.date.transform(this.startDate, 'yyyy-MM-dd'), this.date.transform(this.endDate, 'yyyy-MM-dd')));
    if (!err) {
      this.appLevelresult = this.tableData.appSummary;
      this.testExecutionResource = new DataTableResource(this.tableData.data);
      this.reloadTestExecution({ sortBy: 'endTime', sortAsc: false, offset: 0, limit: 4 });
      this.testExecutionResource.count().then(count => this.tECount = count);
      this.loaderService.display(false);
    } else {
      this.testExecutionResource = new DataTableResource(this.tableData.data);
      this.reloadTestExecution({ sortBy: 'endTime', sortAsc: false, offset: 0, limit: 4 });
      this.testExecutionResource.count().then(count => this.tECount = count);
      this.loaderService.display(false);
    }
  }
  // special params:

  translations = <DataTableTranslations>{
    expandColumn: 'Expand column',
    selectColumn: 'Select column',
    paginationLimit: 'Max results',
    paginationRange: 'Result range'
  };
  /* testCasedata: any = [
    {
      project: "project 1",
      bu: "bu 1",
      application: "app 1",
      totalTc: "10",
      totalPassedTc: "7",
      totalFailedTc: "3"

    },
    {
      project: "project 1",
      bu: "bu 2",
      application: "app 2",
      totalTc: "6",
      totalPassedTc: "4",
      totalFailedTc: "2"
    },
    {
      project: "project 1",
      bu: "bu 2",
      application: "app 2",
      totalTc: "110",
      totalPassedTc: "65",
      totalFailedTc: "45"
    },
    {
      project: "project 1",
      bu: "bu 2",
      application: "app 2",
      totalTc: "500",
      totalPassedTc: "300",
      totalFailedTc: "200"
    },
    {
      project: "project 1",
      bu: "bu 2",
      application: "app 2",
      totalTc: "100",
      totalPassedTc: "70",
      totalFailedTc: "30"
    },
    {
      project: "project 1",
      bu: "bu 2",
      application: "app 2",
      totalTc: "56",
      totalPassedTc: "30",
      totalFailedTc: "26"
    },
    {
      project: "project 1",
      bu: "bu 2",
      application: "app 2",
      totalTc: "50",
      totalPassedTc: "40",
      totalFailedTc: "10"
    }
  ]; */
  divConfig: Object = {
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
    'layoutProp': 'row'
  };
  filterFlagObj: Object = {
    'isApplicationFilterActive': false,
    'isJobFilterActive': false,
    'isDefectFilterActive': false
  };

  /*  // Bar
   barChartLabels: string[] = ['App-1', 'App-2', 'App-3', 'App-4', 'App-5', 'App-6', 'App-7'];
   barChartType = 'bar';
   barChartLegend = true;
   barChartData: any[] = [{
     data: [6, 5, 8, 8, 5, 5, 4],
     label: 'Pass',
     borderWidth: 0
   }, {
     data: [5, 4, 4, 2, 6, 2, 5],
     label: 'Fail',
     borderWidth: 0
   }];
   barChartOptions: any = Object.assign({
     scaleShowVerticalLines: false,
     tooltips: {
       mode: 'index',
       intersect: false
     },
     responsive: true,
     scales: {
       xAxes: [{
         gridLines: {
           color: 'rgba(0,0,0,0.02)',
           defaultFontColor: 'rgba(0,0,0,0.02)',
           zeroLineColor: 'rgba(0,0,0,0.02)'
         },
         stacked: true,
         ticks: {
           beginAtZero: true,
           autoSkip: false,
           maxRotation: 60,
           minRotation: 60
         }
       }],
       yAxes: [{
         gridLines: {
           color: 'rgba(0,0,0,0.02)',
           defaultFontColor: 'rgba(0,0,0,0.02)',
           zeroLineColor: 'rgba(0,0,0,0.02)'
         },
         stacked: true
       }]
     }
   }, this.globalChartOptions);
 
   // Horizontal Bar Chart
   barChartHorizontalType = 'horizontalBar';
   barChartHorizontalOptions: any = Object.assign({
     scaleShowVerticalLines: false,
     scales: {
       xAxes: [{
         gridLines: {
           color: 'rgba(0,0,0,0.02)',
           zeroLineColor: 'rgba(0,0,0,0.02)'
         },
         ticks: {
           beginAtZero: true,
           suggestedMax: 9
         }
       }],
       yAxes: [{
         gridLines: {
           color: 'rgba(0,0,0,0.02)',
           zeroLineColor: 'rgba(0,0,0,0.02)'
         }
       }]
     }
   }, this.globalChartOptions);
 
   // Bar Chart Stacked
   barChartStackedOptions: any = Object.assign({
     scaleShowVerticalLines: false,
     tooltips: {
       mode: 'index',
       intersect: false
     },
     responsive: true,
     scales: {
       xAxes: [{
         gridLines: {
           color: 'rgba(0,0,0,0.02)',
           zeroLineColor: 'rgba(0,0,0,0.02)'
         },
         stacked: true,
         ticks: {
           beginAtZero: true
         }
       }],
       yAxes: [{
         gridLines: {
           color: 'rgba(0,0,0,0.02)',
           zeroLineColor: 'rgba(0,0,0,0.02)'
         },
         stacked: true
       }]
     }
   }, this.globalChartOptions);
 */
  // Doughnut
  /*
    // Line Chart
    lineChartData: Array <any> = [{
      data: [6, 5, 8, 8, 5, 5, 4],
      label: 'Pass',
      borderWidth: 1
    }, {
      data: [5, 4, 4, 2, 6, 2, 5],
      label: 'Fail',
      borderWidth: 1
    }];
    lineChartLabels: Array <any> = ['Job-Name-1', 'Job-Name-2', 'Job-Name-3', 'Job-Name-4', 'Job-Name-5', 'Job-Name-6', 'Job-Name-7'];
    lineChartOptions: any = Object.assign({
      animation: false,
      scales: {
        xAxes: [{
          gridLines: {
            color: 'rgba(0,0,0,0.02)',
            zeroLineColor: 'rgba(0,0,0,0.02)'
          },
          ticks: {
            beginAtZero: true,
            autoSkip: false,
            maxRotation: 60,
            minRotation: 60
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
    }];
    lineChartPointsOptions: any = Object.assign({
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
      },
      elements: {
        point: {
          pointStyle: 'rectRot',
        }
      }
    }, this.globalChartOptions);
  
    // Bubble Chart
    bubbleChartData: Array <any> = [{
      data: [{
        x: 6,
        y: 5,
        r: 15,
      }, {
        x: 5,
        y: 4,
        r: 10,
      }, {
        x: 8,
        y: 4,
        r: 6,
      }, {
        x: 8,
        y: 4,
        r: 6,
      }, {
        x: 5,
        y: 14,
        r: 14,
      }, {
        x: 5,
        y: 6,
        r: 8,
      }, {
        x: 4,
        y: 2,
        r: 10,
      }],
      label: 'Series A',
      borderWidth: 1
    }];
    bubbleChartType = 'bubble';
  
    // Combo Chart
    ComboChartData: Array <any> = [{
      data: [6, 5, 8, 8, 5, 5, 4],
      label: 'Series A',
      borderWidth: 1,
      type: 'line',
      fill: false
    }, {
      data: [5, 4, 4, 2, 6, 2, 5],
      label: 'Series B',
      borderWidth: 1,
      type: 'bar',
    }];
    ComboChartLabels: Array <any> = ['1', '2', '3', '4', '5', '6', '7'];
    ComboChartOptions: any = Object.assign({
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
  */
  // Pie
  // doughnutChartType = 'doughnut';
  /*// PolarArea
  
    polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
    polarAreaChartData: any = [300, 500, 100, 40, 120];
    polarAreaLegend = true;
    polarAreaChartType = 'polarArea';
  
    // Radar
    radarChartLabels: string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
    radarChartData: any = [{
      data: [65, 59, 90, 81, 56, 55, 40],
      label: 'Series A'
    }, {
      data: [28, 48, 40, 19, 96, 27, 100],
      label: 'Series B'
    }];
    radarChartType = 'radar';
    constructor() {
      this.fetch((data) => { this.rows = data; });
    }
    // project table
    */
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/projects.json`);
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }

  async ngOnInit() {
    let pieErr;
    this.user = User.Auth();
    this.fullName = this.user.full_name;
    this.startDate.setHours(0, 0, 0, 0);
    this.startDateChartFilter.setHours(0, 0, 0, 0);
    // this.loaderService.display(true);
    [pieErr, this.buLevelresult] = await Util.to(this.getChartData());
    if (!pieErr) {
      this.calculateChartSize();
    }
    // this.appLevelresult = await this.ApplicationLevelResult();
    this.targetEnvList = await (this.getTargetEnv());
  }
  async getTargetEnv() {
    return (DashBoardModel.getTargetEnv());
  }
  async ApplicationLevelResult() {
    return (await (DashBoardModel.getAppLevelResult(this.date.transform(this.startDate, 'yyyy-MM-dd'),
      this.date.transform(this.endDate, 'yyyy-MM-dd'))));
  }
  calculateChartSize() {
    this.pieChartFx = 100 / this.buLevelresult.length;
    if (this.buLevelresult.length === 1) {
      this.pieChartheight = 120;
    } else {
      this.pieChartheight = 200;
    }
  }
  async getChartData() {
    //  this.loaderService.display(true);
    // const abcd = this.date.transform(this.startDateChartFilter, 'yyyy-MM-dd');
    return (await (DashBoardModel.getBuLevelResult(
      this.date.transform(this.startDateChartFilter, 'yyyy-MM-dd'), this.date.transform(this.endDateChartFilter, 'yyyy-MM-dd'))));
  }
  async fetchTCResult() {
    this.loaderService.display(true);
    let testErr;
    [testErr, this.applicationList] = await Util.to(DashBoardModel.getAllAppsList());
    if (!testErr) {
      // this.applicationList = await DashBoardModel.getAllAppsList();
      this.tempProjectData = await DashBoardModel.getAllProjectsList();
      this.getBuList();
      this.getTabularJobsApplicationResults();

    }
  }
  async getBuList() {
    let buErr;
    [buErr, this.buList] = await Util.to(DashBoardModel.getAllBUList());
    if (!buErr) {
      // this.loaderService.display(false);
    }
  }
  activeFilter() {
    this.isFilterActive = !this.isFilterActive;
    /* this.filterFlagObj['isApplicationFilterActive'] = !this.filterFlagObj['isApplicationFilterActive'];
    this.application.reset();
    this.bu.reset();
    this.project.reset(); */
  }
  activeChartFilter() {
    this.isChartFilterActive = !this.isChartFilterActive;
  }
  async applyFilter() {
    this.loaderService.display(true);
    this.isFilterApplied = true;
    let err;
    /* let objFilter = {
      'project': '',
      'bu': '',
      'startDate': new Date(),
      'endDate': new Date()
    }; */
    if (this.projectChartFilter) {
      this.objChartFilter.project = this.projectChartFilter.value;
    }
    /* if (this.buChartFilter) {
      this.objChartFilter.bu = this.buChartFilter.value;
    } */
    if (this.startDateChartFilter) {
      this.objChartFilter.startDate = this.startDateChartFilter;
    }
    if (this.endDateChartFilter) {
      this.objChartFilter.endDate = this.endDateChartFilter;
    }
    [err, this.buLevelresult] = await Util.to(DashBoardModel.getBuLevelResult(
      this.date.transform(this.objChartFilter.startDate, 'yyyy-MM-dd'),
      this.date.transform(this.objChartFilter.endDate, 'yyyy-MM-dd'), this.objChartFilter.project));
    if (!err) {
      this.loaderService.display(false);
    } else {
      this.loaderService.display(false);
    }
    this.isChartFilterActive = !this.isChartFilterActive;
    // console.log(this.projectChartFilter.value);
  }
  resetFilterValue() {
    // this.application.reset();
    this.bu.reset();
    this.project.reset();
    this.env.reset();
    this.app.reset();
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setHours(0, 0, 0, 0);
    this.objFilter.startDate = this.startDate;
    this.objFilter.endDate = this.endDate;
    this.fetchTCResult();
    this.isFilterActive = !this.isFilterActive;
    // this.endDate.setHours(0, 0, 0, 0);
  }
  async resetChartFilterValue() {
    let pieErr;
    this.buChartFilter.reset();
    this.projectChartFilter.reset();
    this.startDateChartFilter = new Date();
    this.endDateChartFilter = new Date();
    this.objChartFilter.startDate = this.startDateChartFilter;
    this.objChartFilter.endDate = this.endDateChartFilter;
    this.startDateChartFilter.setHours(0, 0, 0, 0);
    this.isFilterApplied = false;
    this.loaderService.display(true);
    [pieErr, this.buLevelresult] = await Util.to(this.getChartData());
    this.loaderService.display(false);
    this.isChartFilterActive = !this.isChartFilterActive;
    // this.endDateChartFilter.setHours(0, 0, 0, 0);
    /* this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(0, 0, 0, 0); */
  }
  reloadApplicationChart() {
    /* if (this.chart !== undefined) {
      this.chart.chart.destroy();
      this.chart.chart = 0;
      this.chart.datasets = this.barChartData;
      this.chart.ngOnInit();
    } */
  }
  reloadJobChart() {
    /* if (this.lineChart !== undefined) {
      this.lineChart.chart.destroy();
      this.lineChart.chart = 0;
      this.lineChart.datasets = this.lineChartData;
      this.lineChart.ngOnInit();
    } */
  }
  reloadDefectChart() {
    // pieChartData
    if (this.pieChart !== undefined) {
      this.pieChart.chart.destroy();
      this.pieChart.chart = 0;
      this.pieChart.datasets = this.pieChartData; // [Math.floor((Math.random() * 100) + 1), Math.floor((Math.random() * 100) + 1), 30];
      this.pieChart.ngOnInit();
    }
  }
  applicationGraphFilter() {
    // divConfig: Object = {
    //   'application_div': '33.33',
    //   'job_div': '33.33',
    //   'defect_div': '33.33',
    //   'application_div_xs': '50',
    //   'job_div_xs': '50',
    //   'defect_div_xs': '50',
    //   'application_div_full': '100',
    //   'job_div_full': '100',
    //   'defect_div_full': '100'
    // };
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
    this.divConfig['application_div'] = '33.33';
    this.filterFlagObj['isApplicationFilterActive'] = true;
    // rest job
    this.divConfig['job_div'] = '33.33';
    this.filterFlagObj['isJobFilterActive'] = false;
  }
  jobGraphFilter() {
    // Set new value for Job
    this.divConfig['job_div'] = '33.33';
    this.filterFlagObj['isJobFilterActive'] = !this.filterFlagObj['isJobFilterActive'];
  }
  defectGraphFilter() {
    this.divConfig['defect_div'] = '33.33';
    this.filterFlagObj['isDefectFilterActive'] = true;
  }
  closeApplicationGraphFilter() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
    this.divConfig['application_div'] = '33.33';
    this.filterFlagObj['isApplicationFilterActive'] = false;
  }
  closeJobGraphFilter() {
    // 2nd set Job
    // this.state = (this.state === 'inactive' ? 'active' : 'inactive');
    this.divConfig['job_div'] = '33.33';
    this.filterFlagObj['isJobFilterActive'] = !this.filterFlagObj['isJobFilterActive'];
  }
  closeDefectGraphFilter() {
    this.divConfig['defect_div'] = '33.33';
    this.filterFlagObj['isDefectFilterActive'] = false;
  }
  applyFilterForJob() {
    // this.lineChartData[0].data = [Math.floor((Math.random() * 100) + 1), 15, 10, 10, 15, 13, 14];
    // this.lineChartData[1].data = [12, Math.floor((Math.random() * 100) + 1), 14, 15, 11, 16, 17];
    this.reloadJobChart();
    this.closeJobGraphFilter();
  }
  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
    // setTimeout(() => this._input.nativeElement.focus());
  }
  /*  _openChartCalendar(picker: MatDatepicker<Date>) {
     picker.open();
     setTimeout(() => this._input.nativeElement.focus());
   } */
  _openCalendarChartStartDate(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._inputStart.nativeElement.focus());
  }
  _openCalendarChartEndDate(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._inputEnd.nativeElement.focus());
  }
  _closeCalendar(e) {
    setTimeout(() => this._start.nativeElement.blur());
  }
  _openCalendarStart(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._start.nativeElement.focus());
  }
  _openCalendarEnd(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._end.nativeElement.focus());
  }
  getHeight() {
    return {
      'height': this.pieChartheight
    };
  }
  async applyFilterForTable() {
    this.loaderService.display(true);
    let err;
    /* this.objFilter = {
      'project': '',
      'bu': '',
      'app':'',
      'startDate': new Date(),
      'endDate': new Date()
    }; */
    if (this.project) {
      this.objFilter.project = this.project.value;
    }
    if (this.bu) {
      this.objFilter.bu = this.bu.value;
    }
    if (this.startDate) {
      this.objFilter.startDate = this.startDate;
    }
    if (this.app && this.app.value !== 'All') {
      this.objFilter.app = this.app.value;
    }
    if (this.env) {
      this.objFilter.env = this.env.value;
    }
    if (this.endDate) {
      this.objFilter.endDate = this.endDate;
    }
    // console.log(this.objFilter);
    [err, this.tableData] = await Util.to(DashBoardModel.getTabularJobsApplicationResults(
      this.date.transform(this.objFilter.startDate, 'yyyy-MM-dd'),
      this.date.transform(this.objFilter.endDate, 'yyyy-MM-dd'), this.objFilter));
    // this.reloadTestExecution();
    if (!err) {
      this.appLevelresult = this.tableData.appSummary;
      this.testExecutionResource = new DataTableResource(this.tableData.data);
      this.reloadTestExecution({ sortBy: 'endTime', sortAsc: false, offset: 0, limit: 4 });
      this.testExecutionResource.count().then(count => this.tECount = count);
      this.loaderService.display(false);
    } else {
      this.loaderService.display(false);
    }
    this.isFilterActive = !this.isFilterActive;
  }
  getHeightForNoData() {
    return {
      'height': '96%'
    };
  }
  changeStartDate() {
    // this.endDateChartFilter = this.startDateChartFilter;
    this.isDateSelected = true;
    if (this.startDateChartFilter > this.endDateChartFilter) {
      alert('start date can\'t be greater than end date');
      // this.startDateChartFilter = undefined;
      //  this._inputStart.nativeElement.value = null;
      //  this.isDateSelected = false;
      this.startDateChartFilter = new Date();
      if (this.startDateChartFilter > this.endDateChartFilter) {
        this.startDateChartFilter = new Date();
        this.endDateChartFilter = new Date();
      }
    }
  }
  changeEndDate() {
    this.isDateSelected = true;
    if (this.startDateChartFilter > this.endDateChartFilter) {
      alert('end date can\'t be lesser than start date');
      //  this._inputEnd.nativeElement.value = null;
      //  this.isDateSelected = false;
      this.endDateChartFilter = new Date();
      if (this.startDateChartFilter > this.endDateChartFilter) {
        this.startDateChartFilter = new Date();
        this.endDateChartFilter = new Date();
      }
    }
  }
  changeTableStartDate() {
    // this.endDateChartFilter = this.startDateChartFilter;
    this.isTableDateSelected = true;
    if (this.startDate > this.endDate) {
      alert('start date can\'t be greater than end date');
      // this.startDateChartFilter = undefined;
      // this._start.nativeElement.value = null;
      // this.isTableDateSelected = false;
      this.startDate = new Date();
      if ( this.startDate > this.endDate ) {
        this.startDate = new Date();
        this.endDate = new Date();
      }
    }
  }
  changeTableEndDate() {
    this.isTableDateSelected = true;
    if (this.startDate > this.endDate) {
      alert('end date can\'t be lesser than start date');
      // this._end.nativeElement.value = null;
      // this.isTableDateSelected = false;
      this.endDate = new Date();
      if ( this.startDate > this.endDate ) {
        this.startDate = new Date();
        this.endDate = new Date();
      }
    }
  }
}
