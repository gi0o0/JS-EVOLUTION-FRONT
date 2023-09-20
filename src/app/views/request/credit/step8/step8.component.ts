import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WfService } from '../../../../_services/wf/wf.service';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { DocsService } from '../../../../_services/docs/docs.service';
import { LoadFilesComponent } from '../../../../_components/load-files/load-files.component';
import { DTODoc } from '../../../../_model/DTODoc';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'step-8',
  templateUrl: './step8.component.html',
  styleUrls: ['./step8.component.css']
})
export class Step8Component implements OnInit {

  @Input() step: DTOWfSteps;
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  loading: boolean = false;
  showFormAdd: boolean = false;
  isApprove: boolean = false;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  listaDocs: DTODoc[];
  displayedColumns = ['NombreDocumento', 'action'];
  dataSource: MatTableDataSource<DTODoc>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadFiles: boolean = false;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private wfService: WfService, private serviceDocs: DocsService) { }

  ngOnInit() {
    this.crearFormulario();
    this.callStepOld();

    this.wfService.wf_step_event_docs.subscribe(data => {
      if ("8" == data.nextStep && this.step.idWf == '4') {
        this.isLoadFiles = true;
      }
    });

    this.callStepOld();
    if (this.step.isUpdate) {
      this.getDocs();
    }

  }

  callStepOld() {
    if (this.step.isUpdate) {
      setTimeout(() => {
        this.parentFun.emit();
      }, 10);
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

  operarStep8() {

    if (!this.validarErroresCampos()) {

      if (this.isApprove) {
        this.loading = true;
        this.step.nextStep = '8'
        this.step.idSubStep = '0'
        this.step.idStep = '8'
        this.wfService.createStep(this.step).subscribe(data => {
          this.resetForm();
          this.loading = false;
          this.step = data as DTOWfSteps;
          this.step.comments = '';
          this.step.files = [];
          this.showMessage("Paso Ingresado.");
          this.wfService.wf_step_event.next(this.step);
        }, error => {
          this.loading = false;
          this.showMessage("ERROR:" + error);
        });
      } else {
        this.showMessage("No se aprobado o cancelado la solicitud");
      }
    } else {
      this.showMessage("Algunos campos no cumplen las validaciones");
    }
  }

  Approve(state: string) {
    this.isApprove = true;
    this.step.estado = state;
    this.showMessage("Proceso realizado");
  }


  resetForm() {
    this.forma.reset;
    this.myForm.resetForm();
    this.isApprove = false;
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

  getDocs() {
    this.loading = true;
    this.serviceDocs.listDocsByIdAndStep(this.step.idWf + this.step.numeroRadicacion, this.step.nextStep).subscribe(async (res: DTODoc[]) => {
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

  callLoadFile() {
    this.step.prefixFile = "";
    this.dialog.open(LoadFilesComponent, {
      width: '700px',
      height: '500px',
      data: this.step
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

}
