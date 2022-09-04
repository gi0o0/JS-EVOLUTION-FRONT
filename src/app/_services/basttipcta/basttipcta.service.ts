import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOBasTTipCta } from '../../_model/DTOBasTTipCta';

@Injectable({
  providedIn: 'root'
})
export class BasTTipCtaService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/account_type';
  }

  listAll = () => {
    return this.http.get<DTOBasTTipCta[]>(`${this.url}`,{ withCredentials: true });
  }


}
