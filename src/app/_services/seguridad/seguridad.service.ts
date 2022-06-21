import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Login } from '../../_interfaces/Login';
import { Register } from '../../_interfaces/Register';
import { RegisterByToken } from '../../_interfaces/RegisterByToken';

import { environment } from '../../../environments/environment';
import { ResponseToken } from '../../_interfaces/ResponseToken';
import { UtilService } from '../util/util.service';
import { CookieService } from 'ngx-cookie-service';
import {
  ACCESO_TOKEN_NOMBRE
} from '../../_shared/constantes';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private baseUrl: string = environment.url_host;

  constructor(private http: HttpClient,
    private router: Router,
    private utilService: UtilService, private cookieService: CookieService) { }

  login(login: Login) {
    const requestToken = {
      login: login.numeroDocumento,
      password: login.claveVirtual
    };

    return this.http.post(`${this.baseUrl}/auth/signin`, requestToken, { withCredentials: true });
  }

  logOut() {
    return this.http.post(`${this.baseUrl}/auth/signout`, '', { withCredentials: true });
  }

  refresh() {
    return this.http.post(`${this.baseUrl}/security/signalrefresh`, '', { withCredentials: true });
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

    this.logOut().subscribe((response: any) => {
      

    }, error => {
      console.log(error);

    });

    alert("Cerrando Sesión");
    this.router.navigateByUrl('/login');
      sessionStorage.clear();
  }

  
  refreshSesion() {

    this.refresh().subscribe((response: any) => {}, error => {
      console.log(error);
    });

  }

 

}
