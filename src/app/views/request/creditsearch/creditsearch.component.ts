import { Component, OnInit, ViewChild } from '@angular/core';
import { DTOWfParameter } from '../../../_model/DTOWfParameter';
import { WfService } from '../../../_services/wf/wf.service';

import { DTOWfSteps } from '../../../_model/DTOWfSteps';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { DTOWfStepsCodeudor } from '../../../_model/DTOWfStepsCodeudor';
import { DTOWfStepsFinancialInfo } from '../../../_model/DTOWfStepsFinancialInfo';

import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../../../_components/dialog-message/dialog-message.component';
import { EXP_REGULAR_NUMERO, EXP_REGULAR_ALFANUMERICO } from '../../../_shared/constantes';
import { WfParameterService } from '../../../_services/wfparameter/wfparameter.service';
import { DTOWFFilter } from '../../../_model/DTOWFFilter';
import { CreditEditComponent } from '../credit/credit-edit/credit-edit.component';


@Component({
  selector: 'app-dialogo',
  templateUrl: './creditsearch.component.html',
  styleUrls: ['./creditsearch.component.css']
})
export class CreditSearchComponent implements OnInit {

  o: DTOWfParameter;
  step: DTOWfSteps;
  filter: DTOWFFilter;

  codeu: DTOWfStepsCodeudor;
  public forma: FormGroup;

  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  listRequest: DTOWfSteps[];
  loading: boolean = false;
  showFormAdd: boolean = false;
  displayedColumns = ['numeroRadicacion', 'nitter', 'nomTer', 'idStepNow', 'estado', 'action'];


  dataSource: MatTableDataSource<DTOWfSteps>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private wfService: WfService, public dialog: MatDialog, private wfParamService: WfParameterService, private formBuilder: FormBuilder) {
    this.o = new DTOWfParameter();
    this.filter = new DTOWFFilter();
    this.crearFormulario();

  }

  ngOnInit() {

    this.wfService.getMoveToEdit.subscribe(move => {
      this.getCredit(move);
    });

    this.initStep(false, 0, "1");
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      fechaInit: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(10)]],
      fechaFin: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(10)]],
      asesor: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(10)]],
      estado: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(10)]],

    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  hideForm() {
    this.showFormAdd = false;
    this.initStep(false, 0, "1");
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }


  getCreditFromChild() {
    this.getCredit(this.step.nextStep);
  }

  getCredit(move: string) {
    this.loading = true;
    this.wfService.listByNumRadAndMov(this.step.numeroRadicacion, move).subscribe(async (res: DTOWfSteps) => {
      this.step = res;
      this.step.readonly = true;
      this.step.isUpdate = true;
      this.loading = false;
      this.showFormAdd = true;
    }, error => {
      this.loading = false;
    });
  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,

    });
  }

  openDialogEdit(o: DTOWfSteps) {
    this.showFormAdd = false;
    this.step = o;
    this.dialog.open(CreditEditComponent, {
      width: '400px',
      data: this.step.numeroRadicacion,
    });

  }

  consultarSolicitudes() {
    this.showFormAdd = false;
    this.loading = true;
    this.wfService.listWithFilter(this.filter).subscribe(async (res: DTOWfSteps[]) => {
      this.listRequest = res;
      this.dataSource = new MatTableDataSource(this.listRequest);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });

  }

  showCreateStep() {
    this.initStep(false, 0, '1');

  }

  initStep(isUpdate: boolean, numRad: number, nextStep: string) {
    this.step = new DTOWfSteps();
    this.step.idStep = '1';
    this.step.idSubStep = '1';
    this.step.nextStep = nextStep;
    this.step.numeroRadicacion = numRad;
    this.step.nitter = "0";
    this.codeu = new DTOWfStepsCodeudor();
    this.step.codeu = this.codeu;
    this.step.tipVivienda = '0';
    this.step.bienAfecta = '0';
    this.step.bienHipoteca = '0';
    this.step.vehPignorado = '0';
    this.step.codeu.tipVivienda = '0';
    this.step.codeu.bienAfecta = '0';
    this.step.codeu.bienHipoteca = '0';
    this.step.codeu.vehPignorado = '0';
    this.step.idWf = '4';
    this.step.entitie = '0';
    this.step.valorPress = '0';
    this.step.perCuota = '0';
    this.step.nroCuotas = 0;
    var financial = new DTOWfStepsFinancialInfo();
    this.step.financial = financial;
    this.step.isUpdate = isUpdate;
  }

}
