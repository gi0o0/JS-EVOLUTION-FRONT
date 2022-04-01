import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DTOEconomicsector } from '../../_model/DTOEconomicsector';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EconomicsectorService {

  private url: string;
  sectorCambio = new Subject<DTOEconomicsector[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/economicsector';
  }

  listAll = () => {
    return this.http.get<DTOEconomicsector[]>(`${this.url}`,{ withCredentials: true });
  }

  create(o: DTOEconomicsector) {
    return this.http.post(this.url, o,{ withCredentials: true });
  }

  update(o: DTOEconomicsector) {
    return this.http.put(this.url, o,{ withCredentials: true });
  }

  delete(id: string) {
    return this.http.delete(`${this.url}/${id}`,{ withCredentials: true });
  }
}
