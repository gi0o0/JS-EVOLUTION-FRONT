import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTODeptos } from '../../_model/DTODeptos';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/cities';
  }

  listAll = (idPais: number,idDeptos: number) => {
    return this.http.get<DTODeptos[]>(`${this.url}/${idPais}/${idDeptos}`, { withCredentials: true });
  }

}
