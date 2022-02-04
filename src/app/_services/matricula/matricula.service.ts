import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { SeguridadService } from '../seguridad/seguridad.service';

import { MatriculaDTO } from '../../_model/MatriculaDTO';
import { DetalleMatriculaDTO } from 'src/app/_model/DetalleMatriculaDTO';
import { ActividadEconomicaDTO } from '../../_model/ActividadEconomicaDTO';


@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private seguridadService: SeguridadService
    ) {
      this.baseUrl = environment.url_host;
  }

  obtenerListadoMatriculas = () => {
    const credenciales  =  { ... this.seguridadService.obtenerCredenciales() };
    delete credenciales.tokenAcceso;
    return this.http.post<MatriculaDTO[]>(`${this.baseUrl}/matricula`, credenciales);
  }

  obtenerDetalleMatricula = (numeroMatricula: string) => {
    const credenciales  =  { ... this.seguridadService.obtenerCredenciales() };
    delete credenciales.tokenAcceso;
    return this.http.post<DetalleMatriculaDTO>(`${this.baseUrl}/matricula/${numeroMatricula}`, credenciales);
  }


  generarAlertaSipref = (numeroMatricula: string, numCliente: number, codigoAccion: number) => {
    this.http.get<any>(`${this.baseUrl}/alerta/${numeroMatricula}/${numCliente}/tipo/${codigoAccion}`).subscribe( respo => {});
  }

  obtenerListadoCiuus = (numMatricula: string) => {
    return this.http.get<ActividadEconomicaDTO>(`${this.baseUrl}/actividad-economica/${numMatricula}/ciiu`);
  }

}
