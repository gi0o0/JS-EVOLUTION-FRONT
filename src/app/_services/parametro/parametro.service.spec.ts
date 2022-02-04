import { TestBed, getTestBed } from '@angular/core/testing';
import { ParametroService } from './parametro.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { Parametro } from '../../_interfaces/Parametro';
import { ParametroCalculadoraDireccion } from 'src/app/_interfaces/ParametroCalculadoraDireccion';

describe('Pruebas - ParametroService', () => {
  // Simular solicitudes

  let injector: TestBed;
  let httpMock: HttpTestingController;
  const  baseUrl: string = environment.url_host_pub;
  let service: ParametroService;
  const CANTIDAD_TIPO_DOCUMENTO = 2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    // Tener acceso a la variables limpias antes de cada it
    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    service = TestBed.get(ParametroService);
  });

  afterEach(() => {
    // Verificar que exista solicitudes pendientes.
    httpMock.verify();
  });

  it('Creacion de servicio ', () => {
    expect(service).toBeTruthy();
  });

  it('Obtener informacion de parametros', () => {
    const responseMock: Parametro = {
        txtDescripcion: 'Url consumo Olvido clave',
        vrValorParametro: 'https://linea.ccb.org.co/clavevirtual/portalconsulta/OlvidoClave.aspx'
    };

    service.obtenerParametro('4').subscribe( response => {
      expect(response.vrValorParametro).toBeDefined();
      expect(response.txtDescripcion).toBeDefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/parametro/4`);
    expect(req.request.method).toBe('GET');
    req.flush(responseMock);
  });

  it('Obtener informacion calculadora direcciones', () => {
    const responseMock: ParametroCalculadoraDireccion = {
        nomenclatura: [
            {
                txtDescripcion: 'Avenida Calle',
                vrValorParametro: 'Avenida Calle'
            }
        ],
        letras: [
            {
                txtDescripcion: 'A',
                vrValorParametro: 'A'
            },
            {
                txtDescripcion: 'B',
                vrValorParametro: 'B'
            }
        ],
        cardinalidad: [
            {
                txtDescripcion: 'Este',
                vrValorParametro: 'Este'
            }
        ],
        adicional: [
            {
                txtDescripcion: 'ADELANTE',
                vrValorParametro: 'ADELANTE'
            }
        ],
        vias: [
            {
                txtDescripcion: 'BIS',
                vrValorParametro: 'BIS'
            }
        ]
    };

    service.obtenerParametroCalculadoraDireccion().subscribe( response => {
      expect(response.nomenclatura).toBeDefined();
      expect(response.letras).toBeDefined();
      expect(response.cardinalidad).toBeDefined();
      expect(response.adicional).toBeDefined();
      expect(response.vias).toBeDefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/parametro/calculadora-direccion`);
    expect(req.request.method).toBe('GET');
    req.flush(responseMock);

  });

  it('Obtener informacion uso de suelo', () => {
    const ID = 188;
    const responseMock: any[] = [
      {
          txtDescripcion: 'USO_SUELOS',
          vrValorParametro: '5619'
      },
      {
          txtDescripcion: 'USO_SUELOS',
          vrValorParametro: '5630'
      }
  ];

    service.obtenerListaParametro(ID).subscribe( response => {
      expect(response.length === 2).toBeTruthy();
      expect(response[0].txtDescripcion).toBe('USO_SUELOS');
      expect(response[0].vrValorParametro).toBe('5619');
    });

    const req = httpMock.expectOne(`${baseUrl}/parametro/${ID}/lista`);
    expect(req.request.method).toBe('GET');
    req.flush(responseMock);

  });
});
