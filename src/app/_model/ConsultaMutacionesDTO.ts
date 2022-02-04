import { MutacionDireccion } from '../_interfaces/MutacionDireccion';
import { CiiuMutacionDTO } from './CiiuMutacionDTO';

export class ConsultaMutacionesDTO {
    direccionMutacion: MutacionDireccion[];
    ciiuMutacion: CiiuMutacionDTO[];
    nombreMutacion: string;
}