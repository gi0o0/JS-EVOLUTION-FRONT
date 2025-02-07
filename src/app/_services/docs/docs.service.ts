import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTODoc } from '../../_model/DTODoc';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/filesusers';
  }

  listDocsByIds = (user: string, idRequest: string, idDoc: string, name: string) => {
    return this.http.get<DTODoc[]>(`${this.url}/${user}/application/${idRequest}/doc/${idDoc}/name/${name}`, { withCredentials: true });
  }

  listDocsByIdAndStep = (idRad: string, step: string) => {
    return this.http.get<DTODoc[]>(`${this.url}/${idRad}/application/${step}`, { withCredentials: true });
  }

  listFilesByIdRad = (idRad: string) => {
    return this.http.get<DTODoc[]>(`${this.url}/${idRad}/application`, { withCredentials: true });
  }


}
