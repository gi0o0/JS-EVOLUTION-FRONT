import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DTOWfParameter } from '../../../../_model/DTOWfParameter';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO, EXP_REGULAR_FECHA_YYYMMDD } from '../../../../_shared/constantes';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { AddressComponent } from '../../../../_components/address/address.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../../_services/user/user.service';
import { DTOTercero } from '../../../../_model/DTOTercero';
import { DTOWfPqrSteps } from '../../../../_model/DTOWfPqrSteps';
import { WfPqrService } from '../../../../_services/wfpqr/wfpqr.service';
import { FoclaasoService } from '../../../../_services/foclaaso/foclaaso.service';
import { DTOFoclaaso } from '../../../../_model/DTOFoclaaso';

@Component({
  selector: 'step-1-pqr',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1PqrComponent implements OnInit {

  o: DTOWfParameter;
  @Input() step: DTOWfPqrSteps;
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  loading: boolean = false;
  showFormAdd: boolean = false;
  checked = false;

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private wfService: WfPqrService, private userService: UserService, private foclaasoService: FoclaasoService) {
    this.o = new DTOWfParameter();
  }

  ngOnInit() {
    this.initStep();
    this.crearFormulario();


    if (this.step.isUpdate) {
      this.getUser(this.step.nitter);
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
      company: ['', []],
      nitter: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      nomTer: ['', [Validators.required,] ],
      lugarDoc: ['', [Validators.required, ]],
      feExp_deu: ['', [Validators.required, ]],
      dirTerpal: ['', [Validators.required]],
      isRequiredEmail: ['',],
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

  showWindowAddAddress(id: string) {
    this.dialog.open(AddressComponent, {
      width: '600px',
      height: '500px',
      data: id,
    });
  }

  getUser(nitter: string) {

    this.userService.listUserTerceroByNitter(Number(nitter)).subscribe(async (res: DTOTercero) => {
      this.step.doctip = res.docTip;
      this.step.nomTer = res.nomTercero + " " + res.priApellido + " " + res.segApellido;
      this.step.lugarDoc = res.lugarDoc;
      this.step.feExp = res.feExp;
      this.step.dirTerpal = res.dirTerpal;
      this.step.codTer = res.codTer.toString();
      this.step.mailTer = res.mailTer;

      this.foclaasoService.foclaasoByCodTer(res.codTer).subscribe(async (res: DTOFoclaaso) => {
        this.step.company = res.name;
      }, error => {
        this.loading = false;
        this.showMessage(error.error.mensaje);
      });

    }, error => {
      this.loading = false;
      this.showMessage(error.error.mensaje);
    });


  }

  initStep() {
    if (this.step == undefined) {
      this.step = new DTOWfPqrSteps();
      this.step.idStep = '1';
      this.step.idSubStep = '1';
      this.step.nextStep = '1';
      this.step.numeroRadicacion = 0;
      this.step.idWf = '0';
    }
  }

}