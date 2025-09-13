import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['dialog-search-request.component.css'],
  templateUrl: 'dialog-search-request.component.html'
})
export class BuscarSolicitudDialogComponent {
  idSolicitud: number | null = null;
  loading: boolean = false;
  errorMsg: string = '';

  constructor(private dialogRef: MatDialogRef<BuscarSolicitudDialogComponent>) {}

  onCancelar(): void {
    this.dialogRef.close();
  }

  onBuscar(): void {
    if (this.idSolicitud === null || isNaN(this.idSolicitud) || this.idSolicitud <= 0) {
      this.errorMsg = 'Debe ingresar un ID válido';
      return;
    }

    this.errorMsg = '';
    this.dialogRef.close(this.idSolicitud);
  }

  preventInvalidKeys(event: KeyboardEvent): void {
    if (['e', 'E', '+', '-', '.'].includes(event.key)) {
      event.preventDefault();
    }
  }
}
