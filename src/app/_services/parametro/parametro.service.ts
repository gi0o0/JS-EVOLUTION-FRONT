import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parametro } from '../../_interfaces/Parametro';
import { environment } from '../../../environments/environment';
import { ParametroCalculadoraDireccion } from '../../_interfaces/ParametroCalculadoraDireccion';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.url_host;
  }

  obtenerParametro = (id: string) => {
    return this.http.get<Parametro>(`${this.baseUrl}/parametro/${id}`);
  }

  obtenerParametroCalculadoraDireccion = () => {
    return this.http.get<ParametroCalculadoraDireccion>(`${this.baseUrl}/parametro/calculadora-direccion`);
  }

  obtenerListaParametro = (idParametro: any) => {
    return this.http.get<any[]>(`${this.baseUrl}/parametro/${idParametro}/lista`);
  }
}
