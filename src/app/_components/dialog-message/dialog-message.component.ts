import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialogo',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.css']
})
export class DialogMessageComponent implements OnInit {

  constructor(
    public dialogo: MatDialogRef<DialogMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

  
    aceptar(): void {
      this.dialogo.close(true);
    }

  ngOnInit() {
  }

}