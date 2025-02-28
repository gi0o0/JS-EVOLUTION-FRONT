import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WfService } from '../../../../_services/wf/wf.service';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { LoadFilesComponent } from '../../../../_components/load-files/load-files.component';
import { DocsService } from '../../../../_services/docs/docs.service';
import { DTODoc } from '../../../../_model/DTODoc';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WalletComponent } from '../../../../_components/wallet/wallet.component';

@Component({
  selector: 'step-3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit {

  @Input() step: DTOWfSteps;
  listaDocs: DTODoc[];
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  loading: boolean = false;
  showFormAdd: boolean = false;
  isBuyForeignPortfolio: boolean = false;
  isLoadFiles: boolean = true;
  totalIngresos: number = 0;
  totalDescuentos: number = 0;
  capacidad: string = "";
  disponible: string = "";
  valorDesembolso: string = "";
  valorCuotaEstimada: string = "";
  public color: string;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  displayedColumns = ['NombreDocumento', 'action'];
  dataSource: MatTableDataSource<DTODoc>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private wfService: WfService, private serviceDocs: DocsService,) { }

  ngOnInit() {


    if (this.step.tipSolCredito == "3") {
      this.isBuyForeignPortfolio = true;
      this.isLoadFiles = false;
      this.crearFormularioisBuyForeign();
    } else {
      this.isLoadFiles = true;
      this.crearFormulario();
    }

    this.wfService.wf_step_event_docs.subscribe(data => {
      if ("3" == data.nextStep && this.step.idWf == '4') {
        this.isLoadFiles = true;
      }
    });


    this.callStepOld();

    if (this.step.isUpdate) {
      this.getDocs();
      this.isLoadFiles = true;
    }
    if (this.step.readonly) {
      this.calculateCapacity();
    }


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

  callStepOld() {
    if (this.step.isUpdate) {
      this.isLoadFiles = true;
      this.sumTotalIngresos();
      this.sumTotalDescuentos();
      setTimeout(() => {
        this.parentFun.emit();
      }, 10);
    }
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      sueldo: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      recargos: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      bonos: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      compensatorios: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      bonificacion: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      horas_extras: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_pagos1: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_pagos2: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_pagos3: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      salud: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      pension: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      libranza: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      cuota_sindical: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      cuota_interna: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_decuentos1: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_decuentos2: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_decuentos3: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      comments: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(1000)]],
    });
  }

  crearFormularioisBuyForeign = () => {
    this.forma = this.formBuilder.group({
      sueldo: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      recargos: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      bonos: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      compensatorios: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      bonificacion: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      horas_extras: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_pagos1: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_pagos2: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_pagos3: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      salud: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      pension: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      libranza: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      cuota_sindical: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      cuota_interna: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_decuentos1: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_decuentos2: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      otros_decuentos3: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      compra_cartera1: ['', [Validators.required, Validators.pattern("^[0-9,.]+[^.]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      entidad_cartera1: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      compra_nit1: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      obligacion_cartera1: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      compra_cartera2: ['', [Validators.required, Validators.pattern("^[0-9,.]+[^.]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      entidad_cartera2: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      obligacion_cartera2: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      compra_nit2: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      compra_cartera3: ['', [Validators.required, Validators.pattern("^[0-9,.]+[^.]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      entidad_cartera3: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      obligacion_cartera3: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      compra_nit3: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      compra_cartera4: ['', [Validators.required, Validators.pattern("^[0-9,.]+[^.]*$"), Validators.maxLength(10), Validators.minLength(1)]],
      entidad_cartera4: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      obligacion_cartera4: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      compra_nit4: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
      comments: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(1000)]],
    });
  }


  hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  actualizar(o?: DTOWfSteps) {
    let med = o != null ? o : new DTOWfSteps();
    this.step = med;
    this.showForm();
  }

  operarStep3() {

    if (!this.validarErroresCampos()) {

      if (this.isLoadFiles && this.capacidad != ""  && this.step.numeroRadicacion!=0) {
        this.loading = true;
        this.step.idSubStep = '2'
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
          console.log(error);
          this.showMessage(error.error.mensaje);
        });
      } else {
        this.showMessage("No se han adjuntado archivos o realizado el calculo");
      }
    } else {
      this.showMessage("Algunos campos no cumplen las validaciones");
    }
  }

  calculateCapacity() {

    this.loading = true;
    this.step.nextStep = '3'
    this.step.idSubStep = '1'
    this.step.idStep = '3'
    this.wfService.createStep(this.step).subscribe(data => {

      this.loading = false;
      this.step = data as DTOWfSteps;
      this.capacidad = this.step.financial.capacidadEndeudamiento;
      this.valorCuotaEstimada = this.step.financial.valorCuotaEstimada;
      this.disponible = this.step.financial.disponible;
      this.valorDesembolso = this.step.financial.valorDesembolso;

      if (Number(this.step.financial.capacidadEndeudamiento) >= 0) {
        this.color = "#E8F5E9";
      } else {
        this.color = "#FFEBEE";
      }
    }, error => {
      this.loading = false;
      this.showMessage("ERROR:" + error);
    });
  }

  callLoadFile() {
    this.step.isRequiredFiles = false;
    this.step.prefixFile = "";
    this.dialog.open(LoadFilesComponent, {
      width: '700px',
      height: '500px',
      data: this.step
    });
  }

  resetForm() {
    this.forma.reset;
    this.myForm.resetForm();
    this.isLoadFiles = false;
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

  sumTotalIngresos() {
    var sueldo = this.step.financial.sueldo == undefined ? 0 : Number(this.step.financial.sueldo);
    var bonificacion = this.step.financial.bonificacion == undefined ? 0 : Number(this.step.financial.bonificacion);
    var bonos = this.step.financial.bonos == undefined ? 0 : Number(this.step.financial.bonos);
    var compensatorios = this.step.financial.compensatorios == undefined ? 0 : Number(this.step.financial.compensatorios);
    var horas_extras = this.step.financial.horas_extras == undefined ? 0 : Number(this.step.financial.horas_extras);
    var otros_pagos1 = this.step.financial.otros_pagos1 == undefined ? 0 : Number(this.step.financial.otros_pagos1);
    var otros_pagos2 = this.step.financial.otros_pagos2 == undefined ? 0 : Number(this.step.financial.otros_pagos2);
    var otros_pagos3 = this.step.financial.otros_pagos3 == undefined ? 0 : Number(this.step.financial.otros_pagos3);
    var recargos = this.step.financial.recargos == undefined ? 0 : Number(this.step.financial.recargos);
    this.totalIngresos = sueldo + bonificacion + bonos + compensatorios + horas_extras + otros_pagos1 + otros_pagos2 + otros_pagos3 + recargos;
  }
  sumTotalDescuentos() {
    var salud = this.step.financial.salud == undefined ? 0 : Number(this.step.financial.salud);
    var pension = this.step.financial.pension == undefined ? 0 : Number(this.step.financial.pension);
    var libranza = this.step.financial.libranza == undefined ? 0 : Number(this.step.financial.libranza);
    var cuota_sindical = this.step.financial.cuota_sindical == undefined ? 0 : Number(this.step.financial.cuota_sindical);
    var cuota_interna = this.step.financial.cuota_interna == undefined ? 0 : Number(this.step.financial.cuota_interna);
    var otros_decuentos1 = this.step.financial.otros_decuentos1 == undefined ? 0 : Number(this.step.financial.otros_decuentos1);
    var otros_decuentos2 = this.step.financial.otros_decuentos2 == undefined ? 0 : Number(this.step.financial.otros_decuentos2);
    var otros_decuentos3 = this.step.financial.otros_decuentos3 == undefined ? 0 : Number(this.step.financial.otros_decuentos3);
    var compra_cartera1 = this.step.financial.compra_cartera1 == undefined ? 0 : Number(this.step.financial.compra_cartera1);
    var compra_cartera2 = this.step.financial.compra_cartera2 == undefined ? 0 : Number(this.step.financial.compra_cartera2);
    var compra_cartera3 = this.step.financial.compra_cartera3 == undefined ? 0 : Number(this.step.financial.compra_cartera3);
    var compra_cartera4 = this.step.financial.compra_cartera4 == undefined ? 0 : Number(this.step.financial.compra_cartera4);
    this.totalDescuentos = salud + pension + libranza + cuota_sindical + cuota_interna + otros_decuentos1 + otros_decuentos2 + otros_decuentos3;
  }

  onChangeEventSum(event: any) {
    this.sumTotalIngresos();
  }

  onChangeEventSumDes(event: any) {
    this.sumTotalDescuentos();
  }

  showWindowWallet(user: string) {
    this.dialog.open(WalletComponent, {
      width: '1000px',
      height: '300px',
      data: user,
    });
  }


}
