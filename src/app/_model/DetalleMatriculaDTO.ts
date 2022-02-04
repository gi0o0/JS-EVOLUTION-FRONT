import { RespuestaDatosDTO } from './RespuestaDatosDTO';

export class DetalleMatriculaDTO {
    nombreRazonSocial: string;
    numeroMatriculaMercantil: string;
    idTipoOrganizacionJuridica: string;
    tipoOrganizacionJuridica: string;
    direccionComercial: string;
    representanteLegalRevisorFiscal: string;
    idTipoIdentificacion: string;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
    idCategoria: string;
    categoria: string;
    activa: boolean;
    tipoSociedad: string;
    numeroCliente: number;
    inactivoDetalle: RespuestaDatosDTO;
}