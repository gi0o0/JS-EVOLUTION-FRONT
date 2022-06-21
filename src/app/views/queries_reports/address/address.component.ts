import { Component, OnInit } from '@angular/core';

import { DTOParameter } from '../../../_model/DTOParameter';
import { ParameterService } from '../../../_services/parameter/parameter.service';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['address.component.css'],
  templateUrl: 'address.component.html'
})
export class AddressComponent implements OnInit {

  public listaParameter: DTOParameter[];
  loading: boolean = false;
  public address: string = "";

  constructor(private service: ParameterService, public dialog: MatDialog) { }

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

  

  onParameterChange(event) {
    this.address = this.address + event.value.text;
  }

}
