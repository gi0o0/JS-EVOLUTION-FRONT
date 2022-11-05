import { Component, OnInit ,HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { SeguridadService } from './_services/seguridad/seguridad.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],
})
export class AppComponent implements OnInit {

  timeoutId;
  userInactive: Subject<any> = new Subject();

  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private seguridadService: SeguridadService
  ) {
    
    iconSet.icons = { ...freeSet };
    this.checkTimeOut();
    this.userInactive.subscribe((message) => {
      const credenciales = this.seguridadService.obtenerCredenciales();   
      if(null!=credenciales){
      this.seguridadService.cerrarSesion();
    }
    }
    );
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  checkTimeOut() {
    this.timeoutId = setTimeout(
      () => this.userInactive.next("User has been inactive"), 600000
    );
  }

  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
    clearTimeout(this.timeoutId);
    this.checkTimeOut();   
  }
}
