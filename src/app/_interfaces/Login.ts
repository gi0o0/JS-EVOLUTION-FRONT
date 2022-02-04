export interface Login {
    tipoDocumento: string;
    numeroDocumento: string;
    claveVirtual: string;
    aceptoTerminos: boolean;
    ip?: string;
}
