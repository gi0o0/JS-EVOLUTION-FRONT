import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOBaentidad } from '../../_model/DTOBaentidad';

@Injectable({
  providedIn: 'root'
})
export class BaentidadService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/baentidad';
  }

  listAll = () => {
    return this.http.get<DTOBaentidad[]>(`${this.url}`,{ withCredentials: true });
  }


}
