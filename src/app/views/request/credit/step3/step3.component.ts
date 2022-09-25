import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WfService } from '../../../../_services/wf/wf.service';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { LoadFilesComponent } from '../../../../_components/load-files/load-files.component';

@Component({
  selector: 'step-3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit {

  @Input() step: DTOWfSteps;
  errorServicio: boolean;
  loading: boolean = false;
  @ViewChild('attachments') attachment: any;
  maxFiles: number;
  sizeFiles: number;
  sizeFilesName: number;
  acceptFiles: string;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog, private wfService: WfService) { }

  ngOnInit() {
     
    this.wfService.wf_step_event_docs.subscribe(data => {
      if ("3" == data.nextStep) {
        this.operarStep3();
      }
    });
    this.callStepOld();
  }

  callStepOld(){
    if(this.step.isUpdate){
      setTimeout(() => {
        this.parentFun.emit();
      }, 10);
    }
  }

  callLoadFile() {
    this.dialog.open(LoadFilesComponent, {
      width: '700px',
      height: '500px',
      data: this.step
    });
  }

  operarStep3() {
    this.loading = true;
    this.wfService.createStep(this.step).subscribe(data => {
      this.loading = false;
      this.step = data as DTOWfSteps;
      this.init();
      this.showMessage("Step Ingresado.");
      this.wfService.wf_step_event.next(this.step);
      console.log(this.step.nextStep);
    }, error => {
      this.loading = false;
      this.showMessage(error.error.mensaje);
    });
  }


  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,
    });
  }

  init() {
    this.step.files = [];
    this.step.filesNames = [];
  }

}
