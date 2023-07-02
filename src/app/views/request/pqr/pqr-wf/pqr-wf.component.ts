import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { WfPqrService } from '../../../../_services/wfpqr/wfpqr.service';

@Component({
  selector: 'app-dialogo',
  templateUrl: './pqr-wf.component.html',
  styleUrls: ['./pqr-wf.component.css']
})
export class PqrWfComponent implements OnInit {

  nextStep: string = "";

  constructor(private dialogRef: MatDialogRef<PqrWfComponent>, private wfService: WfPqrService, @Inject(MAT_DIALOG_DATA) public id: number) { }

  ngOnInit() { }

  cancelar() {
    this.dialogRef.close();
  }

  operar() {
    this.wfService.getWfToEdit.next(this.nextStep);
    this.dialogRef.close();
  }

}