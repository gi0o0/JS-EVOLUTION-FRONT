import { Component, OnInit, ViewChild } from '@angular/core';

import { DTOWfParameter } from '../../../_model/DTOWfParameter';
import { WfParameterService } from '../../../_services/wfparameter/wfparameter.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router} from '@angular/router';

import { DialogMessageComponent } from "../../../_components/dialog-message/dialog-message.component";

@Component({
  selector: 'app-dashboard',
  styleUrls: ['wfparameter.component.css'],
  templateUrl: 'wfparameter.component.html'
})
export class WfParameterComponent implements OnInit {

  public wfParameters: DTOWfParameter[];
  loading: boolean = false;
  displayedColumns = ['id', 'NombreWorkFlow', 'TypeWorkFlow', 'action'];
  dataSource: MatTableDataSource<DTOWfParameter>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private service: WfParameterService, public dialog: MatDialog,private router: Router) { }

  ngOnInit() {

    this.loading = true;
    this.getAll();

  }

  getAll() {
    this.service.listAll().subscribe(async (response: DTOWfParameter[]) => {
      this.wfParameters = new Array<DTOWfParameter>();
      response.forEach(obj => {
        this.wfParameters.push(obj);
      });

      this.dataSource = new MatTableDataSource(this.wfParameters);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      console.log(error);
      this.loading = false;
      this.service.mensajeCambio.next(error.error.mensaje);
    });;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialogoStep(o: DTOWfParameter): void {
    let med = o != null ? o : new DTOWfParameter();
    this.router.navigate(['maintenance/wfparameterstep'], { state: { dto: med } });
  }
  openDialogoState(o: DTOWfParameter): void {
    let med = o != null ? o : new DTOWfParameter();
    this.router.navigate(['maintenance/wfparameterstate'], { state: { dto: med } });
  }

}
