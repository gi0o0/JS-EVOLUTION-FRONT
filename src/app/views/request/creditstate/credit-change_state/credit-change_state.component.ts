import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialogo',
  templateUrl: './credit-change_state.component.html',
  styleUrls: ['./credit-change_state.component.css']
})
export class CreditChangeStateComponent implements OnInit {

  estado: string;

  constructor(public dialogo: MatDialogRef<CreditChangeStateComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

  ngOnInit() { }

  operar() {
    this.dialogo.close(this.estado);
  }

}