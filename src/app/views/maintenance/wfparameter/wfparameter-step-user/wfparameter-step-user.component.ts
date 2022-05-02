import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DTOWfStepParameter } from '../../../../_model/DTOWfStepParameter';
import { WfParameterService } from '../../../../_services/wfparameter/wfparameter.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { DTOWfStepParameterAut } from '../../../../_model/DTOWfStepParameterAut';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-dialogo',
  templateUrl: './wfparameter-step-user.component.html',
  styleUrls: ['./wfparameter-step-user.component.css']
})
export class WfParameterStepUserComponent implements OnInit {

  o: DTOWfStepParameterAut;
  public listUser: DTOWfStepParameterAut[];
  displayedColumns = ['user', 'name', 'select'];

  dataSource: MatTableDataSource<DTOWfStepParameterAut>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  loading: boolean = false;

  constructor(private dialogRef: MatDialogRef<WfParameterStepUserComponent>, @Inject(MAT_DIALOG_DATA) private data: DTOWfStepParameter,
    private service: WfParameterService) { }

  ngOnInit() {
    this.loading = true;
    this.getUsers();
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }

  getUsers() {

    this.service.listStepAutsByIds(this.data.idWf, this.data.idPaso).subscribe(async (res: DTOWfStepParameterAut[]) => {
      this.listUser = res;
      this.dataSource = new MatTableDataSource(this.listUser);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  changeChkState(usuario) {

    this.listUser.forEach(chk => {
      if (chk.usuario === usuario) {

        this.loading = true;
        var checked = !chk.state;
        if (checked) {
          this.service.createStepAut(chk).subscribe(data => {
            this.getUsers();
            this.loading = false;
          }, error => {
            this.loading = false;
            console.log(error.error.mensaje);
          });
        } else {
          this.service.deleteStepAut(chk.idWf, chk.idPaso, chk.usuario).subscribe(data => {
            this.getUsers();
            this.loading = false;
          }, error => {
            this.loading = false;
            console.log(error.error.mensaje);
          });
        }

      }
    });
  }
}
