import { Component, OnInit, Inject } from '@angular/core';
import { DTOParameter } from '../../../../_model/DTOParameter';
import { ParameterService } from '../../../../_services/parameter/parameter.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialogo',
  templateUrl: './parameter-edition.component.html',
  styleUrls: ['./parameter-edition.component.css']
})
export class ParameterEditionComponent implements OnInit {

  param: DTOParameter;
  loading: boolean = false;
  disableInput: boolean = false;

  constructor(private dialogRef: MatDialogRef<ParameterEditionComponent>, @Inject(MAT_DIALOG_DATA) private data: DTOParameter, private parameterService: ParameterService) { }


  ngOnInit() {
    this.param = new DTOParameter();
    this.param.id = this.data.id;
    this.param.text = this.data.text;
    this.param.value = this.data.value;

    if (this.param != null && this.param != undefined && this.param.id != undefined){
      if(this.param.id.length > 0) {
        this.disableInput = true;
      }
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

  operar() {
    this.loading = true;
      this.parameterService.update(this.param).subscribe(data => {
        this.parameterService.listAll().subscribe(params => {
          this.parameterService.profileCambio.next(params);
          this.loading = false;
          this.parameterService.mensajeCambio.next("Operaciòn Correcta");
          this.cancelar();
        });
      }, error => {
        this.loading = false;
        this.parameterService.mensajeCambio.next(error.error.mensaje);
        this.cancelar();
      });
    

  }

}
