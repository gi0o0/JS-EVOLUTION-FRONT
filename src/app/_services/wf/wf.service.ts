import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOWfSteps } from '../../_model/DTOWfSteps';

import { Subject } from 'rxjs';
import { DTOWfStepParameter } from '../../_model/DTOWfStepParameter';
import { DTOWallet } from '../../_model/DTOWallet';
import { DTOWFFilter } from '../../_model/DTOWFFilter';

@Injectable({
  providedIn: 'root'
})
export class WfService {

  objetoCambio = new Subject<DTOWfSteps>();
  mensajeCambio = new Subject<string>();
  wf_step_event = new Subject<DTOWfSteps>();
  wf_step_event_docs = new Subject<DTOWfSteps>();
  getMoveToEdit = new Subject<string>();
  getWfToEdit = new Subject<string>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/wf';
  }

  listStepById = (idWf: string, numRad: number) => {

    return this.http.get<DTOWfStepParameter[]>(`${this.url}/${idWf}/rad/${numRad}/steps`, { withCredentials: true });
  }

  listByUser = () => {
    return this.http.get<DTOWfSteps[]>(`${this.url}`, { withCredentials: true });
  }

  listById(id: number) {
    return this.http.get<DTOWfSteps>(`${this.url}/${id}`, { withCredentials: true });
  }

  listByNumRadAndMov(numRad: number, move: string,) {
    return this.http.get<DTOWfSteps>(`${this.url}/${numRad}/step/${move}`, { withCredentials: true });
  }

  listWithFilter(filter: DTOWFFilter) {
    return this.http.post<DTOWfSteps[]>(`${this.url}/filter`, filter, { withCredentials: true });
  }

  deleteStep(o: DTOWfSteps) {
    return this.http.request('delete', `${this.url}/${o.idWf}`, { body: o, withCredentials: true });
  }

  createStep(o: DTOWfSteps) {
    return this.http.post(`${this.url}`, o, { withCredentials: true });
  }

  updateState(o: DTOWfSteps) {
    return this.http.put(`${this.url}/state`, o, { withCredentials: true });
  }

  updateStep(o: DTOWfSteps) {
    return this.http.put(`${this.url}/${o.idWf}`, o, { withCredentials: true });
  }

  listWalletByUser(user: string) {
    return this.http.get<DTOWallet[]>(`${this.url}/${user}/portafolio`, { withCredentials: true });
  }

  listStepStatesByUserWkRad(user: string, wk: string, numRad: string) {
    return this.http.get<DTOWallet[]>(`${this.url}/steps/wf/${wk}/user/${user}/rad/${numRad}/stepstate`, { withCredentials: true });
  }

  listPortfolioByUser(user: string) {
    return this.http.get<DTOWallet[]>(`${this.url}/${user}/briefcase/`, { withCredentials: true });
  }

}
