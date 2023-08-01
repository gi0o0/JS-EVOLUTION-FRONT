import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { WfService } from '../../_services/wf/wf.service';
import { DTOWallet } from '../../_model/DTOWallet';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DTOWfSteps } from '../../_model/DTOWfSteps';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['step-state.component.css'],
  templateUrl: 'step-state.component.html'
})
export class StepStateComponent implements OnInit {

  loading: boolean = false;

  displayedColumns = ['codTer', 'numeroRadicacion', 'usuario', 'usuarioC', 'fecha', 'idPaso', 'comentarios', 'estPaso', 'numCredito', 'numDoc', 'tipoDocu'];
  dataSource: MatTableDataSource<DTOWallet>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialogRef: MatDialogRef<StepStateComponent>, @Inject(MAT_DIALOG_DATA) public step: DTOWfSteps, private wfService: WfService, public dialog: MatDialog) {
    this.step = step;
  }

  ngOnInit() {
    this.getStepState();
  }

  getStepState() {
    this.wfService.listStepStatesByUserWkRad(this.step.codTer,this.step.idWf,String(this.step.numeroRadicacion)).subscribe(async (res: DTOWallet[]) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

}
