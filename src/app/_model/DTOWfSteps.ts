
import { DTOWfDocs } from './DTOWfDocs';
import { DTOWfStepParameterDoc } from './DTOWfStepParameterDoc';
import { DTOWfStepsCodeudor } from './DTOWfStepsCodeudor';
import { DTOWfStepsFinancialInfo } from './DTOWfStepsFinancialInfo';
export class DTOWfSteps {

    idWf: string;
    isUpdate: boolean;
    readonly: boolean;
    numeroRadicacion: number
    idStep: string;
    idStepNow: string;
    nextStep: string;
    idSubStep: string;
    estado: string;
    entitie: string;
    tipSolCredito: string;
    valorPress: string;
    foticrep: string;
    perCuota: string;
    doctip: string;
    nitter: string;
    codTer: string;
    nomTer: string;
    priApellido: string;
    segApellido: string;
    lugarDoc: string;
    feExp: string;
    sexo: string;
    indSolCredito: string;
    mailTer: string;
    dirTerpal: string
    telTer: number;
    telTer1: number;
    telTer2: number;
    paisCodigo: number;
    codiDept: number;
    codiCiud: number;
    dirPaisTer: number;
    dirDepTer: number;
    dirCiuTer: number;
    barrio: string;
    fecIngEmpresa: string;
    antiEmpresa: number;
    fecCump: string;
    tipVivienda: string;
    dirTeralt: string;
    barrioTra: string;
    paisDirTrabajo: string;
    deptDirTrabajo: string;
    ciuDirTrabajo: string;
    faxTer: number;
    codProfe: string;
    indContrato: number;
    paramText: string;
    entBan: string;
    tipCta: string;
    numCta: number;
    idConyuge: number;
    nomCony: string;
    emailConyuge: string;
    celConyuge: number;
    nroCuotas: number;
    refNombre1: string;
    refParen1: string;
    refMail1: string;
    refCel1: number;
    refNombre2: string;
    refParen2: string;
    refMail2: string;
    refCel2: number;
    refNombre3: string;
    refParen3: string;
    refMail3: string;
    refCel3: number;
    bienNombre: string;
    bienValor: number;
    bienAfecta: string;
    bienHipoteca: string;
    bienHipAFavor: string;
    vehMarca: string;
    vehClase: string;
    vehModelo: string;
    vehPlaca: string;
    vehPignorado: string;
    vehPigAFavor: string;
    vehValVomercial: number;
    codeu: DTOWfStepsCodeudor;
    comments: string;
    token: string;
    isRequiredFiles: boolean;
    files: DTOWfDocs[];
    filesParam: DTOWfStepParameterDoc[];
    prefixFile: string;
    financial: DTOWfStepsFinancialInfo;
    cargoWf: string;
    checked: string;


    constructor() { }

}