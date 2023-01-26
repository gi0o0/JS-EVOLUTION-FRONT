import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WfService } from '../../../../_services/wf/wf.service';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { AddressComponent } from '../../../../_components/address/address.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'step-2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit {

  @Input() step: DTOWfSteps;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  loading: boolean = false;
  showFormAdd: boolean = false;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private wfService: WfService) {
  
  }

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

  operarStep2() {
   
    if (!this.validarErroresCampos()) {
      this.loading = true;
        this.wfService.listById(this.step.numeroRadicacion).subscribe(data => {
          this.loading = false;
          if (data.estado != "4") {
            this.showMessage("Solicitar al usuario " + this.step.nitter + " que ingrese a la bandeja del correo " + this.step.mailTer + " y seleccione el enlace remitido para culminar el proceso de verificación");      
          } else {
            this.showMessage("Se ha realizado la verificación del correo "+ this.step.mailTer +" de forma Correcta.");
            this.step.nextStep = "3";
            this.resetForm();
            this.wfService.wf_step_event.next(this.step);
          }    
        }, error => {
          this.loading = false;
          this.showMessage(error.mensaje);
        });
    } else {
      this.showMessage("Algunos campos no cumplen las validaciones");
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
  resetForm() {
    this.forma.reset;
    this.myForm.resetForm();
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

  showWindowAddAddress(id: string) {
    this.dialog.open(AddressComponent, {
      width: '600px',
      height: '500px',
      data: id,
    });
  }


}
