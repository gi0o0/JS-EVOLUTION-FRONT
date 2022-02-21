import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOSystem } from '../../_model/DTOSystem';
import { DTOOption } from '../../_model/DTOOption';
import { DTOOptionRole } from '../../_model/DTOOptionRole';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  systemCambio = new Subject<DTOSystem[]>();
  mensajeCambio = new Subject<string>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/system';
  }

  listAll = () => {
    return this.http.get<DTOSystem[]>(`${this.url}`);
  }

  listOptionByRoleAndSystem = (idRole: string, idSystem: string) => {
    return this.http.get<DTOOption[]>(`${this.url}/${idSystem}/profile/${idRole}`);
  }

  createOption(optionRole: DTOOptionRole) {
    return this.http.post(`${this.url}/option`, optionRole);
  }

  deleteOption(idRole: string, idOption: string) {
    return this.http.delete(`${this.url}/option/${idOption}/profile/${idRole}`);
  }

}
