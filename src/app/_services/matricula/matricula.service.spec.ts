import { TestBed, getTestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MatriculaService } from './matricula.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { ID_CODIGO_ALERTA_SIPREF_NO_MUTACION } from '../../_shared/constantes';
import { ActividadEconomicaDTO } from 'src/app/_model/ActividadEconomicaDTO';

describe('Pruebas - MatriculaService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const baseUrl: string = environment.url_host;
  let service: MatriculaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
    });

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    service = TestBed.get(MatriculaService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Creacion de servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Obtener el Listado de matriculas', () => {
    const listadoMatriculas = [
      {
        numeroMatriculaMercantil: '02050456',
        nombreRazonSocial: 'CARMEN JUANILLO',
        idTipoOrganizacionJuridica: '2901',
        tipoOrganizacionJuridica: 'PERSONA NATURAL',
        direccionComercial: 'CLL 152 PRUEBA # 115',
      },
      {
        numeroMatriculaMercantil: '02050476',
        nombreRazonSocial: 'CARMEN JUANILLO',
        idTipoOrganizacionJuridica: '2901',
        tipoOrganizacionJuridica: 'PERSONA NATURAL',
        direccionComercial: 'CLL 152 PRUEBA # 115',
      },
    ];

    service.obtenerListadoMatriculas().subscribe((response: any) => {
      expect(response.length).toBe(2);
      expect(response[0].numeroMatriculaMercantil).toBeDefined();
      expect(response[0].nombreRazonSocial).toBeDefined();
      expect(response[0].idTipoOrganizacionJuridica).toBeDefined();
      expect(response[0].tipoOrganizacionJuridica).toBeDefined();
      expect(response[0].direccionComercial).toBeDefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/matricula`);
    expect(req.request.method).toBe('POST');
    req.flush(listadoMatriculas);
  });

  it('Obtener el Detalle de la matricula', () => {
    const listadoMatriculas = {
      nombreRazonSocial: 'ESTRADA OVIEDO FABIO',
      numeroMatriculaMercantil: '00002435',
      idTipoOrganizacionJuridica: '2901',
      tipoOrganizacionJuridica: 'PERSONA NATURAL',
      direccionComercial: 'CLL 152 PRUEBA # 115',
      representanteLegalRevisorFiscal: 'ESTRADA OVIEDO FABIO',
      idTipoIdentificacion: '1',
      tipoIdentificacion: 'CEDULA DE CIUDADANIA',
      numeroIdentificacion: '000000000000001',
      idCategoria: '250',
      categoria: 'N/A',
      activa: true,
      inactivoDetalle: {
        codigoRespuesta: 0,
        mensajeRespuesta: ''
      }
    };

    service.obtenerDetalleMatricula('00002435').subscribe((response: any) => {
      expect(response.nombreRazonSocial).toBeDefined();
      expect(response.numeroMatriculaMercantil).toBeDefined();
      expect(response.idTipoOrganizacionJuridica).toBeDefined();
      expect(response.tipoOrganizacionJuridica).toBeDefined();
      expect(response.direccionComercial).toBeDefined();
      expect(response.representanteLegalRevisorFiscal).toBeDefined();
      expect(response.idTipoIdentificacion).toBeDefined();
      expect(response.tipoIdentificacion).toBeDefined();
      expect(response.idCategoria).toBeDefined();
      expect(response.categoria).toBeDefined();
      expect(response.activa).toBeDefined();
      expect(response.inactivoDetalle).toBeDefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/matricula/00002435`);
    expect(req.request.method).toBe('POST');
    req.flush(listadoMatriculas);
  });

  it('Generacion Alerta Sipref', () => {
    const numMatricula = '01706395';
    const numCliente = 2811227;

    let mock: any = {};

    service.generarAlertaSipref(numMatricula, numCliente, ID_CODIGO_ALERTA_SIPREF_NO_MUTACION);

    //Validamos la url de nuestra API
    const req = httpMock.expectOne(baseUrl + `/alerta/${numMatricula}/${numCliente}/tipo/${ID_CODIGO_ALERTA_SIPREF_NO_MUTACION}`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });


  it('Validar codigo de mensaje de la respuesta de matriculas inactivas.', () => {
    const listadoMatriculas = {
      nombreRazonSocial: 'ESTRADA OVIEDO FABIO',
      numeroMatriculaMercantil: '00002435',
      idTipoOrganizacionJuridica: '2901',
      tipoOrganizacionJuridica: 'PERSONA NATURAL',
      direccionComercial: 'CLL 152 PRUEBA # 115',
      representanteLegalRevisorFiscal: 'ESTRADA OVIEDO FABIO',
      idTipoIdentificacion: '1',
      tipoIdentificacion: 'CEDULA DE CIUDADANIA',
      numeroIdentificacion: '000000000000001',
      idCategoria: '250',
      categoria: 'N/A',
      activa: true,
      inactivoDetalle: {
        codigoRespuesta: 0,
        mensajeRespuesta: ''
      }
    };

    service.obtenerDetalleMatricula('00002435').subscribe((response: any) => {
      expect(response.inactivoDetalle).toBeDefined();
      expect(response.inactivoDetalle.codigoRespuesta).toBeDefined();
      expect(response.inactivoDetalle.mensajeRespuesta).toBeDefined();
      expect(response.inactivoDetalle.mensajeRespuesta).toEqual('');
      expect(response.inactivoDetalle.codigoRespuesta).toEqual(0);

    });

    const req = httpMock.expectOne(`${baseUrl}/matricula/00002435`);
    expect(req.request.method).toBe('POST');
    req.flush(listadoMatriculas);
  });


  it('Validar codigo de mensaje de la respuesta de matriculas inactivas.', () => {
    const mensaje = 'Matrícula/Inscripción INACTIVA. NO puede realizarse ninguna actualización ' +
    '(Inscripción de documentos, mutaciones y/o renovaciones) ' +
    'hasta tanto el Representante legal o Persona Natural' +
    'se acerque personalmente a la Sede. ';
    const listadoMatriculas = {
      nombreRazonSocial: 'ESTRADA OVIEDO FABIO',
      numeroMatriculaMercantil: '00002435',
      idTipoOrganizacionJuridica: '2901',
      tipoOrganizacionJuridica: 'PERSONA NATURAL',
      direccionComercial: 'CLL 152 PRUEBA # 115',
      representanteLegalRevisorFiscal: 'ESTRADA OVIEDO FABIO',
      idTipoIdentificacion: '1',
      tipoIdentificacion: 'CEDULA DE CIUDADANIA',
      numeroIdentificacion: '000000000000001',
      idCategoria: '250',
      categoria: 'N/A',
      activa: true,
      inactivoDetalle: {
        codigoRespuesta: 1,
        mensajeRespuesta: mensaje
      }
    };

    service.obtenerDetalleMatricula('00002435').subscribe((response: any) => {
      expect(response.inactivoDetalle).toBeDefined();
      expect(response.inactivoDetalle.codigoRespuesta).toBeDefined();
      expect(response.inactivoDetalle.mensajeRespuesta).toBeDefined();
      expect(response.inactivoDetalle.mensajeRespuesta).toEqual(mensaje);
      expect(response.inactivoDetalle.codigoRespuesta).toEqual(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/matricula/00002435`);
    expect(req.request.method).toBe('POST');
    req.flush(listadoMatriculas);
  });


  it('Obtener el Listado de actividades economicas de la matricula', () => {
    const numMatricula = '01706395';
    const listadoMatriculas: ActividadEconomicaDTO = {
        descripcionCliente: 'ACTIVIDADES DE AGENCIA DE EMPLEO TEMPORAL',
        ciius: [
            {
                fechaRegistro: '2018-04-19',
                descripcionActividad: 'ACTIVIDADES DE EMPRESAS DE SERVICIOS TEMPORALES',
                item: 1,
                ciiu: '7820',
                shd: 'null',
                mayorIngreso: 0
            },
            {
                fechaRegistro: '2018-04-19',
                descripcionActividad: 'ACTIVIDADES DE EMPRESAS DE SERVICIOS TEMPORALES',
                item: 2,
                ciiu: '7820',
                shd: 'null',
                mayorIngreso: 0
            }
        ]
    };

    service.obtenerListadoCiuus(numMatricula).subscribe((response: ActividadEconomicaDTO) => {
      expect(response.descripcionCliente).toBeDefined();
      expect(response.ciius).toBeDefined();
      expect(response.ciius.length).toBeGreaterThan(0);
      expect(response.ciius[0].ciiu).toBeDefined();
      expect(response.ciius[0].descripcionActividad).toBeDefined();
      expect(response.ciius[0].fechaRegistro).toBeDefined();
      expect(response.ciius[0].item).toBeDefined();
      expect(response.ciius[0].mayorIngreso).toBeDefined();
      expect(response.ciius[0].shd).toBeDefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/actividad-economica/${numMatricula}/ciiu`);
    expect(req.request.method).toBe('GET');
    req.flush(listadoMatriculas);
  });

});
