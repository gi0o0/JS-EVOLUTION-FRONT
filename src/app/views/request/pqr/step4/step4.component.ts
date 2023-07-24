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
import { WfLoanService } from '../../../../_services/loans/loans.service';
import { DTOWfLoan } from '../../../../_model/DTOWfLoan';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';
import { LoadFilesComponent } from '../../../../_components/load-files/load-files.component';
import { DTOWfStepParameterDoc } from '../../../../_model/DTOWfStepParameterDoc';

@Component({
  selector: 'step-4-pqr',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})

export class Step4PqrComponent implements OnInit {

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

  displayedColumns = ['numeroSolicitud', 'numeroCredito', 'est', 'deu', 'cert', 'pazysalvo', 'dp', 'action'];
  dataSource: MatTableDataSource<DTOWfLoan>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private wfService: WfPqrService, private loanService: WfLoanService, private wf: WfService) { }

  ngOnInit() {
    this.wf.wf_step_event_docs.subscribe(data => {

      if ("4" == data.nextStep && (this.step.idWf == '1' || this.step.idWf == '2')) {
        this.isLoadFiles = true;
        data.files.forEach(r => {
          this.step.files.push(r);
        });
       
      }
    });
    this.crearFormulario();

    if (this.step.idWf == '1') {
      this.getWallet();
      this.step.files = [];
    } else {
      this.isLoadFiles = true;
    }

  }

  callStepOld() {
    if (this.step.isUpdate) {
      setTimeout(() => {
        this.parentFun.emit();
      }, 1000);
    }
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
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
      if (this.isLoadFiles) {
        this.loading = true;
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
        this.showMessage("No se han adjuntado archivos");
      }
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

  getWallet() {
    this.loanService.ListByWfAndNumRad(this.step.idWf, this.step.numeroRadicacion).subscribe(async (res: DTOWfLoan[]) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }


  addDocs(wallet: DTOWfLoan): void {

    this.docs = new DTOWfSteps();
    this.docs.isRequiredFiles = false;
    this.docs.prefixFile = "";
    this.docs.idWf = this.step.idWf;
    this.docs.nextStep = this.step.nextStep;
    this.docs.filesParam = [];


    if (wallet.indEst == "S") {
      this.file = new DTOWfStepParameterDoc();
      this.file.indObligatorio = "S";
      this.file.idDocumento = 1;
      this.file.nomDocumento = wallet.numeroCredito + " - Estado de Cuenta";
      this.docs.filesParam.push(this.file);
    }

    if (wallet.indCer == "S") {
      this.file = new DTOWfStepParameterDoc();
      this.file.indObligatorio = "S";
      this.file.idDocumento = 2;
      this.file.nomDocumento = wallet.numeroCredito + " - Certificado";
      this.docs.filesParam.push(this.file);
    }

    if (wallet.indCerDeu == "S") {
      this.file = new DTOWfStepParameterDoc();
      this.file.indObligatorio = "S";
      this.file.idDocumento = 3;
      this.file.nomDocumento = wallet.numeroCredito + " - Certificado de deuda";
      this.docs.filesParam.push(this.file);
    }

    if (wallet.indPaz == "S") {
      this.file = new DTOWfStepParameterDoc();
      this.file.indObligatorio = "S";
      this.file.idDocumento = 4;
      this.file.nomDocumento = wallet.numeroCredito + " - Paz y salvo";
      this.docs.filesParam.push(this.file);
    }

    if (wallet.indDp == "S") {
      this.file = new DTOWfStepParameterDoc();
      this.file.indObligatorio = "S";
      this.file.idDocumento = 5;
      this.file.nomDocumento = wallet.numeroCredito + " - Derecho de Petición";
      this.docs.filesParam.push(this.file);
    }


    this.dialog.open(LoadFilesComponent, {
      width: '700px',
      height: '500px',
      data: this.docs
    });
  }


}