import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material";
import {ViewUserComponent} from "../view-user/view-user.component";
import {Util} from "../../../helpers/util.helper";
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'ssp-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss']
})
export class TableDataComponent implements OnInit {
  @Input() items: any;
  displayedColumns = ['id', 'applicationName', 'buName', 'projectName', 'action'];
  dataSource: any;
  constructor(public loaderService: LoaderService, public _parent?: ViewUserComponent) {
    this.dataSource = new MatTableDataSource(this.items);
  }

  ngOnInit() {
    // console.log(this.items);
    this.dataSource = new MatTableDataSource(this.items);
  }
  async removeItem(dataRow) {
    let err, res;
    if(confirm('Are You sure to remove '+dataRow.application.applicationName+' Application?')){
      this.loaderService.display(true);
      [err, res] = await Util.to(this._parent.removeItemFromTable(dataRow));
      this.dataSource = new MatTableDataSource(res);
      if (!err) {
        alert('Application '+dataRow.application.applicationName+' access revoked.');
      }
      this.loaderService.display(false);
    }  
  }

}
