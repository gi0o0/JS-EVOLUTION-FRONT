import { Component, OnInit, ViewChild } from '@angular/core';
import { DTOWfParameter } from '../../../../_model/DTOWfParameter';
import { WfParameterService } from '../../../../_services/wfparameter/wfparameter.service';
import { Router } from '@angular/router';
import { DTOWfEstParameter } from '../../../../_model/DTOWfEstParameter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO, EXP_REGULAR_NUMERO, EXP_REGULAR_NUMERO_MAX, EXP_REGULAR_CORREO } from '../../../../_shared/constantes';
import { DialogConfirmationComponent } from "../../../../_components/dialog-confirmation/dialog-confirmation.component";
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo',
  templateUrl: './wfparameter-state.component.html',
  styleUrls: ['./wfparameter-state.component.css']
})
export class WfParameterStateComponent implements OnInit {

  o: DTOWfParameter;
  ests: DTOWfEstParameter;
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  listEsts: DTOWfEstParameter[];
  loading: boolean = false;
  showFormAdd: boolean = false;
  displayedColumns = ['idEstado', 'nomEstado', 'ordEstado', 'action'];

  dataSource: MatTableDataSource<DTOWfEstParameter>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private service: WfParameterService, private formBuilder: FormBuilder, public dialog: MatDialog,) {
    this.o = this.router.getCurrentNavigation().extras.state.dto;
    this.crearFormulario();
  }

  ngOnInit() {
    this.loading = true;
    this.ests = new DTOWfEstParameter();
    this.ests.idWf = this.o.id;
    this.getEsts();

  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      nomEstado: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]],
      indInicio: ['', [Validators.maxLength(100)]],
      indFinal: ['', [Validators.maxLength(100)]],
      ordEstado: ['', [Validators.required, Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }

  getEsts() {

    this.service.listEstById(this.o.id).subscribe(async (res: DTOWfEstParameter[]) => {
      this.listEsts = new Array<DTOWfEstParameter>();
      res.forEach(r => {
        this.listEsts.push(r);
      });
      this.dataSource = new MatTableDataSource(this.listEsts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  actualizar(o?: DTOWfEstParameter) {
    let med = o != null ? o : new DTOWfEstParameter();
    this.ests = med;
    this.showForm();
  }


  operar() {
    if (!this.validarErroresCampos()) {
      this.loading = true;

      if (this.ests.idWf != null && this.ests.idEstado != null) {
        this.service.updateEsts(this.ests).subscribe(data => {
          this.getEsts();
          this.showMessage("Estado Actualizado");
          this.resetForm();
          this.showFormAdd = false;
        }, error => {
          this.showMessage(error.error.mensaje);
          this.resetForm();
        });
      } else {
        this.service.createEsts(this.ests).subscribe(data => {
          this.getEsts();
          this.showMessage("Estado Ingresado.");
          this.resetForm();
          this.showFormAdd = false;
        }, error => {
          this.showMessage(error.error.mensaje);
        });
      }

    }
  }

  resetForm() {
    this.forma.reset;
    this.myForm.resetForm();
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

  returnToPage() {
    this.router.navigate(['maintenance/wfparameter']);
  }

  showForm() {
    this.showFormAdd = true;
  }

  hideForm() {
    this.forma.reset;
    this.ests = new DTOWfEstParameter();
    this.ests.idWf = this.o.id;
    this.showFormAdd = false;
  }

  eliminarDialogo(o: DTOWfEstParameter): void {
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

  eliminar(o: DTOWfEstParameter) {
    this.loading = true;
    this.service.deleteEsts(o.idWf,o.idEstado).subscribe(data => {
      this.getEsts();
      this.showMessage("Se elimino");
      this.hideForm();
    }, error => {
      this.showMessage(error.error.mensaje)
    });
  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message
    });
  }

}
