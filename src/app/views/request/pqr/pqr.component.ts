import { Component, OnInit, ViewChild } from '@angular/core';
import { DTOWfParameter } from '../../../_model/DTOWfParameter';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../../../_components/dialog-message/dialog-message.component';
import { WfParameterService } from '../../../_services/wfparameter/wfparameter.service';
import { PqrWfComponent } from './pqr-wf/pqr-wf.component';
import { DTOWfPqrSteps } from '../../../_model/DTOWfPqrSteps';
import { WfPqrService } from '../../../_services/wfpqr/wfpqr.service';
import { PqrEditComponent } from './credit-edit/credit-edit.component';
import { ParameterService } from '../../../_services/parameter/parameter.service';
import { DTOParameter } from '../../../_model/DTOParameter';

@Component({
  selector: 'app-dialogo',
  templateUrl: './pqr.component.html',
  styleUrls: ['./pqr.component.css']
})
export class PqrComponent implements OnInit {

  o: DTOWfParameter;
  step: DTOWfPqrSteps;

  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  listRequest: DTOWfPqrSteps[];
  loading: boolean = false;
  showFormAdd: boolean = false;
  displayedColumns = ['numeroRadicacion', 'nitter', 'nomTer', 'idWf', 'idStepNow', 'estado', 'fecUltMod', 'estadoCuenta', 'action'];
  dayMax: number = 0;
  approvalMessage: string = "Se requiere VoBo para el siguiente paso.";
  dataSource: MatTableDataSource<DTOWfPqrSteps>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private wfService: WfPqrService, public dialog: MatDialog, private wfParamService: WfParameterService, private parameterService: ParameterService) {
    this.o = new DTOWfParameter();
  }

  ngOnInit() {

    this.wfService.wf_step_event.subscribe(data => {
      this.validUserByStep(data, data.isUpdate);
    });

    this.wfService.eventMoveToEdit.subscribe(move => {
      this.step.nextStep = move;
      this.getMov();
    });

    this.wfService.getWfToEdit.subscribe(data => {
      this.initStep(0, '1', data);
      this.showForm();
    });

    this.getRequest();
    this.initStep(0, "1", "1");
    this.getDayMax();
  }

  getDayMax() {
    this.parameterService.listParametersByParamId('DIAS_ALERTA').subscribe(async (res: DTOParameter[]) => {
      this.dayMax = Number(res[0].value);
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  validUserByStep(data: DTOWfPqrSteps, isUpdate: boolean) {
    this.loading = true;
    this.wfParamService.validUserStepAuts(data.idWf, data.idStep).subscribe(async (res: any) => {
      this.step = data;
      this.step.isUpdate = isUpdate;
      this.loading = false;
    }, error => {
      this.showMessage("Usuario no cuenta con permiso para editar o crear este Paso.");
      this.loading = false;
      this.hideForm();
    });
  }


  showForm() {
    this.showFormAdd = true;
  }

  hideForm() {
    this.showFormAdd = false;
    this.initStep(0, "1", "0");
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }

  getRequest() {
    this.loading = true;
    this.wfService.listByUser().subscribe(async (res: DTOWfPqrSteps[]) => {
      this.listRequest = res;
      this.dataSource = new MatTableDataSource(this.listRequest);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }


  getMov() {

    this.loading = true;
    this.wfService.listByNumRadAndMov(this.step.numeroRadicacion, this.step.nextStep, this.step.idWf).subscribe(async (res: DTOWfPqrSteps) => {

      if (res.nextStep != undefined) {
        this.validUserByStep(res, true);
        this.step.isUpdate = true;
        this.step.isRequiredEmail = false;

      } else {
        this.step.isRequiredEmail = false;
        this.step.isUpdate = false;
      }
      this.loading = false;
      this.showForm();
    }, error => {
      this.loading = false;
    });
  }

  showPqrWfComponent() {
    this.dialog.open(PqrWfComponent, {
      width: '300px',
    });
  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,

    });
  }

  initStep(numRad: number, nextStep: string, idWf: string,) {
    this.step = new DTOWfPqrSteps();
    this.step.idStep = '1';
    this.step.idSubStep = '1';
    this.step.nextStep = nextStep;
    this.step.numeroRadicacion = numRad;
    this.step.nitter = "";
    this.step.isUpdate = false;
    this.step.isRequiredEmail = false;
    this.step.idWf = idWf;
    this.step.nameWf = idWf == "1" ? "Estados - PQR - DP" : "Llamadas";
  }

  openDialogEdit(o: DTOWfPqrSteps) {
    this.step = o;

    this.dialog.open(PqrEditComponent, {
      width: '400px',
      data: this.step
    });
  }

  getCreditFromChild() {
    this.getMov();
  }

  getRowColorByDateMax(o: DTOWfPqrSteps): string {

    let startDate = new Date(o.fecUltMod);
    let endDate = new Date();

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
    let dias = Math.floor(differenceInMilliseconds / millisecondsPerDay);

    if (dias >= this.dayMax) {
      return '#ff7673';
    }
    return '';
  }




}