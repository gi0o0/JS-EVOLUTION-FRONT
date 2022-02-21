import { Component, OnInit, ViewChild } from '@angular/core';

import { DTOParameter } from '../../../_model/DTOParameter';
import { ParameterService } from '../../../_services/parameter/parameter.service';
import { ParameterEditionComponent } from './parameter-edition/parameter-edition.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { DialogMessageComponent } from "../../../_components/dialog-message/dialog-message.component";
import { DialogConfirmationComponent } from "../../../_components/dialog-confirmation/dialog-confirmation.component";

@Component({
  selector: 'app-dashboard',
  styleUrls: ['parameter.component.css'],
  templateUrl: 'parameter.component.html'
})
export class ParameterComponent implements OnInit {

  public listParameters: DTOParameter[];
  loading: boolean = false;
  displayedColumns = ['id', 'text' , 'value', 'action'];
  dataSource: MatTableDataSource<DTOParameter>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private parameterService: ParameterService, public dialog: MatDialog,) { }

  ngOnInit() {

    this.loading = true;

    this.parameterService.profileCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


    this.parameterService.mensajeCambio.subscribe(data => {

      this.dialog.open(DialogMessageComponent, {
        width: '350px',
        data: data
      });

    });

    this.getParameters();

  }


  getParameters() {
    this.parameterService.listAll().subscribe(async (res: DTOParameter[]) => {
      this.listParameters = new Array<DTOParameter>();
      res.forEach(pa => {
        this.listParameters.push(pa);
      });

      this.dataSource = new MatTableDataSource(this.listParameters);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.parameterService.mensajeCambio.next(error.error.mensaje);
    });;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(o?: DTOParameter) {
    let med = o != null ? o : new DTOParameter();
    this.dialog.open(ParameterEditionComponent, {
      width: '300px',
      data: med
    });
  }
  mostrarDialogo(o: DTOParameter): void {
    this.dialog
      .open(DialogConfirmationComponent, {
        width: '300px',
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.eliminar(o)
        }
      });
  }

  eliminar(o: DTOParameter) {
    this.loading = true;
    this.parameterService.delete(o).subscribe(data => {
      this.parameterService.listAll().subscribe(profiles => {
        this.parameterService.profileCambio.next(profiles);
        this.loading = false;
        this.parameterService.mensajeCambio.next("Se elimino");

      });
    }, error => {
      this.loading = false;
      this.dialog.open(DialogMessageComponent, {
        width: '300px',
        data: error.error.mensaje
      });
    });
  }

}
