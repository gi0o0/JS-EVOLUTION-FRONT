import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOProfile } from '../../_model/DTOProfile';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profileCambio = new Subject<DTOProfile[]>();
  mensajeCambio = new Subject<string>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/profile';
  }

  listAll = () => {
    return this.http.get<DTOProfile[]>(`${this.url}`);
  }


  listById(id: number) {
    return this.http.get<DTOProfile>(`${this.url}/${id}`);
  }

  create(profile: DTOProfile) {
    return this.http.post(this.url, profile);
  }

  update(profile: DTOProfile) {
    return this.http.put(this.url, profile);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }


}
