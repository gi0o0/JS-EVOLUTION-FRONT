import { DatosUsuarioDTO } from './DatosUsuarioDTO';
export class PagoDTO {

    detalle: string;
    numCliente: number;
    numMatricula: string;
    monedaId: string;
    valorTotal: number;
    numClientePadre: string;
    usuario: DatosUsuarioDTO;
}
