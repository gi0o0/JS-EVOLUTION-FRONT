import { Component, OnInit, ViewChild } from '@angular/core';
import { DTOWfParameter } from '../../../_model/DTOWfParameter';
import { WfService } from '../../../_services/wf/wf.service';

import { DTOWfSteps } from '../../../_model/DTOWfSteps';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';

import { DTOWfStepsCodeudor } from '../../../_model/DTOWfStepsCodeudor';
import { DTOWfStepsFinancialInfo } from '../../../_model/DTOWfStepsFinancialInfo';
import { CreditCancelComponent } from './credit-cancel/credit-cancel.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../../../_components/dialog-message/dialog-message.component';
import { CreditEditComponent } from './credit-edit/credit-edit.component';
import { WfParameterService } from '../../../_services/wfparameter/wfparameter.service';

@Component({
  selector: 'app-dialogo',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent implements OnInit {

  o: DTOWfParameter;
  step: DTOWfSteps;
  codeu: DTOWfStepsCodeudor;

  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  listRequest: DTOWfSteps[];
  loading: boolean = false;
  showFormAdd: boolean = false;
  displayedColumns = ['numeroRadicacion', 'nitter', 'nomTer', 'idStepNow', 'estado', 'action'];

  approvalMessage: string = "Se requiere VoBo para el siguiente paso.";
  dataSource: MatTableDataSource<DTOWfSteps>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private wfService: WfService, public dialog: MatDialog, private wfParamService: WfParameterService,) {
    this.o = new DTOWfParameter();

  }

  ngOnInit() {

    this.wfService.wf_step_event.subscribe(data => {
      this.validUserByStep(data, data.isUpdate);
    });

    this.wfService.getMoveToEdit.subscribe(move => {
      this.getCredit(move);
    });
    this.getRequest();
    this.initStep(false, 0, "1");
  }

  validUserByStep(data: DTOWfSteps, isUpdate: boolean) {
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
    this.initStep(false, 0, "1");
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }

  getRequest() {
    this.loading = true;
    this.wfService.listByUser().subscribe(async (res: DTOWfSteps[]) => {
      this.listRequest = res;
      this.dataSource = new MatTableDataSource(this.listRequest);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }


  getCreditFromChild() {
    this.getCredit(this.step.nextStep);
  }

  getCredit(move: string) {
    this.loading = true;
    this.wfService.listByNumRadAndMov(this.step.numeroRadicacion, move).subscribe(async (res: DTOWfSteps) => {

      if (res.nextStep != undefined) {
        this.validUserByStep(res, true);
        this.step.isUpdate = true;
      } else {
        this.step.isUpdate = false;
      }


      this.loading = false;
      this.showForm();
    }, error => {
      this.loading = false;
    });
  }

  showDialogCancel(o: DTOWfSteps): void {
    this.dialog
      .open(CreditCancelComponent, {
        width: '400px',
      })
      .afterClosed()
      .subscribe((estado: string) => {
        if (estado != undefined) {
          o.estado = estado
          this.loading = true;
          this.wfService.updateState(o).subscribe(data => {
            this.loading = false;
            this.showMessage("Solicitud Actualizada.");
          }, error => {
            this.loading = false;
            this.showMessage("ERROR:" + error);
          });
        }
      });
  }

  openDialogEdit(o: DTOWfSteps) {
    this.step = o;
    this.dialog.open(CreditEditComponent, {
      width: '400px',
      data: this.step,
    });

  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,

    });
  }

  showCreateStep() {
    this.initStep(false, 0, '1');
    this.showForm();
  }

  initStep(isUpdate: boolean, numRad: number, nextStep: string) {
    this.step = new DTOWfSteps();
    this.step.idStep = '1';
    this.step.idSubStep = '1';
    this.step.nextStep = nextStep;
    this.step.numeroRadicacion = numRad;
    this.step.nitter = "0";
    this.step.antiEmpresa = 0;
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
