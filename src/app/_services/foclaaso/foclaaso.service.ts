import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOFoclaaso } from '../../_model/DTOFoclaaso';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoclaasoService {

  systemCambio = new Subject<DTOFoclaaso[]>();
  mensajeCambio = new Subject<string>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/foclaaso';
  }

  listAll = () => {
    return this.http.get<DTOFoclaaso[]>(`${this.url}`, { withCredentials: true });
  }

  listAllWithoutFilter = () => {
    return this.http.get<DTOFoclaaso[]>(`${this.url}/all`, { withCredentials: true });
  }

  foclaasoByCodTer = (codTer: number) => {
    return this.http.get<DTOFoclaaso>(`${this.url}/${codTer}/tercero`, { withCredentials: true });
  }



}
