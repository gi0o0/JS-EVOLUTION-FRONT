import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOWfSteps } from '../../_model/DTOWfSteps';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WfService {

  objetoCambio = new Subject<DTOWfSteps>();
  mensajeCambio = new Subject<string>();
  wf_step_event = new Subject<DTOWfSteps>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/wf';
  }

  listAll = () => {
    return this.http.get<DTOWfSteps[]>(`${this.url}`,{ withCredentials: true });
  }

  listById(id: number) {
    return this.http.get<DTOWfSteps>(`${this.url}/${id}`,{ withCredentials: true });
  }

  deleteStep(o: DTOWfSteps) {
    return this.http.request('delete',`${this.url}/${o.idWf}`, { body: o , withCredentials: true });
  }

  createStep(o: DTOWfSteps) {
    return this.http.post(`${this.url}`, o,{ withCredentials: true });
  }

  updateStep(o: DTOWfSteps) {
    return this.http.put(`${this.url}/${o.idWf}`, o,{ withCredentials: true });
  }
  
}
