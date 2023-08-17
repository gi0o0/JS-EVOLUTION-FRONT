import { Component, OnInit, ViewChild } from '@angular/core';

import { DTODoc } from '../../../_model/DTODoc';
import { DocsService } from '../../../_services/docs/docs.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXP_REGULAR_NUMERO } from '../../../_shared/constantes';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['docs.component.css'],
  templateUrl: 'docs.component.html'
})
export class DocsComponent implements OnInit {

  public listaDocs: DTODoc[];
  loading: boolean = false;
  displayedColumns = ['NombreDocumento', 'action'];
  dataSource: MatTableDataSource<DTODoc>;
  public forma: FormGroup;
  public errorServicio: boolean;
  public showFile: boolean;
  pdfSrc: ArrayBuffer;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  o: DTODoc;

  constructor(private service: DocsService, public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.o = new DTODoc();
    this.errorServicio = false;
    this.showFile = false;
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      user: ['', [Validators.required, Validators.pattern(EXP_REGULAR_NUMERO), Validators.maxLength(15)]],
      request: ['0', [Validators.pattern(EXP_REGULAR_NUMERO), Validators.maxLength(15)]]
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }



  operar() {
    this.showFile = false;
    if (!this.validarErroresCampos()) {
      this.loading = true;
      this.getDocs();
    }
  }

  validarErroresCampos = () => {
    let errorCampos = false;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      });
      this.errorServicio = false;
      errorCampos = true;
    }
    return errorCampos;
  }

  getDocs() {

    if (this.o.request == undefined)
      this.o.request = "0";
    if (this.o.idDoc == undefined)
      this.o.idDoc = "0";
    this.service.listDocsByIds(this.o.user, this.o.request, this.o.idDoc).subscribe(async (response: DTODoc[]) => {
      this.listaDocs = response;
      this.dataSource = new MatTableDataSource(this.listaDocs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      console.log(error);
      this.loading = false;
    });;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openView(o?: DTODoc) {
    this.loading = true;
    this.showFile = false;

    this.service.listDocsByIds(o.user, o.request,o.idDoc).subscribe(async (response: DTODoc[]) => {
      this.loading = false;
      this.pdfSrc = this._base64ToArrayBuffer(response[0].encode);
      this.showFile = true;
      this.o=response[0];
    }, error => {
      console.log(error);
      this.loading = false;
    });;
  }

  download() {
    const source = `data:application/pdf;base64,${this.o.encode}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${this.o.name}`
    link.click();
    }

  _base64ToArrayBuffer(base64) {
    var binary_string = base64.replace(/\\n/g, '');
    binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

}
