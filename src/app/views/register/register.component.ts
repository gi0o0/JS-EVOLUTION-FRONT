import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../_services/util/util.service';
import { SeguridadService } from '../../_services/seguridad/seguridad.service';
import { Register } from '../../_interfaces/Register';
import {
  FALLA_RESPUESTA_MALA, ERROR_NO_CONTROLADO, FALLA_NO_AUTORIZADO, EXP_REGULAR_NUMERO_CAMPO
} from '../../_shared/constantes';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {

  public forma: FormGroup;
  opcionEmail: boolean = false;
  opcionUserName: boolean = true;
  public mensajesErrores: string[];
  public mensajes: string[];
  public errorServicio: boolean;
  public okServicio: boolean;
  public submitted: boolean;
  public credendiales: Register;
  public cargando: boolean;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private securityService: SeguridadService) {

    this.iniciarVariables();
    this.crearFormulario();
  }

  ngOnInit() {

  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      usuario: ['', [Validators.required,
      Validators.pattern(EXP_REGULAR_NUMERO_CAMPO), Validators.maxLength(12)]],
      email: ['',],
    });
  }


  iniciarVariables = () => {
    this.errorServicio = false;
    this.okServicio = false;
    this.submitted = false;
    this.cargando = false;
  }

  register = () => {

    this.mensajesErrores = [];
    this.mensajes = [];
    this.errorServicio = false;
    this.okServicio = false;
    this.credendiales = this.forma.value;
    if (!this.validarErroresCampos()) {
      this.cargando = true;
      this.securityService.register(this.credendiales).subscribe((response: any) => {
        this.cargando = false;
        this.okServicio = true;
        this.mensajes.push(response.body);

      }, error => {

        const errorLog = this.esObjetoJson(error.error.mensaje) ? JSON.parse(error.error.mensaje) : error.mensaje;

        if (error.status == FALLA_RESPUESTA_MALA) {
          this.mensajesErrores.push(error.error.mensaje);
          this.opcionEmail = false;
        } else if (error.status == FALLA_NO_AUTORIZADO) {
          this.opcionEmail = true;
          this.mensajesErrores.push(error.error.mensaje);
        } else {
          this.opcionEmail = false;
          this.mensajesErrores.push(ERROR_NO_CONTROLADO);
        }
        this.cambioEstadoError();
      });
    }

  }

  cambioEstadoError = () => {
    this.submitted = true;
    this.errorServicio = true;
    this.cargando = false;
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

  mensajeErrorServicio = () => {
    return this.submitted && (this.errorServicio);
  }

  sendLogin = () => {
    this.router.navigateByUrl('login');
  }

}
