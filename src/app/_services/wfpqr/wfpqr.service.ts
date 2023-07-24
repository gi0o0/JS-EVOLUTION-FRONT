import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


import { Subject } from 'rxjs';
import { DTOWfStepParameter } from '../../_model/DTOWfStepParameter';
import { DTOWallet } from '../../_model/DTOWallet';
import { DTOWFFilter } from '../../_model/DTOWFFilter';
import { DTOWfPqrSteps } from '../../_model/DTOWfPqrSteps';

@Injectable({
  providedIn: 'root'
})
export class WfPqrService {

  objetoCambio = new Subject<DTOWfPqrSteps>();
  mensajeCambio = new Subject<string>();
  wf_step_event = new Subject<DTOWfPqrSteps>();
  wf_step_event_docs = new Subject<DTOWfPqrSteps>();
  eventMoveToEdit = new Subject<string>();
  getWfToEdit = new Subject<string>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/wfpqr';
  }

  listStepById = (id: number) => {
    return this.http.get<DTOWfStepParameter[]>(`${this.url}/${id}/steps`, { withCredentials: true });
  }

  listByUser = () => {
    return this.http.get<DTOWfPqrSteps[]>(`${this.url}`, { withCredentials: true });
  }

  listById(id: number) {
    return this.http.get<DTOWfPqrSteps>(`${this.url}/${id}`, { withCredentials: true });
  }

  listByNumRadAndMov(numRad: number, move: string, wf: string,) {
    return this.http.get<DTOWfPqrSteps>(`${this.url}/${numRad}/step/${move}/wf/${wf}`, { withCredentials: true });
  }

  listWithFilter(filter: DTOWFFilter) {
    return this.http.post<DTOWfPqrSteps[]>(`${this.url}/filter`, filter, { withCredentials: true });
  }

  deleteStep(o: DTOWfPqrSteps) {
    return this.http.request('delete', `${this.url}/${o.idWf}`, { body: o, withCredentials: true });
  }

  createStep(o: DTOWfPqrSteps) {
    return this.http.post(`${this.url}`, o, { withCredentials: true });
  }

  updateState(o: DTOWfPqrSteps) {
    return this.http.put(`${this.url}/state`, o, { withCredentials: true });
  }

  updateStep(o: DTOWfPqrSteps) {
    return this.http.put(`${this.url}/${o.idWf}`, o, { withCredentials: true });
  }

  listWalletByUser(user: string, wf: string) {
    return this.http.get<DTOWallet[]>(`${this.url}/${user}/portafolio/${wf}`, { withCredentials: true });
  }

}
