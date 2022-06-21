import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DTOParameter } from '../../_model/DTOParameter';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  private url: string;
  profileCambio = new Subject<DTOParameter[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/parameter';
  }

  listAll = () => {
    return this.http.get<DTOParameter[]>(`${this.url}`,{ withCredentials: true });
  }

  create(o: DTOParameter) {
    return this.http.post(this.url, o,{ withCredentials: true });
  }

  update(o: DTOParameter) {
    return this.http.put(this.url, o,{ withCredentials: true });
  }

  delete(o: DTOParameter) {
    return this.http.request('delete', this.url, { body: o , withCredentials: true });
  }

  listParametersByParamId = (id: string) => {
    return this.http.get<DTOParameter[]>(`${this.url}/${id}`,{ withCredentials: true });
  }
}
