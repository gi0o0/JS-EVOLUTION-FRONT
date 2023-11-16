
import { DTODoc } from './DTODoc';
import { DTOWWfMov } from './DTOWWfMov';
import { DTOWfDocs } from './DTOWfDocs';
export class DTOWfPqrSteps {

    idWf: string;
    nameWf: string;
    nameStep: string;
    isUpdate: boolean;
    readonly: boolean;
    numeroRadicacion: number
    idStep: string;
    idMov: string;
    idStepNow: string;
    nextStep: string;
    idSubStep: string;
    estado: string;
    entitie: string;
    company: string;
    doctip: string;
    nitter: string;
    codTer: string;
    nomTer: string;
    priApellido: string;
    segApellido: string;
    lugarDoc: string;
    feExp: string;
    mailTer: string;
    dirTerpal: string
    fecCump: string;
    comments: string;
    isRequiredFiles: boolean;
    files: DTOWfDocs[];
    isRequiredEmail: boolean;
    state: string;
    movs: DTOWWfMov[];
    filesEmail: DTODoc[];

    estadoCuenta: boolean;
    certificadoDeuda: boolean;
    pazSalvo: boolean;
    certificado: boolean;
    derechoPeticion: boolean;
    credtis: string[];
    walletType: string;
    stateType: string;
    usuComercial: string;
    fecUltMod: string;
    idArea: string;

    constructor() { }

}