import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTOWfLoan } from '../../_model/DTOWfLoan';

@Injectable({
  providedIn: 'root'
})
export class WfLoanService {


  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/loan';
  }


  ListByWfAndNumRad(idWf: string, numRad: number) {
    return this.http.get<DTOWfLoan[]>(`${this.url}/${idWf}/wf/${numRad}`, { withCredentials: true });
  }


}
