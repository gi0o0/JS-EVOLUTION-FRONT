import { Component, OnInit, Inject } from '@angular/core';
import { DTOParameter } from '../../../../_model/DTOParameter';
import { ParameterService } from '../../../../_services/parameter/parameter.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { WfParameterService } from '../../../../_services/wfparameter/wfparameter.service';
import { WK_4 } from '../../../../_shared/constantes';
import { DTOWfStepParameter } from '../../../../_model/DTOWfStepParameter';
import { WfService } from '../../../../_services/wf/wf.service';


@Component({
  selector: 'app-dialogo',
  templateUrl: './credit-edit.component.html',
  styleUrls: ['./credit-edit.component.css']
})
export class CreditEditComponent implements OnInit {

  param: DTOParameter;
  loading: boolean = false;
  disableInput: boolean = false;
  nextStep: string = "";
  steps: DTOWfStepParameter[];

  constructor(private dialogRef: MatDialogRef<CreditEditComponent>,private wfService: WfService, @Inject(MAT_DIALOG_DATA) public id: number) { 

  }


  ngOnInit() {
    this.getStepsByWf(this.id);
   }

  cancelar() {
    this.dialogRef.close();
  }

  operar() {
    this.wfService.getMoveToEdit.next(this.nextStep);
    this.dialogRef.close();
  }

  getStepsByWf(wf: number) {
    this.loading = true;
    this.wfService.listStepById(wf).subscribe(async (res: DTOWfStepParameter[]) => {
      this.steps = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

}