import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOCountries } from '../../_model/DTOCountries';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/countries';
  }

  listAll = () => {
    return this.http.get<DTOCountries[]>(`${this.url}`, { withCredentials: true });
  }

}
