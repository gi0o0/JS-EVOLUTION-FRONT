import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { SeguridadService } from '../_services/seguridad/seguridad.service';
import { FALLA_NO_AUTORIZADO, FALLA_NO_PERMITIDO } from '../_shared/constantes';



@Injectable()
export class BasicaAutenticacionInterceptor implements HttpInterceptor {

    URI_BASE: string;
    URL_API_GATEWARE: any[];

    constructor(private seguridadService: SeguridadService,
        private router: Router
    ) {
        this.URI_BASE = environment.url_host;
        this.URL_API_GATEWARE = [
            `${this.URI_BASE}/auth/signin`,
            `${this.URI_BASE}/auth/signup`,
            `${this.URI_BASE}/auth/signou`,
            `${this.URI_BASE}/parametro`

        ];
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const credenciales = this.seguridadService.obtenerCredenciales();

        if (!credenciales && !this.encontrarUrl(req.url)) {
            this.router.navigateByUrl('/login');
        } else if (credenciales && !credenciales.numeroDocumento) {

            this.seguridadService.cerrarSesion();
        }

        if (this.encontrarUrl(req.url)) {
            const inicicialRequest = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json'
                }
            });
            return next.handle(inicicialRequest).pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError(error);
                }));
        } else {
            const modicadoRequest = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json',
                    //  Authorization: `Bearer ${credenciales.tokenAcceso}`
                }
            });
            return next.handle(modicadoRequest).pipe(
                catchError((error: HttpErrorResponse) => {

                    return throwError(error);
                }));
        }

    }

    encontrarUrl(reqUrl: string) {
        const urlEncontrada = this.URL_API_GATEWARE.filter(urlGateware => {
            return reqUrl.includes(urlGateware);
        });
        return (urlEncontrada.length !== 0) ? true : false;
    }


}
