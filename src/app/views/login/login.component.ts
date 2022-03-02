import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SeguridadService } from '../../_services/seguridad/seguridad.service';

import { Login } from '../../_interfaces/Login';
import { ResponseToken } from '../../_interfaces/ResponseToken';

import { UtilService } from '../../_services/util/util.service';
import {
  FALLA_RESPUESTA_MALA, ERROR_NO_CONTROLADO,
  EXP_REGULAR_NUMERO_CAMPO,FALLA_NO_ENCONTRADO,FUNCIONALIDADES
} from '../../_shared/constantes';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{


  public forma: FormGroup;
  public titulo: string;
  public credendiales: Login;
  public captchaValidation: boolean;
  public errorServicio: boolean;
  public cargando: boolean;
  public keyCaptcha: string;
  public urlOlvidoContrasena: string;
  public urlTerminosCondiciones: string;
  public urlSolicitudClave: string;
  public mensajesErrores: string[];
  public submitted: boolean;
  public contrasenia: boolean;
  public ipEquipo: string;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private securityService: SeguridadService) {
      this.crearFormulario();
      this.iniciarVariables();

  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      numeroDocumento: ['', [Validators.required,
      Validators.pattern(EXP_REGULAR_NUMERO_CAMPO), Validators.maxLength(15), this.utilService.validarNumeroIdentificacion]],
      claveVirtual: ['', Validators.required],     
    });
  }

  iniciarVariables = () => {
    this.titulo = 'Bienvenido';
    this.keyCaptcha = environment.keyCaptcha;
    this.captchaValidation = false;
    this.urlOlvidoContrasena = '';
    this.urlSolicitudClave = '';
    this.urlTerminosCondiciones = '';
    this.errorServicio = false;
    this.cargando = false;
    this.submitted = false;
    this.contrasenia = false;
  }


  ngOnInit() {
    const credenciales = this.securityService.obtenerCredenciales();
    if (credenciales) {
      this.router.navigateByUrl('dashboard');
    }
  }

  validarErroresCampos = () => {
    let errorCampos = false;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      });
      errorCampos = true;
    }
    return errorCampos;
  }

  login = () => {

    this.mensajesErrores = [];
    this.errorServicio = false;

    if (!this.validarErroresCampos()) {
      this.cargando = true;
      this.credendiales = this.forma.value;
      this.credendiales.ip = this.ipEquipo;
      this.securityService.login(this.credendiales).subscribe((response: any) => {    
        console.log(response);
      this.cargando = false;
        if (response.id) {
          this.mapearCredenciales(response);
          this.submitted = false;
          this.router.navigateByUrl('dashboard');
        } else {
          this.mensajesErrores.push(ERROR_NO_CONTROLADO);
          this.cambioEstadoError();
        }
      }, error => {
        console.log(error);
        const errorLog = this.esObjetoJson(error.error.mensaje) ? JSON.parse(error.error.mensaje) : error.mensaje;

        if (error.status == FALLA_RESPUESTA_MALA) {
          this.mensajesErrores.push(error.error.mensaje);
        }else if (error.status == FALLA_NO_ENCONTRADO) {
          this.mensajesErrores.push( error.error.mensaje);
        }else {
          this.mensajesErrores.push(ERROR_NO_CONTROLADO);
        }

        this.cambioEstadoError();
      });
    }

  }


 mapearCredenciales = (response: any) => {
    const responseToken: ResponseToken = { tokenAcceso: '', numeroDocumento: '', nombre: '', funcionalidades: '' };
    responseToken.tokenAcceso = response.token;
    responseToken.numeroDocumento = response.id;
    responseToken.nombre = response.firstName;
    responseToken.funcionalidades = response.funcionalidades;

    this.securityService.guardarCredenciales(responseToken);
    sessionStorage.setItem(FUNCIONALIDADES, JSON.stringify(response.funcionalidades));
  }


  cambioEstadoError = () => {
    this.submitted = true;
    this.errorServicio = true;
    this.cargando = false;
  }

  
  esObjetoJson = (msj) => {
    try {
      JSON.parse(msj);
    } catch (e) {
      return false;
    }
    return true;
  }

  campoNoValido = (campoValidacion: string) => {
    return this.forma.get(campoValidacion).invalid && (this.forma.get(campoValidacion).touched || this.forma.get(campoValidacion).dirty);
  }

  campoValido = (campoValidacion: string) => {
    return this.forma.get(campoValidacion).valid && (this.forma.get(campoValidacion).touched || this.forma.get(campoValidacion).dirty);
  }

  
  mensajeErrorServicio = () => {
    return this.submitted && (this.errorServicio);
  }

  sendRegister = () => {
    this.router.navigateByUrl('register');
  }

  


 }
