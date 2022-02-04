import { TestBed, getTestBed } from '@angular/core/testing';
import { DocumentoService } from './documento.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipoDocumento } from 'src/app/_interfaces/TipoDocumento';
import { environment } from 'src/environments/environment';

describe('Pruebas - DocumentoService', () => {
  // Simular solicitudes

  let injector: TestBed;
  let httpMock: HttpTestingController;
  const  baseUrl: string = environment.url_host_pub;
  let service: DocumentoService;
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
    service = TestBed.get(DocumentoService);
  });

  afterEach(() => {
    // Verificar que exista solicitudes pendientes.
    httpMock.verify();
  });

  it('Creacion de servicio ', () => {
    expect(service).toBeTruthy();
  });

  it('Validando listado de documentos', () => {
    // Mock = Objeto simulando respuesta
    const tiposDocumentos: TipoDocumento[] = [
            {idTipo: '1', tipoIdentificacion: 'Cedula de ciudadania'},
            {idTipo: '2', tipoIdentificacion: 'Cedula Extranjería'}];

    service.obtenerTipoDocumentos().subscribe((listadoDocumentos) => {
        expect(listadoDocumentos.length).toBe(CANTIDAD_TIPO_DOCUMENTO);
        expect(listadoDocumentos).toEqual(tiposDocumentos);
        expect(listadoDocumentos[0].idTipo).toBeDefined();
        expect(listadoDocumentos[0].tipoIdentificacion).toBeDefined();
    });

    // Validamos la url de nuestra API
    const req = httpMock.expectOne(`${baseUrl}/documento`);
    expect(req.request.method).toBe('GET');
    req.flush(tiposDocumentos); // Facilitar valores ficticios
  });

});
