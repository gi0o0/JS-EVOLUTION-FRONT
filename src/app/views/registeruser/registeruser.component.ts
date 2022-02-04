import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeguridadService } from '../../_services/seguridad/seguridad.service';
import { RegisterByToken } from '../../_interfaces/RegisterByToken';
import {
  FALLA_RESPUESTA_MALA, ERROR_NO_CONTROLADO, FALLA_NO_ENCONTRADO, ERROR_NO_CONTROLADO_CLAVE_NO_COINCIDE
} from '../../_shared/constantes';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'registeruser.component.html'
})
export class RegisterUserComponent implements OnInit {

  public forma: FormGroup;
  public mensajesErrores: string[];
  public mensajes: string[];
  public errorServicio: boolean;
  public okServicio: boolean;
  public submitted: boolean;
  public credendiales: RegisterByToken;
  public cargando: boolean;
  token: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private securityService: SeguridadService) {

    this.iniciarVariables();
    this.crearFormulario();
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.token = params.token;
      }
      );

  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({

      claveVirtual: ['', Validators.required],
      claveVirtualR: ['', Validators.required],
    });
  }


  iniciarVariables = () => {
    this.errorServicio = false;
    this.okServicio = false;
    this.submitted = false;
    this.cargando = false;
  }

  registerByToken = () => {

    this.mensajesErrores = [];
    this.mensajes = [];
    this.errorServicio = false;
    this.okServicio = false;

    if (!this.validarErroresCampos()) {

      this.credendiales = { password: this.forma.value.claveVirtual, token: this.token };

      this.cargando = true;
      this.securityService.registerByToken(this.credendiales).subscribe((response: any) => {
        this.cargando = false;
        this.okServicio = true;
        this.mensajes.push(response.body);

      }, error => {

        const errorLog = this.esObjetoJson(error.error.mensaje) ? JSON.parse(error.error.mensaje) : error.mensaje;

        if (error.status == FALLA_RESPUESTA_MALA) {
          this.mensajesErrores.push(error.error.mensaje);
        } else if (error.status == FALLA_NO_ENCONTRADO) {
          this.mensajesErrores.push(error.error.mensaje);
        } else {
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

    if (!this.matchOtherValidator()) {
      return true;
    }

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

  campoNoValidoRepeatPass = (campoValidacion: string) => {
    return this.forma.get(campoValidacion).invalid && (this.forma.get(campoValidacion).touched || this.forma.get(campoValidacion).dirty);
  }

  matchOtherValidator = () => {

    if (this.forma.value.claveVirtual != this.forma.value.claveVirtualR) {
      this.mensajesErrores.push(ERROR_NO_CONTROLADO_CLAVE_NO_COINCIDE);
      this.cambioEstadoError();
      return false;
    }
    return true;
  }


  mensajeErrorServicio = () => {
    return this.submitted && (this.errorServicio);
  }

  sendLogin = () => {
    this.router.navigateByUrl('login');
  }

}
