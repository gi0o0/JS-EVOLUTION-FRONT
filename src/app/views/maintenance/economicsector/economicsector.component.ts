import { Component, OnInit, ViewChild } from '@angular/core';
import { DTOEconomicsector } from '../../../_model/DTOEconomicsector';
import { EconomicsectorService } from '../../../_services/economicsector/economicsector.service';
import { EconomicsectorEditionComponent } from './economicsector-edition/economicsector-edition.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { DialogMessageComponent } from "../../../_components/dialog-message/dialog-message.component";
import { DialogConfirmationComponent } from "../../../_components/dialog-confirmation/dialog-confirmation.component";

@Component({
  selector: 'app-dashboard',
  styleUrls: ['economicsector.component.css'],
  templateUrl: 'economicsector.component.html'
})
export class EconomicsectorComponent implements OnInit {

  public listEconomicsectors: DTOEconomicsector[];
  loading: boolean = false;
  displayedColumns = ['codsec', 'nomsec' , 'action'];
  dataSource: MatTableDataSource<DTOEconomicsector>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private economicsectorService: EconomicsectorService, public dialog: MatDialog,) { }

  ngOnInit() {

    this.loading = true;

    this.economicsectorService.sectorCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


    this.economicsectorService.mensajeCambio.subscribe(data => {

      this.dialog.open(DialogMessageComponent, {
        width: '350px',
        data: data
      });

    });

    this.getEconomicsectors();

  }


  getEconomicsectors() {
    this.economicsectorService.listAll().subscribe(async (res: DTOEconomicsector[]) => {
      this.listEconomicsectors = new Array<DTOEconomicsector>();
      res.forEach(pa => {
        this.listEconomicsectors.push(pa);
      });

      this.dataSource = new MatTableDataSource(this.listEconomicsectors);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.economicsectorService.mensajeCambio.next(error.error.mensaje);
    });;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(o?: DTOEconomicsector) {
    let med = o != null ? o : new DTOEconomicsector();
    this.dialog.open(EconomicsectorEditionComponent, {
      width: '300px',
      data: med 
    });
  }
  mostrarDialogo(o: DTOEconomicsector): void {
    let messageDelete = new String("Seguro de Eliminar el Sector: ".concat(o.codSec,"-",o.nomSec));
    this.dialog
      .open(DialogConfirmationComponent, {
        width: '300px',
        data: messageDelete,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.eliminar(o)
        }
      });
  }

  eliminar(o: DTOEconomicsector) {
    this.loading = true;
    this.economicsectorService.delete(o.codSec).subscribe(data => {
      this.economicsectorService.listAll().subscribe(o => {
        this.economicsectorService.sectorCambio.next(o);
        this.loading = false;
        this.economicsectorService.mensajeCambio.next("Operación Correcta. Sector Económico eliminado.");

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
