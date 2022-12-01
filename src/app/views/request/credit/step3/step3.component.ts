import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WfService } from '../../../../_services/wf/wf.service';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { LoadFilesComponent } from '../../../../_components/load-files/load-files.component';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';
@Component({
  selector: 'step-3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit {

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

  constructor(private formBuilder: FormBuilder,public dialog: MatDialog, private wfService: WfService) { 

  }

  ngOnInit() {

    this.crearFormulario();
     
    this.wfService.wf_step_event_docs.subscribe(data => {
      if ("3" == data.nextStep) {
        this.isLoadFiles = true;
      }
    });
    this.callStepOld();
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      comments: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }


  callStepOld(){
    if(this.step.isUpdate){
      setTimeout(() => {
       this.parentFun.emit();
      }, 10);
    }
  }

  callLoadFile(prefixFile: string) {
    this.step.prefixFile=prefixFile;
    this.dialog.open(LoadFilesComponent, {
      width: '700px',
      height: '500px',
      data: this.step
    });
  }



  operarStep3() {

    if (!this.validarErroresCampos()) {

      if (this.isLoadFiles) {
        this.loading = true;
        this.wfService.createStep(this.step).subscribe(data => {
          this.resetForm();
          this.loading = false;
          this.step = data as DTOWfSteps;
          this.step.comments = '';
          this.step.files = [];
          this.step.filesNames = [];
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
    this.step.filesNames = [];
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
