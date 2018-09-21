import {Component, ElementRef, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import {TestCaseModel} from '../../../models/test-case.model';
import {UtilService} from '../../../services/util.service';
import {Util} from '../../../helpers/util.helper';
import {LoaderService} from '../../../services/loader.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {FormControl} from '@angular/forms';

interface App {
  'applicationId': any;
  'applicationName': any;
  'applicationDetails': any;
  'almTestcaseId': any;
  'applicationType': any;
  'bu':{
    'buId': any;
    'buName': any;
    'buDetails': any;
  };
  'job':{
    'jobId': any;
    'jobName': any;
    'creationTime': any;
  };
}

@Component({
  selector: 'ssp-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {
  @ViewChild('uploadTC') uploadTC: any;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  aplicationList: any = [];
  aplicationType: any = [{
    'name' : 'SELENIUM',
    'value' : 'SELENIUM'
  },
    {
      'name' : 'UFT',
      'value' : 'UFT'
    }];
  appType: any;
  public selectedAppFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  /** list of filtered by search keyword */
  public filteredApp: ReplaySubject<App[]> = new ReplaySubject<App[]>(1);
  appId: any;
  constructor (private utilService: UtilService,
               private loaderService: LoaderService) {
    this.uploader = new FileUploader({
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        this.onFileChange(item);
      }
    });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe( res => this.response = res );
  }
  async ngOnInit() {
    this.selectedAppFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAppList();
      });
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  async onChangeObj(obj) {
    this.loaderService.display(true);
    let err;
    [err, this.aplicationList] = await Util.to(TestCaseModel.getAllApplications());
    if (!err) {
      this.aplicationList = this.utilService.filterApplicationArray(this.aplicationList, obj);
      this.filteredApp.next(this.aplicationList.slice());
      this.loaderService.display(false);
    }
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  filterAppList() {
    if (!this.aplicationList) {
      return;
    }
    // get the search keyword
    let search = this.selectedAppFilterCtrl.value;
    // alert(search);
    if (!search) {
      this.filteredApp.next(this.aplicationList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the array ..
    // this.applicationDataSet = (this.applicationDataSet.filter(app => app.applicationName.toLowerCase().indexOf(search) > -1));
    this.filteredApp.next(
      this.aplicationList.filter(app => app.applicationName.toLowerCase().indexOf(search) > -1)
    );
  }
  async onFileChange(file) {
    this.loaderService.display(true);
    let err, res;
    // console.log('file data', (file._file.name));
    [err, res] = await Util.to(TestCaseModel.uploadTestcasesByAppID(file._file,
      typeof this.appId === 'number' ? this.appId : this.appId.join(',')));
    if (!err) {
      this.uploader.clearQueue();
      this.appId = null;
      this.appType = null;
      this.uploadTC.nativeElement.value = null;
      this.loaderService.display(false);
      const config = {data: { title: 'Alert', body: res.message }};
      Util.openDefaultDialog(config);
    }
  }
  clearUploadTCQueue() {
    this.uploader.clearQueue();
    this.appId = null;
    this.appType = null;
    this.uploadTC.nativeElement.value = null;
  }
  // handleFileSelect(evt) {
  //   var files = evt.target.files; // FileList object
  //   console.log("handleFileSelect", files);
  //   // files is a FileList of File objects. List some properties.
  //   var output = [];
  //   for (var i = 0, f; f = files[i]; i++) {
  //     output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
  //                 f.size, ' bytes, last modified: ',
  //                 f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
  //                 '</li>');
  //   }
  //   document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  // }

  // document.getElementById('files').addEventListener('change', handleFileSelect, false);
}
