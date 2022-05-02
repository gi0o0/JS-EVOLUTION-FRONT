import { Component, OnInit, ViewChild } from '@angular/core';
import { DTOWfParameter } from '../../../../_model/DTOWfParameter';
import { WfParameterService } from '../../../../_services/wfparameter/wfparameter.service';
import { Router } from '@angular/router';
import { DTOWfStepParameter } from '../../../../_model/DTOWfStepParameter';
import { DTOWfStepParameterDoc } from '../../../../_model/DTOWfStepParameterDoc';
import { DTOWfStepParameterAut } from '../../../../_model/DTOWfStepParameterAut';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EXP_REGULAR_ALFANUMERICO, EXP_REGULAR_NUMERO, EXP_REGULAR_NUMERO_MAX, EXP_REGULAR_CORREO } from '../../../../_shared/constantes';
import { DialogConfirmationComponent } from "../../../../_components/dialog-confirmation/dialog-confirmation.component";
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { WfParameterStepDocComponent } from '../wfparameter-step-doc/wfparameter-step-doc.component';
import { WfParameterStepUserComponent } from '../wfparameter-step-user/wfparameter-step-user.component';

@Component({
  selector: 'app-dialogo',
  templateUrl: './wfparameter-step.component.html',
  styleUrls: ['./wfparameter-step.component.css']
})
export class WfParameterStepComponent implements OnInit {

  o: DTOWfParameter;
  step: DTOWfStepParameter;
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  listSteps: DTOWfStepParameter[];
  loading: boolean = false;
  showFormAdd: boolean = false;
  displayedColumns = ['idPaso', 'nomPaso', 'ordPaso', 'action'];
  displayedColumnsDocs = ['nomDocumento', 'envRec', 'action'];
  docs: DTOWfStepParameterDoc[]=[];
  auts: DTOWfStepParameterAut[];

  dataSource: MatTableDataSource<DTOWfStepParameter>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceDocs: MatTableDataSource<DTOWfStepParameterDoc>;
  @ViewChild(MatPaginator) paginatorDocs: MatPaginator;
  @ViewChild(MatSort) sortDocs: MatSort;

  constructor(private router: Router, private service: WfParameterService, private formBuilder: FormBuilder, public dialog: MatDialog,) {
    this.o = this.router.getCurrentNavigation().extras.state.dto;
    this.crearFormulario();
  }

  ngOnInit() {
    this.loading = true;
    this.step = new DTOWfStepParameter();
    this.step.idWf = this.o.id;
  

    this.service.objetoCambio.subscribe(data => {
      if(this.step.docs==undefined){
        this.step.docs=this.docs;
      }   
      this.step.docs.push(data); 
      this.setDataSourceDocs();
    });

    this.getSteps();

  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      nomPaso: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]],
      ordPaso: ['', [Validators.required, Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]],
      envCorreoPaso: ['', [Validators.maxLength(100)]],
      tiempoAlerta1: ['', [Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]],
      email1: ['', [Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(100)]],
      email2: ['', [Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(100)]],
      solAutoriza: ['', [Validators.maxLength(100)]],
      email3: ['', [Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(100)]],
      tiempoAlerta2: ['', [Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]],
      solDocumentos: ['', [Validators.maxLength(100)]],
      tiempoAlerta3: ['', [Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]],
      asuntoCorreo: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]],
      textoCorreo: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]],
    });
  }

  changeEnvCorreoPaso(ob: MatCheckboxChange) {
    if (ob.checked) {
      this.forma.get('tiempoAlerta1').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]);
      this.forma.get('tiempoAlerta1').updateValueAndValidity();
      this.forma.get('email1').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(100)]);
      this.forma.get('email1').updateValueAndValidity();
      this.forma.get('email2').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(100)]);
      this.forma.get('email2').updateValueAndValidity();
    } else {
      this.forma.get('tiempoAlerta1').setValidators([Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]);
      this.forma.get('tiempoAlerta1').updateValueAndValidity();
      this.forma.get('email1').setValidators([Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(100)]);
      this.forma.get('email1').updateValueAndValidity();
      this.forma.get('email2').setValidators([Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(100)]);
      this.forma.get('email2').updateValueAndValidity();
    }
  }

  changeSolAutoriza(ob: MatCheckboxChange) {
    if (ob.checked) {
      this.forma.get('tiempoAlerta2').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]);
      this.forma.get('tiempoAlerta2').updateValueAndValidity();
      this.forma.get('email3').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(100)]);
      this.forma.get('email3').updateValueAndValidity();
    } else {
      this.forma.get('tiempoAlerta2').setValidators([Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]);
      this.forma.get('tiempoAlerta2').updateValueAndValidity();
      this.forma.get('email3').setValidators([Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(100)]);
      this.forma.get('email3').updateValueAndValidity();
    }
  }

  changeSolDocumentos(ob: MatCheckboxChange) {
    if (ob.checked) {
      this.forma.get('tiempoAlerta3').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]);
      this.forma.get('tiempoAlerta3').updateValueAndValidity();
      this.forma.get('asuntoCorreo').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]);
      this.forma.get('asuntoCorreo').updateValueAndValidity();
      this.forma.get('textoCorreo').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]);
      this.forma.get('textoCorreo').updateValueAndValidity();
    } else {
      this.forma.get('tiempoAlerta3').setValidators([Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MAX)]);
      this.forma.get('tiempoAlerta3').updateValueAndValidity();
      this.forma.get('asuntoCorreo').setValidators([Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]);
      this.forma.get('asuntoCorreo').updateValueAndValidity();
      this.forma.get('textoCorreo').setValidators([Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]);
      this.forma.get('textoCorreo').updateValueAndValidity();
    }

  }

  hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }



  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }

  getSteps() {

    this.service.listStepById(this.o.id).subscribe(async (res: DTOWfStepParameter[]) => {
      this.listSteps = new Array<DTOWfStepParameter>();
      res.forEach(r => {
        this.listSteps.push(r);
      });
      this.dataSource = new MatTableDataSource(this.listSteps);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getDocs() {

    this.service.listStepDocsByIds(this.o.id,this.step.idPaso).subscribe(async (res: DTOWfStepParameterDoc[]) => {
      this.step.docs = res;
      this.setDataSourceDocs();
    }, error => {
      this.loading = false;
    });
  }

  actualizar(o?: DTOWfStepParameter) {
    let med = o != null ? o : new DTOWfStepParameter();
    this.step = med;
    this.getDocs();
    this.showForm();
  }


  operar() {
    if (!this.validarErroresCampos()) {
      this.loading = true;

      if (this.step.idWf != null && this.step.idPaso != null) {
        this.service.updateStep(this.step).subscribe(data => {
          this.getSteps();
          this.showMessage("Step Actualizado");
          this.resetForm();
          this.showFormAdd = false;
        }, error => {
          this.showMessage(error.error.mensaje);
          this.resetForm();
        });
      } else {
        this.service.createStep(this.step).subscribe(data => {
          this.getSteps();
          this.showMessage("Step Ingresado.");
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
    this.step = new DTOWfStepParameter();
    this.step.idWf = this.o.id;
    this.showFormAdd = false;
  }

  eliminarDialogo(o: DTOWfStepParameter): void {
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

  eliminar(o: DTOWfStepParameter) {
    this.loading = true;
    this.service.deleteStep(o).subscribe(data => {
      this.getSteps();
      this.showMessage("Se elimino")
    }, error => {
      this.showMessage(error.error.mensaje)
    });
  }

  eliminarItemDoc(doc: DTOWfStepParameterDoc) {
    console.log(this.step.idPaso)
    if(this.step.idPaso==undefined){
      const index: number = this.step.docs.indexOf(doc);
      if (index !== -1) {
          this.step.docs.splice(index, 1);
      } 
    }else{
      this.loading = true;
      this.service.deleteStepDoc(this.o.id,this.step.idPaso,doc.idDocumento).subscribe(data => {
        this.showMessage("Se elimino")
        this.getDocs();
      }, error => {
        this.showMessage(error.error.mensaje)
      });
    }
    
    this.setDataSourceDocs();
  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message
    });
  }

  showWindowAddDoc() {
    this.dialog.open(WfParameterStepDocComponent, {
      width: '500px'
    });
  }

  showWindowAddAuts() {
    this.dialog.open(WfParameterStepUserComponent, {
      width: '500px',
      data: this.step
    });
  }

  setDataSourceDocs(){
    this.dataSourceDocs = new MatTableDataSource(this.step.docs);
    this.dataSourceDocs.paginator = this.paginator;
    this.dataSourceDocs.sort = this.sort;
  }



}
