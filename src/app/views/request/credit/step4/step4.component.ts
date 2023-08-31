import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WfService } from '../../../../_services/wf/wf.service';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { LoadFilesComponent } from '../../../../_components/load-files/load-files.component';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';
import { DocsService } from '../../../../_services/docs/docs.service';
import { DTODoc } from '../../../../_model/DTODoc';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'step-4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component implements OnInit {

  @Input() step: DTOWfSteps;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  forma: FormGroup;
  isLoadFiles: boolean = false;
  errorServicio: boolean;
  loading: boolean = false;
  @ViewChild('attachments') attachment: any;
  maxFiles: number;
  sizeFiles: number;
  sizeFilesName: number;
  acceptFiles: string;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  listaDocs: DTODoc[];
  displayedColumns = ['NombreDocumento', 'action'];
  dataSource: MatTableDataSource<DTODoc>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private wfService: WfService, private serviceDocs: DocsService) {

  }

  ngOnInit() {

    if (this.step.tipSolCredito == "3") {
      this.isLoadFiles = false;
    }

    this.crearFormulario();

    this.wfService.wf_step_event_docs.subscribe(data => {
      if ("4" == data.nextStep && this.step.idWf == '4') {
        this.isLoadFiles = true;
      }
    });
    this.callStepOld();

    if (this.step.isUpdate) {
      this.getDocs();
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


  callStepOld() {
    if (this.step.isUpdate) {
      setTimeout(() => {
        this.parentFun.emit();
      }, 10);
    }
  }

  callLoadFile(prefixFile: string) {
    this.step.prefixFile = prefixFile;
    this.dialog.open(LoadFilesComponent, {
      width: '700px',
      height: '500px',
      data: this.step
    });
  }

  getDocs() {
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


  openView(o?: DTODoc) {
    const src = `data:text/csv;base64,${o.encode}`;
    const link = document.createElement("a")
    link.href = src
    link.download = o.name
    link.click()
    link.remove()
  }

  operarStep() {

    if (!this.validarErroresCampos()) {

      if (this.isLoadFiles) {
        this.loading = true;
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
        this.showMessage("No se han adjuntado archivos o realizado el calculo");
      }
    } else {
      this.showMessage("Algunos campos no cumplen las validaciones");
    }
  }


  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,
    });
  }

  init() {
    this.step.files = [];
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

  resetForm() {
    this.forma.reset;
    this.myForm.resetForm();
    this.isLoadFiles = false;
    this.init();
  }

}
