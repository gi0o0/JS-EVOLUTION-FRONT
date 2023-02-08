import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOTercero } from '../../_model/DTOTercero';

@Injectable({
  providedIn: 'root'
})
export class UserWebService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/webuser', { withCredentials: true };
  }

  listAdvisers = () => {
    return this.http.get<DTOTercero[]>(`${this.url}/advisers`, { withCredentials: true });
  }



}
