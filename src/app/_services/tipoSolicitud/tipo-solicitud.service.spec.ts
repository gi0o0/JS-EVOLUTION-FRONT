import { TestBed, getTestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

import { TipoSolicitudService } from './tipo-solicitud.service';
import { TipoMutacionDTO } from 'src/app/_model/TipoMutacionDTO';
import { MUTACION_ACTIVIDAD_ECONOMICA, PARAMETRO_RESOLUCION_0549 } from 'src/app/_shared/constantes';


class MockRouter {
  navigate(url: string) { return url; }
}
describe('Pruebas - TipoSolicitudService', () => {
    const  baseUrl: string = environment.url_host;
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let service: TipoSolicitudService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterModule.forRoot([])
        ],
        providers: [
          { provide: Router, useClass: MockRouter }
      ]
      });

      injector = getTestBed();
      httpMock = injector.get(HttpTestingController);
      service = TestBed.get(TipoSolicitudService);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('Creacion de servicio', () => {
      expect(service).toBeTruthy();
    });

    it('Obtener el Listado de mutaciones', () => {
      const requestTipoMutacion = JSON.stringify({
        tipoOrganizacionJuridica: '2907',
        tipoSociedad: '0',
        categoria: '251'
      });
      const responseMock: TipoMutacionDTO[] = [
        {
            idTipoMutacion: 2,
            tipoMutacion: 'Actividad Economica',
            idEstado: true
        },
        {
            idTipoMutacion: 3,
            tipoMutacion: 'Direccion Comercial',
            idEstado: true
        },
        {
            idTipoMutacion: 5,
            tipoMutacion: 'Telefono Comercial',
            idEstado: true
        },
        {
            idTipoMutacion: 6,
            tipoMutacion: 'Correo Electronico Comercial',
            idEstado: true
        }
      ];
      service.obtenerTipoMutacion(requestTipoMutacion).subscribe( (response: any) => {
        expect(response.length).toBe(4);
        expect(response[0].idTipoMutacion).toBeDefined();
        expect(response[0].idTipoMutacion).not.toBe(4);
      });

      const req = httpMock.expectOne(`${baseUrl}/mutacion`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
    });


    it('Obtener homonimia', () => {
      const valor = 'BANCOLOMBIA';
      const hominimia = [
        {
          codigoCamara: '30',
          descripcionCamara: 'LA GUAJIRA',
          numMatricula: '0000101753',
          nombre: 'BANCOLOMBIA MAICAO',
          idOrganizacion: '04',
          desOrganizacion: 'SOCIEDAD ANONIMA',
          idEstado: '01',
          desEstado: 'ACTIVA',
          idCategoria: '251',
          desCategoria: 'Principal'
        }
      ];

      service.validarHomonimia(valor).subscribe( nombre => {
          expect(nombre.length).toBe(1);
          expect(nombre[0]['numMatricula']).toBeDefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/mutacion/${valor}/homonimia`);
      expect(req.request.method).toBe('GET');
      req.flush(hominimia);
    });

    it('Obtener no homonimia', () => {
      const valor = 'BANCOLOMBIA';
      const hominimia = [];

      service.validarHomonimia(valor).subscribe( nombre => {
          expect(nombre.length).toBe(0);
      });

      const req = httpMock.expectOne(`${baseUrl}/mutacion/${valor}/homonimia`);
      expect(req.request.method).toBe('GET');
      req.flush(hominimia);
    });


    it('Obtener datos de direcciones', () => {
      const numeroMatricula = '02295323';
      const responseDireccionMock = [
        {
            idTipoDireccion: '162',
            descripcionTipoDireccion: 'Dirección de Notificación Judici',
            direccion: 'CL 72 B NO. 90 A 06',
            idPais: null,
            descripcionPais: 'COLOMBIA',
            idDepartamento: '1111',
            descripcionDepartamento: 'CUNDINAMARCA',
            idMunicipio: '11001',
            descripcionMunicipio: 'BOGOTÁ D.C.',
            barrioTextual: 'LOS CAMPOS',
            telefono1: '5555555',
            telefono2: '5555555',
            telefono3: null,
            email: 'pruebasgestionticccb@gmail.com',
            codigoPostal: null,
            idTipoSedeAdministrativa: null,
            descripcionSede: null,
            idUbicacion: null,
            descripcionUbicacion: null,
            idZona: null,
            descripcionZona: 'Urbana'
        },
        {
            idTipoDireccion: '161',
            descripcionTipoDireccion: 'Dirección Comercial',
            direccion: 'CL 72 B NO. 90 A 06',
            idPais: null,
            descripcionPais: 'COLOMBIA',
            idDepartamento: '1111',
            descripcionDepartamento: 'CUNDINAMARCA',
            idMunicipio: '11001',
            descripcionMunicipio: 'BOGOTÁ D.C.',
            barrioTextual: 'LOS CAMPOS',
            telefono1: '5555555',
            telefono2: '5555555',
            telefono3: null,
            email: 'pruebasgestionticccb@gmail.com',
            codigoPostal: '000919',
            idTipoSedeAdministrativa: null,
            descripcionSede: null,
            idUbicacion: null,
            descripcionUbicacion: null,
            idZona: null,
            descripcionZona: 'Urbana'
        }
      ];

      service.obtenerInformacionCambioDireccionComercialJudicial(numeroMatricula).subscribe( response => {
        expect(response.length).toBe(2);
        expect(response[0].idTipoDireccion).toBe('162');
        expect(response[1].idTipoDireccion).toBe('161');
      });
      const req = httpMock.expectOne(`${baseUrl}/matricula/${numeroMatricula}/direcciones`);
      expect(req.request.method).toBe('GET');
      req.flush(responseDireccionMock);
    });

    it('Obtener datos de direcciones con objeto nulo', () => {
      const numeroMatricula = '02295323';
      const responseDireccionMock = [
        {
            idTipoDireccion: '162',
            descripcionTipoDireccion: 'Dirección de Notificación Judici',
            direccion: 'CL 72 B NO. 90 A 06',
            idPais: null,
            descripcionPais: 'COLOMBIA',
            idDepartamento: '1111',
            descripcionDepartamento: 'CUNDINAMARCA',
            idMunicipio: '11001',
            descripcionMunicipio: 'BOGOTÁ D.C.',
            barrioTextual: 'LOS CAMPOS',
            telefono1: '5555555',
            telefono2: '5555555',
            telefono3: null,
            email: 'pruebasgestionticccb@gmail.com',
            codigoPostal: null,
            idTipoSedeAdministrativa: null,
            descripcionSede: null,
            idUbicacion: null,
            descripcionUbicacion: null,
            idZona: null,
            descripcionZona: 'Urbana'
        },
        null
      ];

      service.obtenerInformacionCambioDireccionComercialJudicial(numeroMatricula).subscribe( response => {
        expect(response.length).toBe(2);
        expect(response[0].idTipoDireccion).toBeDefined();
        expect(response[1]).toBeNull();
      });
      const req = httpMock.expectOne(`${baseUrl}/matricula/${numeroMatricula}/direcciones`);
      expect(req.request.method).toBe('GET');
      req.flush(responseDireccionMock);
    });

    it('Obtener los municipios', () => {
      const responseMunicipioMock = {
        listaComercial: [
            {
                idMunicipio: '11001',
                municipio: 'BOGOTÁ D.C.',
                idDepartamento: '11',
                departamento: 'CUNDINAMARCA'
            },
            {
                idMunicipio: '25053',
                municipio: 'ARBELÁEZ (CUNDINAMARCA)',
                idDepartamento: '25',
                departamento: 'CUNDINAMARCA'
            },
            {
                idMunicipio: '25120',
                municipio: 'CABRERA (CUNDINAMARCA)',
                idDepartamento: '25',
                departamento: 'CUNDINAMARCA'
            }
        ],
        listaJudicial: [
            {
                idMunicipio: '00001',
                municipio: '(FUERA DEL PAÍS)',
                idDepartamento: '00',
                departamento: 'FUERA DEL PAIS'
            },
            {
                idMunicipio: '05001',
                municipio: 'MEDELLÍN (ANTIOQUIA)',
                idDepartamento: '05',
                departamento: 'ANTIOQUIA'
            },
            {
                idMunicipio: '25281',
                municipio: 'FOSCA (CUNDINAMARCA)',
                idDepartamento: '25',
                departamento: 'CUNDINAMARCA'
            },
            {
                idMunicipio: '99624',
                municipio: 'SANTA ROSALIA (VICHADA)',
                idDepartamento: '99',
                departamento: 'VICHADA'
            }
        ]
      };

      service.obtenerListadoMunicipio().subscribe( response => {
        expect(response['listaComercial']).toBeDefined();
        expect(response['listaComercial'][0].idMunicipio).toBeDefined();
        expect(response['listaComercial'][0].municipio).toBeDefined();
        expect(response['listaComercial'][0].idDepartamento).toBeDefined();
        expect(response['listaComercial'][0].departamento).toBeDefined();

        expect(response['listaJudicial']).toBeDefined();
        expect(response['listaJudicial'][0].idMunicipio).toBeDefined();
        expect(response['listaJudicial'][0].municipio).toBeDefined();
        expect(response['listaJudicial'][0].idDepartamento).toBeDefined();
        expect(response['listaJudicial'][0].departamento).toBeDefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/municipio`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMunicipioMock);
    });

    it('Guardando mutaciones ', () => {
      const response  = {
        status: 201
      };

      const request = {
        mutacion: [
         {idTipoMutacion: 3, valor: 'CL 72 B NO. 90 A 07'},
         {idTipoMutacion: 13, valor: '5555556'},
         {idTipoMutacion: 14, valor: '5555556'},
         {idTipoMutacion: 25, valor: '0'}
        ],
        numCliente: 986674,
        numMatricula: '02295323'
      };

      service.guardar(request).subscribe( (res: any) => {
        expect(res.body.status).toBe(201);
      });

      const req = httpMock.expectOne(`${baseUrl}/mutacion/registro`);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });


    it('Obtener actividad economica', () => {
      const requestCodigo = '4791';
      const responseMock = [
        {
            idCiiu: '4791',
            descripcion: 'COMERCIO AL POR MENOR REALIZADO A TRAVÉS DE INTERNET',
            notaExplicativa: 'En las ventas al por menor en esta clase, el comprador elige su opción basado en información',
            ctrSHD: true,
            codigosSHD: [
                {
                    idSHD: 1,
                    nombreSHD: 'COMERCIO AL POR MENOR DE ALIMENTOS Y PRODUCTOS AGRÍCOLAS EN BRUTO; VENTA DE TEXTOS ESCOLARES Y LIBROS (INCLUYE CUADERNOS ESCOLARES)'
                },
                {
                    idSHD: 2,
                    nombreSHD: 'COMERCIO AL POR MENOR Y AL POR MAYOR DE MADERA Y MATERIALES PARA CONSTRUCCIÓN; VENTA DE AUTOMOTORES (INCLUIDAS MOTOCICLETAS) REALIZADO A TRAVÉS DE INTERNET'
                },
                {
                    idSHD: 3,
                    nombreSHD: 'COMERCIO AL POR MENOR DE CIGARRILLOS Y LICORES; VENTA DE COMBUSTIBLES DERIVADOS DEL PETRÓLEO Y VENTA DE JOYAS REALIZADO A TRAVÉS DE INTERNET'
                },
                {
                    idSHD: 4,
                    nombreSHD: 'COMERCIO AL POR MENOR DE DEMÁS PRODUCTOS N.C.P.  REALIZADO A TRAVÉS DE INTERNET'
                }
            ]
        }
      ];

      service.obtenerActividadesEconomicasPorCriterio(requestCodigo).subscribe( (res) => {
        expect(res[0].idCiiu).toBe(requestCodigo);
        expect(res[0].idCiiu).toBeDefined();
        expect(res[0].descripcion).toBeDefined();
        expect(res[0].notaExplicativa).toBeDefined();
        expect(res[0].ctrSHD).toBeDefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/actividad-economica/consulta/${requestCodigo}`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMock);
    });


    it('Obtener informacion pdf', () => {
      const valor = 'BANCOLOMBIA';
      const informacionArchivo = {
        numMatricula: '02417415',
        numCliente: 8967921,
        tipoDocumento: 1,
        numeroDocumento: 43743102,
        nombreSolicitante: 'SIERRA URIBE MARIA ALEJANDRA'
      };

      const blob = new Blob([''], { type: 'application/pdf' });
      blob['lastModifiedDate'] = '';
      blob['name'] = 'prueba.pdf';

      service.generarPDFResumen(informacionArchivo).subscribe( archivo => {
        expect(archivo.name).toBeDefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/mutacion/archivo`);
      expect(req.request.method).toBe('POST');
      req.flush(blob);
    });

    it('servicio de pagos ', () => {
      const response  = {
        numeroOrden: '0012003036',
        errorId: '0',
        mensaje: 'Operación exitosa'
    };

      const request={
        detalle:'<ArrayOfDetalleLiquidacionDto xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><DetalleLiquidacionDto><ActoId>0745</ActoId><Cantidad>1</Cantidad><GastoAdministrativo>370</GastoAdministrativo><Item>1</Item><ItemPadre>1</ItemPadre><LibroId>15</LibroId><Matricula>02509750</Matricula><Servicio>MUTACIONES PERSONAS NATURALES Y SOCIEDADES COMERCIALES</Servicio><ServicioId>01031517</ServicioId><ServicioPadreId>01031517</ServicioPadreId><ValorTotal>12100</ValorTotal><ValorBase>0</ValorBase></DetalleLiquidacionDto></ArrayOfDetalleLiquidacionDto>',
        moneda:'10001',
        valorTotal:12100,
        numCliente: 4256255,
        numMatricula: '02509750'
      };

      service.pagar(request).subscribe( (res: any) => {
        expect(res.errorId).toEqual(response.errorId);
      });

      const req = httpMock.expectOne(`${baseUrl}/pago`);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });

    it('servicio de obtenerPreliquidacion ', () => {
      const response  = {
        detalle:"<ArrayOfDetalleLiquidacionDto xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><DetalleLiquidacionDto><ActoId>0745</ActoId><Cantidad>1</Cantidad><GastoAdministrativo>370</GastoAdministrativo><Item>1</Item><ItemPadre>1</ItemPadre><LibroId>15</LibroId><Matricula>02509750</Matricula><Servicio>MUTACIONES PERSONAS NATURALES Y SOCIEDADES COMERCIALES</Servicio><ServicioId>01031517</ServicioId><ServicioPadreId>01031517</ServicioPadreId><ValorTotal>12100</ValorTotal><ValorBase>0</ValorBase></DetalleLiquidacionDto></ArrayOfDetalleLiquidacionDto>",
        moneda: '10001',
        valorTotal: 12100,
        liquidaciones: []
      };

      const request = {
        numCliente: 4256255,
        numMatricula: '02509750'
      };

      service.obtenerPreliquidacion(request).subscribe( (res: any) => {
        expect(res.valorTotal).toEqual(response.valorTotal);
      });

      const req = httpMock.expectOne(`${baseUrl}/pago/liquidador`);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });

    it('servicio de profesiones liberales ', () => {
      const response  = {
        estado: {
            codigoRespuesta: 0,
            mensajeRespuesta: 'Operación exitosa'
        },
        codigos: [
            {
                codigo: '7110',
                descripcion: null,
                validoDIAN: 0,
                validoSH: null,
                item: 1,
                codigoSHD: null,
                ctrProfLiberales: 0,
                posiblesValoresSH: null
            }
        ],
        mensajeAlerta: null,
        ctrProfLiberales: null,
        ctrBloqueo: null,
        codigoError: '0000',
        mensajeError: 'Mensaje Exitoso',
        mensajeBloqueo: null
    };

      const request = {
        matricula: '02509755',
        codigos: [{
          idCiiu: '7110',
          ctrNivel: 4
        }]
      };

      service.profesionesLiberales(request).subscribe( (res: any) => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/actividad-economica/validar/profesiones-liberales`);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });


    it('validacion de promesa de servicio ciius', () => {
      const response  = [
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
      ];

      const promise = service.validarCiiuEnResolucion(response);
      expect(promise.then).toBeDefined();

      const req = httpMock.expectOne(`${baseUrl}/parametro/${PARAMETRO_RESOLUCION_0549}/lista`);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });


    it('servicio de consulta de mutaciones ', () => {
      const numeroCliente = 986674;
      const numeroMatricula = '02295323';

      const response = {
        direccionMutacion: [],
        ciiuMutacion: [
            {
                descripcionCliente: null,
                ciius: [
                    {
                        fechaRegistro: '2021-03-05',
                        descripcionActividad: 'CONSTRUCCIÓN DE EDIFICIOS RESIDENCIALES',
                        item: 1,
                        ciiu: '4111',
                        shd: null,
                        mayorIngreso: 1,
                        crud: 2
                    }
                ]
            }
        ],
        nombreMutacion: null
      };

      service.consultarMutaciones(numeroCliente, numeroMatricula).subscribe( res => {
        expect(res.nombreMutacion).toBeDefined();
        expect(res.direccionMutacion).toBeDefined();
        expect(res.ciiuMutacion).toBeDefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/mutacion/${numeroCliente}/matricula/${numeroMatricula}`);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });

    it('servicio eliminar pdf', () => {
      const numeroCliente = 986674;
      const numeroMatricula = '02295323';

      const response = {
        codigoRespuesta: 0
      };

      service.eliminarPDFresumen(numeroCliente, numeroMatricula).subscribe( res => {
        expect(res.codigoRespuesta).toBeDefined();
        expect(res.codigoRespuesta).toEqual(0);
      });

      const req = httpMock.expectOne(`${baseUrl}/pago/${numeroCliente}/eliminar-documento/${numeroMatricula}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(response);
    });

    it('servicio eliminar mutaciones', () => {
      const numeroCliente = 986674;
      const numeroMatricula = '02295323';

      const requestEliminar = {
        numCliente : 986674,
        numMatricula : '02295323',
        idTipoMutacion : MUTACION_ACTIVIDAD_ECONOMICA
      };

      const response = {
        codigoRespuesta: 0,
        mensajeRespuesta: 'Operación exitosa'
      };

      service.eliminarMutaciones(requestEliminar).subscribe( res => {
        expect(response.codigoRespuesta).toBeDefined();
        expect(response.mensajeRespuesta).toBeDefined();
        expect(response.codigoRespuesta).toEqual(0);
        expect(response.mensajeRespuesta).toEqual('Operación exitosa');

      });

      const req = httpMock.expectOne(`${baseUrl}/mutacion/eliminar`);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });

});
