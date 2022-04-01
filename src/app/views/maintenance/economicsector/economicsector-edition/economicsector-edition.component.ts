import { Component, OnInit, Inject } from '@angular/core';
import { DTOEconomicsector } from '../../../../_model/DTOEconomicsector';
import { EconomicsectorService } from '../../../../_services/economicsector/economicsector.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO } from '../../../../_shared/constantes';

@Component({
  selector: 'app-dialogo',
  templateUrl: './economicsector-edition.component.html',
  styleUrls: ['./economicsector-edition.component.css']


})
export class EconomicsectorEditionComponent implements OnInit {

  param: DTOEconomicsector;
  loading: boolean = false;
  disableInput: boolean = false;
  isUpdate: boolean = false;
  public forma: FormGroup;

  constructor(private dialogRef: MatDialogRef<EconomicsectorEditionComponent>, @Inject(MAT_DIALOG_DATA) private data: DTOEconomicsector, private economicsectorService: EconomicsectorService,
    private formBuilder: FormBuilder) {

    this.crearFormulario();
  }

  public errorServicio: boolean;

  ngOnInit() {
    //console.log(this.data);
    this.param = new DTOEconomicsector();
    this.param.codSec = this.data.codSec;
    this.param.nomSec = this.data.nomSec;
    this.errorServicio = false;


    if (this.param != null && this.param.codSec.length > 0) {
      this.disableInput = true;
      // TODO crear variable y si entro aqui es uopdate si no insert
      this.isUpdate = true;
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(5)]],
      nombre: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]]

    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  operar() {
    if (!this.validarErroresCampos()) {
      this.loading = true;

      // TODO Si esta en modo add o update
      if (this.isUpdate) {
        this.economicsectorService.update(this.param).subscribe(data => {
          this.refresh("Sector Actualizado");

        }, error => {

          this.messageError(error.error.mensaje);

        });
      } else {
        this.economicsectorService.create(this.param).subscribe(data => {
          this.refresh("Sector Ingresado.");
        }, error => {
          console.log(error.error.mensaje);
          this.messageError(error.error.mensaje);

        });
      }
    }

  }
  // TODO hacer metodos para reutilizar codigo tamnto para listar como el de la modal
  messageError(texMensaje: string) {
    this.loading = false;
    this.economicsectorService.mensajeCambio.next(texMensaje);
    this.dialogRef.close();
  }

  validarErroresCampos = () => {
    let errorCampos = false;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      });
      this.errorServicio = false;
      errorCampos = true;
    }
    return errorCampos;
  }

  mensajeErrorServicio = () => {
    return this.errorServicio;
  }
  refresh(texMensaje: string) {
    this.economicsectorService.listAll().subscribe(sectors => {
      this.economicsectorService.sectorCambio.next(sectors);
      this.messageError("Operación Correcta. ".concat(texMensaje));
    });


  }


}
