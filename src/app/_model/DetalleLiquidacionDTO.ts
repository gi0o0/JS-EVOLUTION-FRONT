import { LiquidacionDTO } from './LiquidacionDTO';

export class DetalleLiquidacionDTO {
    liquidaciones: LiquidacionDTO[];
    valorTotal: number;
    detalle: string;
    moneda: string;
}
