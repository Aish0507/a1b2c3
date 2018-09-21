import {AfterViewInit, Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {UserAcModel} from '../../models/user-ac.model';
import {LoaderService} from '../../services/loader.service';
import {Util} from '../../helpers/util.helper';
import {UtilService} from '../../services/util.service';
import {ViewUserComponent} from './view-user/view-user.component';
import {DataStorageService} from "../../services/data-storage.service";

@Component({
  selector: 'ssp-user-ac',
  templateUrl: './user-ac.component.html',
  styleUrls: ['./user-ac.component.scss']
})
export class UserAcComponent implements OnInit {
  userDataSource: any;
  allUserList: Array<Object>;
  @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
  temp = [];
  columns = [];
  @ViewChild(MatSort) sort = MatSort;
  constructor(public loaderService: LoaderService,
              public utilService: UtilService,
              public dialog: MatDialog,
              private _data: DataStorageService) { }
 async ngOnInit() {
    this.getAllUserList();
  }

  async openUserInfoDialog(config?: any, userInfo?: any) {
    if (!config) {
      config = {height: '95%', data: { title: 'User Information', body: userInfo }};
    }
     const dialog = Util.dialog.open(ViewUserComponent, config);
    return new Promise(resolve => {
      dialog.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        resolve();
      });
    });
  }

  async getAllUserList() {
    let err;
    this.loaderService.display(true);
    [err, this.allUserList] = await Util.to(UserAcModel.getAllUserList());
    this.temp = [...this.allUserList];
    if (this.allUserList) {
      this.loaderService.display(false);
    }
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function(d) {
      return d.lanId.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.allUserList = temp;
  }
  gotToViewPage(userRow) {
    this._data.data = {
      userInfo: userRow
    };
    UserAcModel.to('dashboard/ua/view-user/' + userRow.userId);
  }
  async deleteUser(userRow) {
    //console.log(userRow);
    if(confirm('Are You Sure to Delete User?')){
      this.loaderService.display(true);
      let err, res;
      [err, res] = await Util.to(UserAcModel.removeUser(userRow.userId));
      if (!err) {
        this.loaderService.display(false);
        alert('user deleted successfully');
        this.getAllUserList();
      } else {
        this.loaderService.display(false);
      }
    }  
  }
}
