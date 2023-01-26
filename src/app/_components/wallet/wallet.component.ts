import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { WfService } from '../../_services/wf/wf.service';
import { DTOWallet } from '../../_model/DTOWallet';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['wallet.component.css'],
  templateUrl: 'wallet.component.html'
})
export class WalletComponent implements OnInit {

  loading: boolean = false;

  displayedColumns = ['numeroCredito', 'saldoCapital', 'saldoK', 'indicador', 'nomClaaso', 'nomClaasoCod', 'marcacionn', 'estPersonaDeu', 'estPersonaCoDeu'];
  dataSource: MatTableDataSource<DTOWallet>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialogRef: MatDialogRef<WalletComponent>, @Inject(MAT_DIALOG_DATA) public user: string, private wfService: WfService, public dialog: MatDialog) {
    this.user = user;
  }

  ngOnInit() {
    this.getWallet();
  }

  getWallet() {
    this.wfService.listWalletByUser(this.user).subscribe(async (res: DTOWallet[]) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

}
