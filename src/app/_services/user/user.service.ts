import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOUser } from '../../_model/DTOUser';
import { Subject } from 'rxjs';
import { DTOTercero } from '../../_model/DTOTercero';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  profileCambio = new Subject<DTOUser[]>();
  mensajeCambio = new Subject<string>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/user',{ withCredentials: true };
  }

  listAll = () => {
    return this.http.get<DTOUser[]>(`${this.url}`,{ withCredentials: true });
  }

  sync = () => {
    return this.http.get<DTOUser[]>(`${this.url}/sync`,{ withCredentials: true });
  }

  listUserTerceroByNitter =(id: number) => {
    return this.http.get<DTOTercero>(`${this.url}/${id}/tercero`,{ withCredentials: true });
  }

  updateProfile(profile: DTOUser) {
    return this.http.put(`${this.url}/profile`, profile,{ withCredentials: true });
  }

  createUsuario(user: DTOUser) {
    return this.http.post(this.url, user,{ withCredentials: true });
  }

}
