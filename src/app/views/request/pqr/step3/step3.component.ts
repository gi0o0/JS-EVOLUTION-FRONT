import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { DTOWfPqrSteps } from '../../../../_model/DTOWfPqrSteps';
import { WfPqrService } from '../../../../_services/wfpqr/wfpqr.service';
import { DTOWallet } from '../../../../_model/DTOWallet';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { WfService } from '../../../../_services/wf/wf.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FoclaasoService } from '../../../../_services/foclaaso/foclaaso.service';
import { DTOFoclaaso } from '../../../../_model/DTOFoclaaso';

@Component({
  selector: 'step-3-pqr',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3PqrComponent implements OnInit {

  @Input() step: DTOWfPqrSteps;
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  loading: boolean = false;
  showFormAdd: boolean = false;
  credits: string[] = [];
  listFoclaaso: DTOFoclaaso[];

  showPagaduria: boolean = false;

  displayedColumns = ['numeroCredito', 'saldoCapital', 'saldoK', 'indicador', 'nomClaaso', 'nomClaasoCod', 'marcacionn', 'estPersonaDeu', 'estPersonaCoDeu', 'action'];
  dataSource: MatTableDataSource<DTOWallet>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private wfService: WfPqrService, private foclaasoService: FoclaasoService) { }

  ngOnInit() {
    this.crearFormulario();

    if (this.step.idWf == '1') {
      this.getWallet();
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
      estadoCuenta: ['', []],
      certificadoDeuda: ['', []],
      pazSalvo: ['', []],
      certificado: ['', []],
      derechoPeticion: ['', []],
      entitie: ['', []],
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
      if (this.credits.length == 0 && this.step.idWf == "1") {
        this.showMessage("Se debe seleccionar por lo menos un crédito");
        return;
      }

      this.step.credtis = this.credits;
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

  getWallet() {

    this.step.walletType = '1';
    if (this.step.pazSalvo) {
      this.step.walletType = '2';
    }

    this.wfService.listWalletByUser(this.step.codTer, this.step.walletType).subscribe(async (res: DTOWallet[]) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getEntities() {
    this.loading = true;
    this.foclaasoService.listAllWithoutFilter().subscribe(async (res: DTOFoclaaso[]) => {
      this.listFoclaaso = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }


  getPagaduria(event: MatCheckboxChange): void {
    if (event.checked) {
      this.step.stateType = '2';
      this.getEntities();
      this.showPagaduria = true;
    } else {
      this.showPagaduria = false;
      this.step.stateType = '1';
    }
  }

  getWalletPS(event: MatCheckboxChange): void {
    this.getWallet();
    this.credits = [];
  }

  addCreditUser(event: MatCheckboxChange, wallet: DTOWallet): void {

    if (event.checked) {
      this.credits.push(wallet.numeroCredito);
    } else {
      this.credits.forEach((value, index) => {
        if (value == wallet.numeroCredito) {
          this.credits.splice(index, 1);
        }
      });
    }
  }


}