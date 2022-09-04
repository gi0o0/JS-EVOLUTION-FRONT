import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOFotabpro } from '../../_model/DTOFotabpro';

@Injectable({
  providedIn: 'root'
})
export class FotabproService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/fotabpro';
  }

  listAll = () => {
    return this.http.get<DTOFotabpro[]>(`${this.url}`,{ withCredentials: true });
  }


}
