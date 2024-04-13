import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DTOWallet } from '../../../_model/DTOWallet';
import { WfService } from '../../../_services/wf/wf.service';
import { DialogMessageComponent } from '../../../_components/dialog-message/dialog-message.component';

@Component({
  selector: 'app-dialogo',
  templateUrl: './portfoliosearch.component.html',
  styleUrls: ['./portfoliosearch.component.css']
})

export class PortfolioSearchComponent implements OnInit {

  displayedColumns = ['baseDatos','nomTer','numeroCredito', 'saldoCapital', 'saldoK', 'indicador', 'nomClaaso', 'nomClaasoCod', 'marcacionn', 'estPersonaDeu', 'estPersonaCoDeu'];
  dataSource: MatTableDataSource<DTOWallet>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public forma: FormGroup;

  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  loading: boolean = false;
  showFormAdd: boolean = false;
  nitter: string = "";

  constructor(private wfService: WfService, public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.crearFormulario();
  }

  ngOnInit() {}

  getWallet() {
    this.loading = true;
    this.wfService.listPortfolioByUser(this.nitter).subscribe(async (res: DTOWallet[]) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
      console.log(error);
      this.showMessage("ERROR:" + error.error.mensaje);
    });
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      nitter: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,
    });
  }

}
