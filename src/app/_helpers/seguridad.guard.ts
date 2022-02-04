import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SeguridadService } from '../_services/seguridad/seguridad.service';
import { LISTADOS_CIIU_BUSCADOS } from '../_shared/constantes';


@Injectable({
  providedIn: 'root'
})
export class SeguridadGuard implements CanActivate {

  constructor( private seguridadService: SeguridadService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  
    const accesoToken = this.seguridadService.obtenerCredenciales();
    let validacionToken = false;
    if ( accesoToken !== null ) {
      validacionToken  = true;
    } else {
      this.router.navigate(['/login']);
    }

    return validacionToken;
  }
}
