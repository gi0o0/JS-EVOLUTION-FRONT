import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SeguridadService } from '../../_services/seguridad/seguridad.service';

import {
  FALLA_RESPUESTA_MALA, ERROR_NO_CONTROLADO, FALLA_NO_ENCONTRADO
} from '../../_shared/constantes';
import { DTOWfSteps } from '../../_model/DTOWfSteps';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'checkuser.component.html'
})
export class CheckUserComponent implements OnInit {


  public mensajesErrores: string[];
  public mensajes: string[];
  public errorServicio: boolean;
  public okServicio: boolean;
  public submitted: boolean;
  public step: DTOWfSteps;
  public cargando: boolean;
  public token: string;
  public check: string;
  public color: string;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private securityService: SeguridadService) {

    this.iniciarVariables();
    this.step = new DTOWfSteps();
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.token = params.token;
      }
      );
    this.check = "Validando....";
    this.color = "#FFFDE7";
    this.registerByToken();
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

    var param = this.token.split(","); 

    this.step.token = param[0];
    this.step.idStep = "2";
    this.step.idSubStep = "2";
    this.step.nextStep = "2";
    this.step.idWf =  param[1];
    this.cargando = true;

    this.securityService.registerByTokenTer(this.step).subscribe((response: any) => {
      this.cargando = false;
      this.okServicio = true;
      this.mensajes.push(response.body);
      this.check = "OK - VERIFICADO....";
      this.color = "#E8F5E9";
    }, error => {

      const message = error.error.mensaje;
      this.check = "ERROR - " + message;
      this.color = "#FFEBEE";

      console.log(error.error.mensaje);
      if (error.status == FALLA_RESPUESTA_MALA) {
        this.mensajesErrores.push(message);
      } else if (error.status == FALLA_NO_ENCONTRADO) {
        this.mensajesErrores.push(message);
      } else {
        this.mensajesErrores.push(ERROR_NO_CONTROLADO);
      }
    });

  }

  esObjetoJson = (msj) => {
    try {
      JSON.parse(msj);
    } catch (e) {
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
