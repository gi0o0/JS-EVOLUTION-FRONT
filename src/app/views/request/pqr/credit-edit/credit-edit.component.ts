import { Component, OnInit, Inject } from '@angular/core';
import { DTOParameter } from '../../../../_model/DTOParameter';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { DTOWfStepParameter } from '../../../../_model/DTOWfStepParameter';
import { WfPqrService } from '../../../../_services/wfpqr/wfpqr.service';
import { DTOWfPqrSteps } from '../../../../_model/DTOWfPqrSteps';

@Component({
  selector: 'app-dialogo',
  templateUrl: './credit-edit.component.html',
  styleUrls: ['./credit-edit.component.css']
})
export class PqrEditComponent implements OnInit {

  param: DTOParameter;
  loading: boolean = false;
  disableInput: boolean = false;
  nextStep: string = "";
  steps: DTOWfStepParameter[];

  constructor(private dialogRef: MatDialogRef<PqrEditComponent>, private wfService: WfPqrService, @Inject(MAT_DIALOG_DATA) public step: DTOWfPqrSteps) { }

  ngOnInit() {
    this.getStepsByWf(this.step);
  }

  cancelar() {
    this.dialogRef.close();
  }

  operar() {
    this.wfService.eventMoveToEdit.next(this.nextStep);
    this.dialogRef.close();
  }

  getStepsByWf(step: DTOWfPqrSteps) {
    this.loading = true;
    this.wfService.listStepById(step.idWf, step.numeroRadicacion).subscribe(async (res: DTOWfStepParameter[]) => {
      this.steps = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

}