import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOWfParameter } from '../../_model/DTOWfParameter';
import { DTOWfStepParameter } from '../../_model/DTOWfStepParameter';
import { DTOWfStepParameterDoc } from '../../_model/DTOWfStepParameterDoc';
import { DTOWfStepParameterAut } from '../../_model/DTOWfStepParameterAut';
import { DTOWfEstParameter } from '../../_model/DTOWfEstParameter';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WfParameterService {

  objetoCambio = new Subject<DTOWfStepParameterDoc>();
  mensajeCambio = new Subject<string>();

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/wfparameter';
  }

  listAll = () => {
    return this.http.get<DTOWfParameter[]>(`${this.url}`,{ withCredentials: true });
  }

  listStepById = (id: number) => {
    return this.http.get<DTOWfStepParameter[]>(`${this.url}/${id}/steps`,{ withCredentials: true });
  }

  listEstById = (id: number) => {
    return this.http.get<DTOWfEstParameter[]>(`${this.url}/${id}/ests`,{ withCredentials: true });
  }

  listById(id: number) {
    return this.http.get<DTOWfParameter>(`${this.url}/${id}`,{ withCredentials: true });
  }

  deleteStep(o: DTOWfStepParameter) {
    return this.http.request('delete',`${this.url}/${o.idWf}/steps`, { body: o , withCredentials: true });
  }

  deleteEsts(id: number,idEsts: number) {
    return this.http.delete(`${this.url}/${id}/ests/${idEsts}`,{ withCredentials: true });
  }

  deleteStepDoc(id: number,idStep: number,idDoc: number) {
    return this.http.delete(`${this.url}/${id}/steps/${idStep}/docs/${idDoc}`,{ withCredentials: true });
  }

  deleteStepAut(id: number,idStep: number,usuario: string) {
    return this.http.delete(`${this.url}/${id}/steps/${idStep}/auts/${usuario}`,{ withCredentials: true });
  }

  createStepAut(o: DTOWfStepParameterAut) {
    return this.http.post(`${this.url}/${o.idWf}/steps/${o.idPaso}/auts/`, o,{ withCredentials: true });
  }

  createStep(o: DTOWfStepParameter) {
    return this.http.post(`${this.url}/${o.idWf}/steps`, o,{ withCredentials: true });
  }

  createEsts(o: DTOWfEstParameter) {
    return this.http.post(`${this.url}/${o.idWf}/ests`, o,{ withCredentials: true });
  }

  updateEsts(o: DTOWfEstParameter) {
    return this.http.put(`${this.url}/${o.idWf}/ests`, o,{ withCredentials: true });
  }

  updateStep(o: DTOWfStepParameter) {
    return this.http.put(`${this.url}/${o.idWf}/steps`, o,{ withCredentials: true });
  }

  listStepDocsByIds = (idWf: number,idStep :number) => {
    return this.http.get<DTOWfStepParameterDoc[]>(`${this.url}/${idWf}/steps/${idStep}/docs`,{ withCredentials: true });
  }

  listStepAutsByIds = (idWf: number,idStep :number) => {
    return this.http.get<DTOWfStepParameterAut[]>(`${this.url}/${idWf}/steps/${idStep}/auts`,{ withCredentials: true });
  }

  validUserStepAuts = (idWf: string,idStep :string) => {
    return this.http.get<DTOWfStepParameterAut[]>(`${this.url}/wf/${idWf}/step/${idStep}/security`,{ withCredentials: true });
  }


}
