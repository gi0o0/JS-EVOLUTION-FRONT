import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Login } from '../../_interfaces/Login';
import { Register } from '../../_interfaces/Register';
import { RegisterByToken } from '../../_interfaces/RegisterByToken';

import { environment } from '../../../environments/environment';
import { ResponseToken } from '../../_interfaces/ResponseToken';
import { UtilService } from '../util/util.service';
import {
  ACCESO_TOKEN_NOMBRE, MATRICULA_SELECCIONADA,
  NUM_CLIENTE_SELECCIONADA, NUM_CLIENTE_ESTABLECIMIENTO_SELECCIONADA,
  ACCION_ELIMINAR_TMP
} from '../../_shared/constantes';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private baseUrl: string = environment.url_host;

  constructor(private http: HttpClient,
    private router: Router,
    private utilService: UtilService) { }

  login(login: Login) {
    const requestToken = {
      usuario: login.numeroDocumento,
      password: login.claveVirtual
    };
    console.log(requestToken);
    return this.http.post(`${this.baseUrl}/auth/signin`, requestToken);
  }

  register(register: Register) {
    
    const requestToken = {
      usuario: register.usuario,
      email: register.email
    };
    return this.http.post(`${this.baseUrl}/auth/signup`, requestToken);
  }

  registerByToken(register: RegisterByToken) {
    
    const requestToken = {
      token: register.token,
      password: register.password
    };
    console.log(requestToken);
    return this.http.post(`${this.baseUrl}/auth/signup/token`, requestToken);
  }

  validarExpiracionToken(token: string): boolean {
    return true;
  }


  guardarCredenciales(responseToken: ResponseToken) {
    sessionStorage.setItem(ACCESO_TOKEN_NOMBRE,
      this.utilService.codificarBase64(JSON.stringify(responseToken)));
  }


  obtenerCredenciales() {
    const credenciales = sessionStorage.getItem(ACCESO_TOKEN_NOMBRE);
    if (credenciales) {
      return JSON.parse(
        this.utilService.decodificarBase64(credenciales));
    }

    return credenciales;
  }


  cerrarSesion() {
    this.router.navigateByUrl('/login');
    sessionStorage.clear();
  }







}
