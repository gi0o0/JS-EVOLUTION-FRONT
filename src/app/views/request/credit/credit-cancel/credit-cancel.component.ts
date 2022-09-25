import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialogo',
  templateUrl: './credit-cancel.component.html',
  styleUrls: ['./credit-cancel.component.css']
})
export class CreditCancelComponent implements OnInit {

  constructor(
    public dialogo: MatDialogRef<CreditCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

    cerrarDialogo(): void {
      this.dialogo.close("C");
    }
    confirmado(): void {
      this.dialogo.close("N");
    }

  ngOnInit() {
  }

}