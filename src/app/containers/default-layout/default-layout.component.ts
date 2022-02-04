import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { Router } from '@angular/router';
import { SeguridadService } from '../../_services/seguridad/seguridad.service';
import { Funcionalidad } from '../../_model/Funcionalidad';
import { FUNCIONALIDADES} from '../../_shared/constantes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  sidebarMinimized = false;
  navItems: INavData[];
  listaFuncionalidades?: Funcionalidad[];
  nombreUsuario: string;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(private router: Router, private seguridadService: SeguridadService) {
  }

  ngOnInit() {
    const credenciales = this.seguridadService.obtenerCredenciales();

    if (!credenciales) {
      this.router.navigateByUrl('login');
    }
    

    this.nombreUsuario = sessionStorage.getItem("nombreUsuario");
    this.navItems=JSON.parse(sessionStorage.getItem(FUNCIONALIDADES));
  
  }

  logout() {
    this.seguridadService.cerrarSesion();
  }


}
