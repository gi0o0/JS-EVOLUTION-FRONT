import { DTOWfStepParameterDoc } from "./DTOWfStepParameterDoc";
import { DTOWfStepParameterAut } from "./DTOWfStepParameterAut";
export class DTOWfStepParameter {

    idWf: number;
    idPaso: number;
    nomPaso: string;
    email1: string;
    email2: string;
    email3: string;
    solAutoriza: string;
    solDocumentos: string;
    ordPaso: number;
    envCorreoPaso: string;
    envCorreoAutoriza: string;
    asuntoCorreo: string;
    textoCorreo: string;
    tiempoAlerta1: string;
    tiempoAlerta2: string;
    tiempoAlerta3: string;
    usuUltMod: string;
    fecUltMod: string;
    fecCrea: string;
    usuCrea: string;
    docs: DTOWfStepParameterDoc[];
    auts: DTOWfStepParameterAut[];
    constructor() { }

}