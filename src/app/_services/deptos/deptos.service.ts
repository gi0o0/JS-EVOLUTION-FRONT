import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DTODeptos } from '../../_model/DTODeptos';

@Injectable({
  providedIn: 'root'
})
export class DeptosService {

  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url_host + '/deptos';
  }

  listAll = (id: number) => {
    return this.http.get<DTODeptos[]>(`${this.url}/${id}`, { withCredentials: true });
  }

}
