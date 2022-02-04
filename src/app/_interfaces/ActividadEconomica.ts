export interface ActividadEconomica {
    codigosSHD: any[];
    ctrSHD: boolean; // Este campo es mutable solamente es usado para temas de pantalla.
    descripcion: string;
    idCiiu: string;
    notaExplicativa: string;
    codigoSHDSeleccionado: string;
}
