import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';



@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private readonly http: HttpClient) { }

  codificarBase64 = (dato: string): string => {
    return btoa(dato);
  }

  decodificarBase64 = (dato: string): string => {
    return atob(dato);
  }

  validarTelefonos( control: FormControl): {[s: string]: boolean } {
    const numero = control.value;
    if (numero && numero.length !== 7 && numero.length !== 10) {
      return {
        validarTelefonos: true
      };
    }
    return null;
  }


  formatoFechas(fecha: Date, simbolo: string) {
    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const yyyy = fecha.getFullYear();
    return `${yyyy}${simbolo}${mm}${simbolo}${dd}`;
  }
}
