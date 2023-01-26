import { Component, Inject, OnInit } from '@angular/core';

import { DTOParameter } from '../../_model/DTOParameter';
import { ParameterService } from '../../_services/parameter/parameter.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DTOAddressMessage } from '../../_model/DTOAddressMessage';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['address.component.css'],
  templateUrl: 'address.component.html'
})
export class AddressComponent implements OnInit {

  public listaParameter: DTOParameter[];
  loading: boolean = false;
  public address: string = "";
  addressDto: DTOAddressMessage;

  constructor(private dialogRef: MatDialogRef<AddressComponent>, @Inject(MAT_DIALOG_DATA) public id: string, private service: ParameterService, public dialog: MatDialog) {
    this.id = id;
  }

  ngOnInit() {
    this.getDireccionDian();
  }

  getDireccionDian() {
    this.service.listParametersByParamId('DireccionDian').subscribe(async (res: DTOParameter[]) => {
      this.listaParameter = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  setCaracter(caracter: string) {
    this.address = this.address + caracter;
  }

  setClear() {
    this.address = "";
  }

  setClearLast() {
    if(this.address.length>0){
      this.address = this.address.substring(0, this.address.length - 1);
    }
    
  }

  onParameterChange(event) {
    this.address = this.address + event.value.text;
  }

  operar() {

    this.addressDto = new DTOAddressMessage();
    this.addressDto.id = this.id;
    this.addressDto.value = this.address;

    this.service.objetoCambioAdrressDian.next(this.addressDto);
    this.loading = false;
    this.dialogRef.close();
  }

}
