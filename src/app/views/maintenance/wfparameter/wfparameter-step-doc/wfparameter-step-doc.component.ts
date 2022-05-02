import { Component, OnInit, Inject } from '@angular/core';
import { DTOWfStepParameterDoc } from '../../../../_model/DTOWfStepParameterDoc';
import { WfParameterService } from '../../../../_services/wfparameter/wfparameter.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';

@Component({
  selector: 'app-dialogo',
  templateUrl: './wfparameter-step-doc.component.html',
  styleUrls: ['./wfparameter-step-doc.component.css']
})
export class WfParameterStepDocComponent implements OnInit {

  o: DTOWfStepParameterDoc;
  loading: boolean = false;
  public forma: FormGroup;
  constructor(private dialogRef: MatDialogRef<WfParameterStepDocComponent>,
    private service: WfParameterService, private formBuilder: FormBuilder) {

    this.crearFormulario();
  }
  public errorServicio: boolean;

  ngOnInit() {
    this.o = new DTOWfStepParameterDoc();
    this.errorServicio = false;
  }

  cancelar() {
    this.dialogRef.close();
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      nomDocumento: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]],
      envRec: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]]
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  operar() {
    if (!this.validarErroresCampos()) {
      if(this.o.envRec==undefined){
        this.o.envRec="false";
      }
      this.service.objetoCambio.next(this.o);
      this.loading = false;
      this.dialogRef.close();
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

  mensajeErrorServicio = () => {
    return this.errorServicio;
  }

}
