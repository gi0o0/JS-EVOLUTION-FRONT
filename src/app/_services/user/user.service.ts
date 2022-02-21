import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOUser } from '../../_model/DTOUser';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  profileCambio = new Subject<DTOUser[]>();
  mensajeCambio = new Subject<string>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/user';
  }

  listAll = () => {
    return this.http.get<DTOUser[]>(`${this.url}`);
  }

  updateProfile(profile: DTOUser) {
    return this.http.put(`${this.url}/profile`, profile);
  }

}
