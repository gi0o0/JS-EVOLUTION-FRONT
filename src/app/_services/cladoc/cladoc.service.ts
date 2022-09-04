import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DTOCladoc } from '../../_model/DTOCladoc';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CladocService {

  private url: string;
  profileCambio = new Subject<DTOCladoc[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/cladoc';
  }

  listAll = () => {
    return this.http.get<DTOCladoc[]>(`${this.url}`, { withCredentials: true });
  }

}
