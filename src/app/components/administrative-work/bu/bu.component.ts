import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BUModel } from '../../../models/bu.model';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { UpdateBuComponent } from './update-bu/update-bu.component';
import { AddBuComponent } from './add-bu/add-bu.component';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'ssp-bu',
  templateUrl: './bu.component.html',
  styleUrls: ['./bu.component.scss']
})
export class BuComponent implements OnInit {
  BUList: Array<BUModel> = [];
  @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
  temp = [];
  columns = [];
  // dataSource: any;
  constructor(public dialog: MatDialog, private loaderService: LoaderService) { }
  // displayedColumns = ['BuId','Project','BU','BUDetails','action'];
  // @ViewChild(MatSort) sort: MatSort;
  async ngOnInit() {
    this.BUList = await BUModel.getAllBUList();
    this.temp = [...this.BUList];
    // this.dataSource = new MatTableDataSource(this.BUList);
    // this.dataSource.sort = this.sort;
    // console.log("dataSource", this.BUList[0])
  }
  openUpdateDialog(element) {
      const dialogRef = this.dialog.open(UpdateBuComponent, {
      width: '350px',
      data: { buObject: element }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openAddDialog() {
    const dialogRef = this.dialog.open(AddBuComponent, {
    width: '350px',
    data: {  }
  });
  dialogRef.afterClosed().subscribe((result) => {
    this.loaderService.display(true);
    BUModel.getAllBUList().then((data) => {
     if (data) {
      this.BUList = data;
      this.temp = [...data];
       /// this.dataSource = new MatTableDataSource(data);
       this.loaderService.display(false);
     }
   });
 });
}

updateFilter(event) {
  const val = event.target.value.toLowerCase();
  // filter our data
  const temp = this.temp.filter(function(d) {
    return d.buDetails.buName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  // update the AplicationList
  this.BUList = temp;
}

}
export interface Element {
  Project: string;
  BU: number;
}
