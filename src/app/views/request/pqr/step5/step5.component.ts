import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { DTOWfPqrSteps } from '../../../../_model/DTOWfPqrSteps';
import { WfPqrService } from '../../../../_services/wfpqr/wfpqr.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { WfService } from '../../../../_services/wf/wf.service';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';;
import { DTOParameter } from '../../../../_model/DTOParameter';
import { ParameterService } from '../../../../_services/parameter/parameter.service';
import { DTODoc } from '../../../../_model/DTODoc';
import { DocsService } from '../../../../_services/docs/docs.service';
import { LoadFilesComponent } from '../../../../_components/load-files/load-files.component';
import { DTOWfStepParameterDoc } from '../../../../_model/DTOWfStepParameterDoc';
import { DTOWWfMov } from '../../../../_model/DTOWWfMov';
import { DialogConfirmationComponent } from '../../../../_components/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'step-5-pqr',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.css']
})

export class Step5PqrComponent implements OnInit {

  @Input() step: DTOWfPqrSteps;
  docs: DTOWfSteps;
  file; DTOWfStepParameterDoc;
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  loading: boolean = false;
  showFormAdd: boolean = false;
  showFormDocs: boolean = false;
  isLoadFiles: boolean = false;

  tipSolCredito: DTOParameter[];
  listaDocs: DTODoc[];

  displayedColumns = ['NombreDocumento', 'action'];
  dataSource: MatTableDataSource<DTODoc>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumnsHistory = ['Fecha', 'Estado', 'Comentario'];
  dataSourceHistory: MatTableDataSource<DTOWWfMov>;
  @ViewChild(MatPaginator) paginatorHistory: MatPaginator;
  @ViewChild(MatSort) sortHistory: MatSort;



  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private parameterService: ParameterService, public dialog: MatDialog, private wfService: WfPqrService, private serviceDocs: DocsService, private wf: WfService) { }

  ngOnInit() {
    this.wf.wf_step_event_docs.subscribe(data => {

      if ("5" == data.nextStep && (this.step.idWf == '1' || this.step.idWf == '2')) {
        this.isLoadFiles = true;
        this.step.files = [];
        data.files.forEach(r => {
          this.step.files.push(r);
        });
      }
    });


    this.crearFormulario();
    this.getStates();
    this.getDocs();
    this.getHistory();
    this.step.files = [];
  }


  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      entitie: ['', [Validators.required]],
      comments: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(1000)]],
    });

  }

  hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  actualizar(o?: DTOWfPqrSteps) {
    let med = o != null ? o : new DTOWfPqrSteps();
    this.step = med;
    this.showForm();
  }

  operarStep1() {

    if (!this.validarErroresCampos()) {

      this.loading = true;
      this.step.idSubStep = "2";
      this.wfService.createStep(this.step).subscribe(data => {
        this.resetForm();
        this.loading = false;
        this.step = data as DTOWfPqrSteps;
        this.step.comments = '';
        this.showMessage("Paso Ingresado.");
        this.wfService.wf_step_event.next(this.step);
      }, error => {
        this.loading = false;
        console.log(error);
        this.showMessage("ERROR:" + error.error.mensaje);
      });

    } else {
      this.showMessage("Algunos campos no cumplen las validaciones");
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

  showForm() {
    this.showFormAdd = true;
  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,
    });
  }

  mostrarDialogoCerrar(): void {
    let messageDelete = new String("Seguro de Cerrar el Caso?");

    this.dialog
      .open(DialogConfirmationComponent, {
        width: '300px',
        data: messageDelete,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {

          this.step.state = '99';
          this.loading = true;
          this.wfService.updateState(this.step).subscribe(data => {
            this.loading = false;
            this.showMessage("Solicitud Actualizada.");
            this.step.nextStep = '0'
          }, error => {
            this.loading = false;
            this.showMessage("ERROR:" + error);
          });
        }

      });
  }

  getStates() {
    this.loading = true;
    let stateType: string = "ESTADO_EST";
    if (this.step.idWf == "2") {
      stateType = 'ESTADO_LLAMADAS';
    } else if (this.step.stateType == '2' && this.step.idWf == "1") {
      stateType = 'ESTADO_DP';
    }

    this.parameterService.listParametersByParamId(stateType).subscribe(async (res: DTOParameter[]) => {
      this.tipSolCredito = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getDocs() {
    this.serviceDocs.listFilesByIdRad(this.step.numeroRadicacion + "").subscribe(async (res: DTODoc[]) => {
      this.listaDocs = res;
      this.dataSource = new MatTableDataSource(this.listaDocs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
      this.isLoadFiles = true;
    }, error => {
      console.log(error);
      this.loading = false;
    });;
  }

  getHistory() {
    this.dataSourceHistory = new MatTableDataSource(this.step.movs);
    this.dataSourceHistory.paginator = this.paginatorHistory;
    this.dataSourceHistory.sort = this.sortHistory;
  }

  addDocs(): void {

    this.docs = new DTOWfSteps();
    this.docs.isRequiredFiles = false;
    this.docs.prefixFile = "";
    this.docs.idWf = this.step.idWf;
    this.docs.nextStep = this.step.nextStep;
    this.docs.filesParam = [];

    var randNum = Math.floor(Math.random() * 100) + 1;

    this.file = new DTOWfStepParameterDoc();
    this.file.indObligatorio = "S";
    this.file.idDocumento = 1;
    this.file.nomDocumento = "defaut" + randNum;
    this.docs.filesParam.push(this.file);


    this.dialog.open(LoadFilesComponent, {
      width: '700px',
      height: '500px',
      data: this.docs
    });
  }

  openView(o?: DTODoc) {
    const src = `data:text/csv;base64,${o.encode}`;
    const link = document.createElement("a")
    link.href = src
    link.download = o.name
    link.click()
    link.remove()
  }

  sendEmailWithFiles() {

    this.loading = true;
    this.step.idSubStep = "1";
    this.wfService.createStep(this.step).subscribe(data => {
      this.loading = false;
      this.showMessage("Archivos Enviados.");
    }, error => {
      this.loading = false;
      console.log(error);
      this.showMessage("ERROR:" + error.error.mensaje);
    });

  }


}