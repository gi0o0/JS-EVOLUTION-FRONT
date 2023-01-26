import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WfService } from '../../../../_services/wf/wf.service';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'step-6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.css']
})
export class Step6Component implements OnInit {

  @Input() step: DTOWfSteps;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  loading: boolean = false;
  showFormAdd: boolean = false;
  isApprove: boolean = false;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private wfService: WfService) { }

  ngOnInit() {
      this.crearFormulario();
      this.callStepOld();
  }

  callStepOld(){
    if(this.step.isUpdate){
      setTimeout(() => {
        this.parentFun.emit();
      }, 10);
    }
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      comments: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  operarStep6() {

    if (!this.validarErroresCampos()) {

      if (this.isApprove) {
        this.loading = true;       
        this.step.nextStep='6'
        this.step.idSubStep='0'
        this.step.idStep='6'
        this.wfService.createStep(this.step).subscribe(data => {
          this.resetForm();
          this.loading = false;
          this.step = data as DTOWfSteps;
          this.step.comments = '';
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
    this.step.estado=state;
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

}
