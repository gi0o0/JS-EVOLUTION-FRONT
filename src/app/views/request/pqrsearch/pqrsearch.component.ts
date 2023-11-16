import { Component, OnInit, ViewChild } from '@angular/core';
import { DTOWfParameter } from '../../../_model/DTOWfParameter';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { DialogMessageComponent } from '../../../_components/dialog-message/dialog-message.component';
import { EXP_REGULAR_ALFANUMERICO } from '../../../_shared/constantes';
import { DTOWFFilter } from '../../../_model/DTOWFFilter';
import { CreditEditComponent } from '../credit/credit-edit/credit-edit.component';
import { UserWebService } from '../../../_services/userweb/userweb.service';
import { DTOTercero } from '../../../_model/DTOTercero';
import { WfPqrService } from '../../../_services/wfpqr/wfpqr.service';
import { DTOWfPqrSteps } from '../../../_model/DTOWfPqrSteps';
import { PqrEditComponent } from '../pqr/credit-edit/credit-edit.component';
import { ParameterService } from '../../../_services/parameter/parameter.service';
import { DTOParameter } from '../../../_model/DTOParameter';

@Component({
  selector: 'app-dialogo',
  templateUrl: './pqrsearch.component.html',
  styleUrls: ['./pqrsearch.component.css']
})

export class PqrSearchComponent implements OnInit {

  o: DTOWfParameter;
  step: DTOWfPqrSteps;
  filter: DTOWFFilter;
  listAdvisers: DTOTercero[];
  listArea: DTOParameter[];
  public forma: FormGroup;

  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  listRequest: DTOWfPqrSteps[];
  tipSolCredito: DTOParameter[];
  loading: boolean = false;
  showFormAdd: boolean = false;
  displayedColumns = ['numeroRadicacion', 'nitter', 'nomTer', 'idWf', 'idStepNow', 'estado', 'stateType', 'action'];

  dataSource: MatTableDataSource<DTOWfPqrSteps>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private wfService: WfPqrService, public dialog: MatDialog, private userWebService: UserWebService, private formBuilder: FormBuilder, private parameterService: ParameterService) {
    this.o = new DTOWfParameter();
    this.filter = new DTOWFFilter();
    this.crearFormulario();
  }

  ngOnInit() {

    this.wfService.eventMoveToEdit.subscribe(move => {
      this.getPqr(move);
    });

    this.initStep(false, 0, "1");
    this.getAdvisers();
    this.getArea();
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      fechaInit: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(10)]],
      fechaFin: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(10)]],
      asesor: ['',],
      estado: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(10)]],
      entitie: ['',],
      sector: ['',],
      area: ['',],
      state: ['',],
      nitter: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
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

  getAdvisers() {
    this.loading = true;
    this.userWebService.listAdvisers().subscribe(async (res: DTOTercero[]) => {
      this.listAdvisers = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getArea() {
    this.parameterService.listParametersByParamId('AREA').subscribe(async (res: DTOParameter[]) => {
      this.listArea = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getStates(event: any) {

    this.loading = true;
    let stateType: string = "ESTADO_EST";

    if (this.filter.idWf == "2") {
      stateType = 'ESTADO_LLAMADAS';
    }

    if (this.filter.idWf == "1") {
      stateType = 'ESTADO_DP';
    }

    this.parameterService.listParametersByParamId(stateType).subscribe(async (res: DTOParameter[]) => {
      this.tipSolCredito = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getCreditFromChild() {
    this.getPqr(this.step.nextStep);
  }

  getPqr(move: string) {
    this.loading = true;
    this.wfService.listByNumRadAndMov(this.step.numeroRadicacion, move, this.step.idWf).subscribe(async (res: DTOWfPqrSteps) => {
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

  openDialogEdit(o: DTOWfPqrSteps) {
    this.step = o;
    this.showFormAdd = false;
    this.dialog.open(PqrEditComponent, {
      width: '400px',
      data: this.step
    });

  }

  consultarSolicitudes() {
    this.showFormAdd = false;
    this.loading = true;
    this.wfService.listWithFilter(this.filter).subscribe(async (res: DTOWfPqrSteps[]) => {
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
    this.step = new DTOWfPqrSteps();
    this.step.idStep = '1';
    this.step.idSubStep = '1';
    this.step.nextStep = nextStep;
    this.step.numeroRadicacion = numRad;
    this.step.nitter = "";
    this.step.isUpdate = isUpdate;
    this.step.isRequiredEmail = false;
  }

}
