import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOFotipcre } from '../../_model/DTOFotipcre';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotipcreService {

  systemCambio = new Subject<DTOFotipcre[]>();
  mensajeCambio = new Subject<string>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/fotipcre';
  }

  listAll = () => {
    return this.http.get<DTOFotipcre[]>(`${this.url}`,{ withCredentials: true });
  }


}
