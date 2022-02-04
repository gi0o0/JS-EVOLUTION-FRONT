import { TestBed, getTestBed } from '@angular/core/testing';
import { UtilService } from './util.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormControl } from '@angular/forms';

describe('Pruebas - UtilService', () => {

  let injector: TestBed;
  let httpMock: HttpTestingController;
  let service: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    injector = getTestBed();
    httpMock = injector.get(HttpTestingController);
    service = TestBed.get(UtilService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Creacion de servicio ', () => {
    expect(service).toBeTruthy();
  });

  it('Generacion de encriptacion', () => {
    const AUTH = 'da#SE_08AS';
    const CODIGO = service.codificarBase64(AUTH);
    expect(AUTH).not.toEqual(CODIGO);
  });

  it('Generacion de des-encriptacion', () => {
    const AUTH = 'da#SE_08AS';
    const CODIGO = service.codificarBase64(AUTH);
    expect(AUTH).toEqual(service.decodificarBase64(CODIGO));
  });

  it('Validacion de telefono por menos de 7', () => {
    const form = new FormControl();
    form.setValue('2222');
    const resultado = service.validarTelefonos(form);
    expect(resultado.validarTelefonos).toBeTruthy();
  });

  it('Validacion de telefono por mas de 10', () => {
    const form = new FormControl();
    form.setValue('2222222222222');
    const resultado = service.validarTelefonos(form);
    expect(resultado.validarTelefonos).toBeTruthy();
  });

  it('Validacion de telefono 7 o 10', () => {
    const form = new FormControl();

    form.setValue('3120000');
    let resultado = service.validarTelefonos(form);
    expect(resultado).toBeNull();

    form.setValue('3125673456');
    resultado = service.validarTelefonos(form);
    expect(resultado).toBeNull();
  });

  it('Validacion de tipo de documento cedula de ciudadania caso fallo 1', () => {
    const form = new FormControl();
    form.setValue('111111111');
    const resultado = service.validarNumeroIdentificacion(form);
    expect(resultado.validarNumeroIdenficacion).toBeTruthy();
  });

  it('Validacion de tipo de documento cedula de ciudadania caso fallo 2', () => {
    const form = new FormControl();
    form.setValue('200000000000');
    const resultado = service.validarNumeroIdentificacion(form);
    expect(resultado.validarNumeroIdenficacion).toBeTruthy();
  });

  it('Validacion de tipo de documento cedula de ciudadania caso correcto', () => {
    const form = new FormControl();
    form.setValue('1145940603');
    const resultado = service.validarNumeroIdentificacion(form);
    expect(resultado).toBeNull();
  });

  it('Validacion de formato de fechas caso correcto', () => {
    const fecha = new Date('2020-11-25T00:00:00');
    const simbolo = '-';
    const resultado = service.formatoFechas(fecha,simbolo);    
    expect(resultado).toEqual('2020-11-25');
  });

});
