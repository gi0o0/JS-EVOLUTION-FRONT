import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { WfPqrService } from '../../../../_services/wfpqr/wfpqr.service';
import { DTOWfPqrSteps } from '../../../../_model/DTOWfPqrSteps';

@Component({
  selector: 'step-2-pqr',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2PqrComponent implements OnInit {

  @Input() step: DTOWfPqrSteps;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  loading: boolean = false;
  isLoadEmail: boolean = false;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private wfService: WfPqrService) { }

  ngOnInit() {
    this.crearFormulario();
    
    if (this.step.isUpdate) {
      this.isLoadEmail = true;
      setTimeout(() => { this.parentFun.emit(); }, 10);
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

  operarStep2() {

    if (!this.validarErroresCampos()) {

      this.loading = true;
      this.step.idSubStep = "3";
      this.wfService.createStep(this.step).subscribe(data => {
        this.loading = false;
        this.step = data as DTOWfPqrSteps;
        if (this.step.state == "4") {
          this.showMessage("Solicitar al usuario " + this.step.nitter + " que ingrese a la bandeja del correo " + this.step.mailTer + " y seleccione el enlace remitido para culminar el proceso de verificación");
        } else {
          this.showMessage("Paso Ingresado.");
          this.resetForm();
          this.wfService.wf_step_event.next(this.step);
          this.step.comments = '';
        }

      }, error => {
        this.loading = false;
        console.log(error);
        this.showMessage("ERROR:" + error.error.mensaje);
      });

    } else {
      this.showMessage("Algunos campos no cumplen las validaciones");
    }
  }

  sendEmail() {
    this.step.idStep = "2";
    this.step.idSubStep = "1";
    this.wfService.createStep(this.step).subscribe(data => {
      this.showMessage("Correo de  verificación remitido.");
      this.isLoadEmail = true;
    }, error => {
      this.isLoadEmail = false;
      this.loading = false;
      this.showMessage(error.mensaje);
    });
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
  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,
    });
  }

}
