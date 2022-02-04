import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TipoMutacionDTO } from '../../_model/TipoMutacionDTO';
import { HomonimiaDTO } from '../../_model/HomonimiaDTO';
import { MutacionDireccion } from '../../_interfaces/MutacionDireccion';
import { ActividadEconomica } from '../../_interfaces/ActividadEconomica';
import { ConsultaMutacionesDTO } from '../../_model/ConsultaMutacionesDTO';
import { InformacionReporteResumen } from '../../_interfaces/InformacionReporteResumen';
import { ParametroService } from '../parametro/parametro.service';
import { PARAMETRO_RESOLUCION_0549 } from '../../_shared/constantes';
import { CiiuDTO } from '../../_model/CiiuDTO';
import { Parametro } from '../../_interfaces/Parametro';

@Injectable({
  providedIn: 'root',
})
export class TipoSolicitudService {
  private baseUrl: string;

  constructor(private http: HttpClient,
              private parametroService: ParametroService) {
    this.baseUrl = environment.url_host;
  }

  obtenerTipoMutacion = (request: any) => {
    return this.http.post<TipoMutacionDTO[]>(
      `${this.baseUrl}/mutacion`,
      request
    );
  }

  validarHomonimia = (nombreEstablecimientoComercial: string) => {
    return this.http.get<HomonimiaDTO[]>(
      `${this.baseUrl}/mutacion/${nombreEstablecimientoComercial}/homonimia`
    );
  }

  guardar = (request: any) => {
    return this.http.post(`${this.baseUrl}/mutacion/registro`, JSON.stringify(request), {observe: 'response'});
  }

  obtenerListadoMunicipio = () => {
    return this.http.get<any[]>(`${this.baseUrl}/municipio`);
  }

  obtenerInformacionCambioDireccionComercialJudicial = (
    numeroMatricula: string
  ) => {
    return this.http.get<MutacionDireccion[]>(
      `${this.baseUrl}/matricula/${numeroMatricula}/direcciones`
    );
  }

  eliminarMutaciones = (request: any) => {
    return this.http.post(`${this.baseUrl}/mutacion/eliminar`, request);
  }

  obtenerActividadesEconomicasPorCriterio = (actividad: string) => {
    return this.http.get<ActividadEconomica[]>(`${this.baseUrl}/actividad-economica/consulta/${actividad}`);
  }

  profesionesLiberales = (request: any) => {
    return this.http.post<any>(`${this.baseUrl}/actividad-economica/validar/profesiones-liberales`, JSON.stringify(request));
  }

  generarPDFResumen = ( request: InformacionReporteResumen ) => {
    const httpOptions = {
      responseType  : 'blob' as 'json'
    };
    return this.http.post<any>(`${this.baseUrl}/mutacion/archivo`, request, httpOptions);
  }

  eliminarPDFresumen = (numeroCliente: any, numeroMatricula: any) => {
    return this.http.delete<any>(`${this.baseUrl}/pago/${numeroCliente}/eliminar-documento/${numeroMatricula}`);
  }

  pagar = (request: any) => {
    return this.http.post<any>(`${this.baseUrl}/pago`, JSON.stringify(request));
  }

  obtenerPreliquidacion = (request: any) => {
    return this.http.post<any>(`${this.baseUrl}/pago/liquidador`, request);
  }

  consultarMutaciones = (numeroCliente: any, numeroMatricula: any) => {
    return this.http.get<ConsultaMutacionesDTO>(`${this.baseUrl}/mutacion/${numeroCliente}/matricula/${numeroMatricula}`);
  }

  validarCiiuEnResolucion = (listadoCiiu: CiiuDTO[]) : Promise<string[]> => {
    return new Promise( (res, rej) => {
      let listadoCiiuResolucion: string[] = [];
      this.parametroService.obtenerListaParametro(PARAMETRO_RESOLUCION_0549).subscribe( ciius => {
        if (ciius) {
          listadoCiiu.forEach( aCiiu => {
            const encontrado: Parametro = ciius.find( ciiu => ciiu.vrValorParametro ===  aCiiu.ciiu);
            if (encontrado) {
              listadoCiiuResolucion.push(encontrado.vrValorParametro);
            }
          });
        }
        res(listadoCiiuResolucion);
      }, error => rej(['Error']));
    });
  }
}
