import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DTOWfParameter } from '../../../../_model/DTOWfParameter';
import { DTOParameter } from '../../../../_model/DTOParameter';
import { BuscarSolicitudDialogComponent } from
  '../../../../_components/dialog-search-request/dialog-search-request.component';
import { ParameterService } from '../../../../_services/parameter/parameter.service';
import { FoclaasoService } from '../../../../_services/foclaaso/foclaaso.service';
import { FotipcreService } from '../../../../_services/fotipcre/fotipcre.service';
import { CladocService } from '../../../../_services/cladoc/cladoc.service';
import { CountriesService } from '../../../../_services/countries/countries.service';
import { DeptosService } from '../../../../_services/deptos/deptos.service';
import { CitiesService } from '../../../../_services/cities/cities.service';
import { WfService } from '../../../../_services/wf/wf.service';
import { DTOWfSteps } from '../../../../_model/DTOWfSteps';
import { DTOWfStepParameterDoc } from '../../../../_model/DTOWfStepParameterDoc';
import { DTOWfStepParameterAut } from '../../../../_model/DTOWfStepParameterAut';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO, EXP_REGULAR_CORREO, EXP_REGULAR_FECHA_YYYMMDD, EXP_REGULAR_MAYUSCULAS_NOMBRE } from '../../../../_shared/constantes';
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { AddressComponent } from '../../../../_components/address/address.component';
import { MatDialog } from '@angular/material/dialog';
import { DTOFoclaaso } from '../../../../_model/DTOFoclaaso';
import { DTOFotipcre } from '../../../../_model/DTOFotipcre';
import { DTOCladoc } from '../../../../_model/DTOCladoc';
import { DTOCountries } from '../../../../_model/DTOCountries';
import { DTODeptos } from '../../../../_model/DTODeptos';
import { DTOCities } from '../../../../_model/DTOCities';
import { BaentidadService } from '../../../../_services/baentidad/baentidad.service';
import { DTOBaentidad } from '../../../../_model/DTOBaentidad';
import { BasTTipCtaService } from '../../../../_services/basttipcta/basttipcta.service';
import { DTOBasTTipCta } from '../../../../_model/DTOBasTTipCta';
import { DTOWfStepsCodeudor } from '../../../../_model/DTOWfStepsCodeudor';
import { UserService } from '../../../../_services/user/user.service';
import { DTOTercero } from '../../../../_model/DTOTercero';

@Component({
  selector: 'step-1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit {

  o: DTOWfParameter;
  @Input() step: DTOWfSteps;
  codeu: DTOWfStepsCodeudor;
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  listSteps: DTOWfSteps[];
  loading: boolean = false;
  showFormAdd: boolean = false;
  docs: DTOWfStepParameterDoc[] = [];
  auts: DTOWfStepParameterAut[];
  entitie: DTOFoclaaso;
  listFoclaaso: DTOFoclaaso[];
  listFotipcre: DTOFotipcre[];
  listBaentidad: DTOBaentidad[];
  listTypeSolicitud: DTOParameter[];
  listTypeContrato: DTOParameter[];
  listTypeContratoCodeu: DTOParameter[];
  listTypePeriodicidad: DTOParameter[];
  listEps: DTOParameter[];
  listEpsCodeu: DTOParameter[];
  listCladoc: DTOCladoc[];
  listAccountType: DTOBasTTipCta[];
  listCountries: DTOCountries[];
  listCountriesNac: DTOCountries[];
  listCountriesJob: DTOCountries[];
  listCountriesDeu: DTOCountries[];
  listCountriesDeuJob: DTOCountries[];
  listDeptos: DTODeptos[];
  listDeptosNac: DTODeptos[];
  listDeptosJob: DTODeptos[];
  listDeptosDeu: DTODeptos[];
  listDeptosDeuJob: DTODeptos[];
  listCities: DTOCities[];
  listCitiesNac: DTOCities[];
  listCitiesJob: DTOCities[];
  listCitiesDeu: DTOCities[];
  listCitiesDeuJob: DTOCities[];
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  idPais: number;
  idPaisJob: number;
  maxDate: Date;
  isCodeudor: boolean;
  editMail: boolean = false;

  constructor(private parameterService: ParameterService, private formBuilder: FormBuilder, public dialog: MatDialog,
    private foclaasoService: FoclaasoService, private fotipcreService: FotipcreService, private cladocService: CladocService
    , private countriesService: CountriesService, private deptosService: DeptosService, private citiesService: CitiesService
    , private baentidadService: BaentidadService, private basTTipCtaService: BasTTipCtaService, private wfService: WfService, private userService: UserService) {
    this.o = new DTOWfParameter();

  }

  ngOnInit() {

    //   this.callStepOld();
    this.initStep();
    this.crearFormulario();
    this.getEntities();
    this.getParameters();
    this.getTipoContrato();
    this.getFotipcre();
    this.getCladoc();
    this.getParametersPeriodicidad();
    this.getCountries();
    this.getEps();
    this.getBaentidad();
    this.getAccountType();

    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear - 2, 12, 31);
    this.isCodeudor = false;


    this.parameterService.objetoCambioAdrressDian.subscribe(data => {
      if ("dirTerpal" == data.id) {
        this.step.dirTerpal = data.value;
      } else if ("dirTeralt" == data.id) {
        this.step.dirTeralt = data.value;
      } else if ("dirTerpal_codeu" == data.id) {
        this.step.codeu.dirTerpal = data.value;
      } else if ("dirTeralt_codeu" == data.id) {
        this.step.codeu.dirTeralt = data.value;
      }
    });

    if (this.step.isUpdate) {

      if (this.step.codeu != null) {
        this.isCodeo();
        this.clientDepoUpdate(this.step.codeu.paisCodigo, 'paisCodigo_codeu', this.step.codeu.codiDept, 'codiDept_codeu');
        this.clientDepoUpdate(Number(this.step.codeu.paisDirTrabajo), 'paisDirTrabajo_codeu', Number(this.step.codeu.deptDirTrabajo), 'deptDirTrabajo_codeu');
      }
      this.clientDepoUpdate(this.step.paisCodigo, 'paisCodigo', this.step.codiDept, 'codiDept');
      this.clientDepoUpdate(Number(this.step.paisDirTrabajo), 'paisDirTrabajo', Number(this.step.deptDirTrabajo), 'deptDirTrabajo');
      this.clientDepoUpdate(Number(this.step.dirPaisTer), 'dirPaisNac', Number(this.step.dirDepTer), 'dirDepNac');

      if (Number(this.step.idStepNow) > 2) {
        this.editMail = true;
      }
    }

  }

  callStepOld() {
    if (this.step.isUpdate) {
      setTimeout(() => {
        this.parentFun.emit();
      }, 1000);
    }
  }

  crearFormulario = () => {

    this.forma = this.formBuilder.group({
      entitie: ['', [Validators.required]],
      tipSolCredito: ['', [Validators.required]],
      valorPress: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(6)]],
      foticrep: ['', [Validators.required]],
      perCuota: ['', [Validators.required]],
      doctip: ['', [Validators.required]],
      nitter: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      nomTer: ['', [Validators.required, Validators.pattern(EXP_REGULAR_MAYUSCULAS_NOMBRE), Validators.maxLength(60)]],
      priApellido: ['', [Validators.required, Validators.pattern(EXP_REGULAR_MAYUSCULAS_NOMBRE), Validators.maxLength(60)]],
      segApellido: ['', [Validators.pattern(EXP_REGULAR_MAYUSCULAS_NOMBRE), Validators.maxLength(60)]],
      lugarDoc: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(20)]],
      indSolCredito: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      feExp_deu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_FECHA_YYYMMDD), Validators.maxLength(10)]],
      mailTer: ['', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      dirTerpal: ['', [Validators.required]],
      telTer: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      telTer1: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      telTer2: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11)]],
      paisCodigo: ['', [Validators.required]],
      codiDept: ['', [Validators.required]],
      codiCiud: ['', [Validators.required]],
      dirPaisTer: ['', [Validators.required]],
      dirDepTer: ['', [Validators.required]],
      dirCiuTer: ['', [Validators.required]],
      barrio: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      fecIngEmpresa: ['', [Validators.required, Validators.pattern(EXP_REGULAR_FECHA_YYYMMDD), Validators.maxLength(10)]],
      antiEmpresa: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(1)]],
      fecCump: ['', [Validators.required, Validators.pattern(EXP_REGULAR_FECHA_YYYMMDD), , Validators.maxLength(10)]],
      tipVivienda: ['', [Validators.required]],
      dirTeralt: ['', [Validators.required]],
      barrioTra: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      paisDirTrabajo: ['', [Validators.required]],
      deptDirTrabajo: ['', [Validators.required]],
      ciuDirTrabajo: ['', [Validators.required]],
      faxTer: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      cargoWf: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      indContrato: ['', [Validators.required]],
      paramText: ['', [Validators.required]],
      entBan: ['', [Validators.required]],
      tipCta: ['', [Validators.required]],
      numCta: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(16), Validators.minLength(6)]],
      idConyuge: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      nomCony: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      emailConyuge: ['', [Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      celConyuge: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      nroCuotas: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(4), Validators.minLength(1)]],
      refNombre1: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refParen1: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refMail1: ['', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      refCel1: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      refNombre2: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refParen2: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refMail2: ['', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      refCel2: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      refNombre3: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refParen3: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refMail3: ['', [Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      refCel3: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      bienNombre: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      bienValor: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      bienAfecta: ['', [Validators.required]],
      bienHipoteca: ['', [Validators.required]],
      bienHipAFavor: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehMarca: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehClase: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehModelo: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehPlaca: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehPignorado: ['', [Validators.required]],
      vehPigAFavor: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehValVomercial: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      comments: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(1000)]],
    });

  }

  crearFormularioWithCodeo = () => {

    this.forma.addControl('doctip_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('nitter_codeu', new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]))
    this.forma.addControl('nomTer_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_MAYUSCULAS_NOMBRE), Validators.maxLength(60)]))
    this.forma.addControl('empresa_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(90)]))
    this.forma.addControl('priApellido_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_MAYUSCULAS_NOMBRE), Validators.maxLength(60)]))
    this.forma.addControl('segApellido_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_MAYUSCULAS_NOMBRE), Validators.maxLength(60)]))
    this.forma.addControl('lugarDoc_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(20)]))
    this.forma.addControl('mailTer_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]))
    this.forma.addControl('dirTerpal_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('telTer_codeu', new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]))
    this.forma.addControl('feExp', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_FECHA_YYYMMDD)]))
    this.forma.addControl('paisCodigo_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('codiDept_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('codiCiud_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('barrio_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('antiEmpresa_codeu', new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(1)]))
    this.forma.addControl('tipVivienda_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('dirTeralt_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('barrioTra_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('paisDirTrabajo_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('deptDirTrabajo_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('ciuDirTrabajo_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('faxTer_codeu', new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]))
    this.forma.addControl('cargoWf_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('indContrato_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('paramText_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('idConyuge_codeu', new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]))
    this.forma.addControl('nomCony_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('emailConyuge_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]))
    this.forma.addControl('celConyuge_codeu', new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]))
    this.forma.addControl('refNombre1_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('refParen1_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('refMail1_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]))
    this.forma.addControl('refCel1_codeu', new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]))
    this.forma.addControl('refNombre2_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('refParen2_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('refMail2_codeu', new FormControl('', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]))
    this.forma.addControl('refCel2_codeu', new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]))
    this.forma.addControl('refNombre3_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('refParen3_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('refMail3_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]))
    this.forma.addControl('refCel3_codeu', new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]))
    this.forma.addControl('bienNombre_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('bienValor_codeu', new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]))
    this.forma.addControl('bienAfecta_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('bienHipoteca_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('bienHipAFavor_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('vehMarca_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('vehClase_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('vehModelo_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('vehPlaca_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('vehPignorado_codeu', new FormControl('', [Validators.required]))
    this.forma.addControl('vehPigAFavor_codeu', new FormControl('', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]))
    this.forma.addControl('vehValVomercial_codeu', new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]))

    this.forma.removeControl('');
  }

  removeFormularioWithCodeo = () => {

    this.forma.removeControl('doctip_codeu')
    this.forma.removeControl('nitter_codeu')
    this.forma.removeControl('nomTer_codeu')
    this.forma.removeControl('priApellido_codeu')
    this.forma.removeControl('segApellido_codeu')
    this.forma.removeControl('lugarDoc_codeu')
    this.forma.removeControl('mailTer_codeu')
    this.forma.removeControl('dirTerpal_codeu')
    this.forma.removeControl('telTer_codeu')
    this.forma.removeControl('feExp')
    this.forma.removeControl('paisCodigo_codeu')
    this.forma.removeControl('codiDept_codeu')
    this.forma.removeControl('codiCiud_codeu')
    this.forma.removeControl('barrio_codeu')
    this.forma.removeControl('antiEmpresa_codeu')
    this.forma.removeControl('tipVivienda_codeu')
    this.forma.removeControl('dirTeralt_codeu')
    this.forma.removeControl('barrioTra_codeu')
    this.forma.removeControl('paisDirTrabajo_codeu')
    this.forma.removeControl('deptDirTrabajo_codeu')
    this.forma.removeControl('ciuDirTrabajo_codeu')
    this.forma.removeControl('faxTer_codeu')
    this.forma.removeControl('cargoWf_codeu')
    this.forma.removeControl('indContrato_codeu')
    this.forma.removeControl('paramText_codeu')
    this.forma.removeControl('idConyuge_codeu')
    this.forma.removeControl('nomCony_codeu')
    this.forma.removeControl('emailConyuge_codeu')
    this.forma.removeControl('celConyuge_codeu')
    this.forma.removeControl('refNombre1_codeu')
    this.forma.removeControl('refParen1_codeu')
    this.forma.removeControl('refMail1_codeu')
    this.forma.removeControl('refCel1_codeu')
    this.forma.removeControl('refNombre2_codeu')
    this.forma.removeControl('refParen2_codeu')
    this.forma.removeControl('refMail2_codeu')
    this.forma.removeControl('refCel2_codeu')
    this.forma.removeControl('refNombre3_codeu')
    this.forma.removeControl('refParen3_codeu')
    this.forma.removeControl('refMail3_codeu')
    this.forma.removeControl('refCel3_codeu')
    this.forma.removeControl('bienNombre_codeu')
    this.forma.removeControl('bienValor_codeu')
    this.forma.removeControl('bienAfecta_codeu')
    this.forma.removeControl('bienHipoteca_codeu')
    this.forma.removeControl('bienHipAFavor_codeu')
    this.forma.removeControl('vehMarca_codeu')
    this.forma.removeControl('vehClase_codeu')
    this.forma.removeControl('vehModelo_codeu')
    this.forma.removeControl('vehPlaca_codeu')
    this.forma.removeControl('vehPignorado_codeu')
    this.forma.removeControl('vehPigAFavor_codeu')
    this.forma.removeControl('vehValVomercial_codeu')
  }

  hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  actualizar(o?: DTOWfSteps) {
    let med = o != null ? o : new DTOWfSteps();
    this.step = med;
    this.showForm();
  }

  operarStep1() {

    if (!this.validarErroresCampos()) {
      this.loading = true;
      this.wfService.createStep(this.step).subscribe(data => {
        this.resetForm();
        this.loading = false;
        this.step = data as DTOWfSteps;
        this.step.comments = '';
        this.showMessage("Paso Ingresado.");
        this.wfService.wf_step_event.next(this.step);
      }, error => {
        this.loading = false;
        console.log(error);
        this.showMessage("ERROR:" + error.error.mensaje);
      });

    } else {
      this.showMessage("Algunos campos no cumplen las validaciones");
    }
  }

  resetForm() {
    this.forma.reset;
    this.myForm.resetForm();
  }

  validarErroresCampos = () => {
    let errorCampos = false;
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      });
      this.errorServicio = false;
      errorCampos = true;
    }
    return errorCampos;
  }

  showForm() {
    this.showFormAdd = true;
  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,
    });
  }

  showWindowAddAddress(id: string) {
    this.dialog.open(AddressComponent, {
      width: '600px',
      height: '500px',
      data: id,
    });
  }


  getEntities() {
    this.foclaasoService.listAll().subscribe(async (res: DTOFoclaaso[]) => {
      this.listFoclaaso = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getFotipcre() {
    this.fotipcreService.listAll().subscribe(async (res: DTOFotipcre[]) => {
      this.listFotipcre = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getBaentidad() {
    this.baentidadService.listAll().subscribe(async (res: DTOBaentidad[]) => {
      this.listBaentidad = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getParameters() {
    this.parameterService.listParametersByParamId('TIPO_CREDITO').subscribe(async (res: DTOParameter[]) => {
      this.listTypeSolicitud = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getTipoContrato() {
    this.parameterService.listParametersByParamId('TIPO_CONTRATO').subscribe(async (res: DTOParameter[]) => {
      this.listTypeContrato = res;
      this.listTypeContratoCodeu = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getEps() {
    this.parameterService.listParametersByParamId('EPS').subscribe(async (res: DTOParameter[]) => {
      this.listEps = res;
      this.listEpsCodeu = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getCountries() {
    this.countriesService.listAll().subscribe(async (res: DTOCountries[]) => {
      this.listCountries = res;
      this.listCountriesNac = res;
      this.listCountriesJob = res;
      this.listCountriesDeu = res;
      this.listCountriesDeuJob = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getUser(nitter: string, tipoUser: String) {

    this.userService.listUserTerceroByNitter(Number(nitter)).subscribe(async (res: DTOTercero) => {
      if (tipoUser == "CODEO") {
        this.step.codeu.doctip = res.docTip;
        this.step.codeu.nomTer = res.nomTercero;
        this.step.codeu.priApellido = res.priApellido;
        this.step.codeu.segApellido = res.segApellido;

      } else {
        this.step.doctip = res.docTip;
        this.step.nomTer = res.nomTercero;
        this.step.priApellido = res.priApellido;
        this.step.segApellido = res.segApellido;
      }

    }, error => {
      this.loading = false;
      this.showMessage(error.error.mensaje);
    });
  }

  getUserModal(nitter: string, tipoUser: String) {

    const dialogRef = this.dialog.open(BuscarSolicitudDialogComponent, {
      width: '400px',
      height: 'auto',
      maxHeight: '250px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((idSolicitud: string | undefined) => {
      if (idSolicitud) {

        const idNum = Number(idSolicitud);
        this.wfService.listByNumRadAndMov(idNum, '1').subscribe(async (res: DTOWfSteps) => {

          if (null == res.numeroRadicacion ) {
            this.showMessage("No se encontró solicitud");
            return;
          }

           if (tipoUser === 'CODEO') {

            if (!res.codeu || !res.codeu.codTer) {
              this.showMessage("No se encontró codeudor en la solicitud");
              return;
            }

            const codeudorToDeudorMap = [
              'doctip', 'codTer', 'nitter', 'nomTer', 'priApellido', 'segApellido',
              'lugarDoc', 'feExp', 'mailTer', 'dirTerpal', 'telTer', 'telTer1', 'telTer2',
              'paisCodigo', 'codiDept', 'codiCiud', 'dirPaisTer', 'dirDepTer', 'dirCiuTer',
              'barrio', 'fecIngEmpresa', 'antiEmpresa', 'fecCump', 'sexo', 'tipVivienda',
              'dirTeralt', 'barrioTra', 'paisDirTrabajo', 'deptDirTrabajo', 'ciuDirTrabajo',
              'faxTer', 'codProfe', 'indContrato', 'paramText', 'idConyuge', 'nomCony',
              'emailConyuge', 'celConyuge', 'refNombre1', 'refParen1', 'refMail1', 'refCel1',
              'refNombre2', 'refParen2', 'refMail2', 'refCel2', 'refNombre3', 'refParen3',
              'refMail3', 'refCel3', 'cargoWf', 'entBan', 'tipCta', 'numCta', 'bienNombre',
              'bienValor', 'bienAfecta', 'bienHipoteca', 'bienHipAFavor', 'vehMarca',
              'vehClase', 'vehModelo', 'vehPlaca', 'vehPignorado', 'vehPigAFavor', 'vehValVomercial'
            ];

            codeudorToDeudorMap.forEach(field => {
              if ((res.codeu as any)[field] != null && (res.codeu as any)[field] !== '') {
                (this.step as any)[field] = (res.codeu as any)[field];
              }
            });

            this.clientDepoUpdate(res.codeu.paisCodigo, 'paisCodigo', res.codeu.codiDept, 'codiDept');
            this.clientDepoUpdate(Number(res.codeu.paisDirTrabajo), 'paisDirTrabajo', Number(res.codeu.deptDirTrabajo), 'deptDirTrabajo');
          } else {
             const deudorToCodeudorMap = [
              'doctip', 'codTer', 'nitter', 'nomTer', 'priApellido', 'segApellido',
              'lugarDoc', 'feExp', 'mailTer', 'dirTerpal', 'telTer', 'telTer1', 'telTer2',
              'paisCodigo', 'codiDept', 'codiCiud', 'dirPaisTer', 'dirDepTer', 'dirCiuTer',
              'barrio', 'fecIngEmpresa', 'antiEmpresa', 'fecCump', 'sexo', 'tipVivienda',
              'dirTeralt', 'barrioTra', 'paisDirTrabajo', 'deptDirTrabajo', 'ciuDirTrabajo',
              'faxTer', 'codProfe', 'indContrato', 'paramText', 'idConyuge', 'nomCony',
              'emailConyuge', 'celConyuge', 'refNombre1', 'refParen1', 'refMail1', 'refCel1',
              'refNombre2', 'refParen2', 'refMail2', 'refCel2', 'refNombre3', 'refParen3',
              'refMail3', 'refCel3', 'cargoWf', 'entBan', 'tipCta', 'numCta', 'bienNombre',
              'bienValor', 'bienAfecta', 'bienHipoteca', 'bienHipAFavor', 'vehMarca',
              'vehClase', 'vehModelo', 'vehPlaca', 'vehPignorado', 'vehPigAFavor', 'vehValVomercial'
            ];
             deudorToCodeudorMap.forEach(field => {
                if ((res as any)[field] != null && (res as any)[field] !== '') {
                  (this.step.codeu as any)[field] = (res as any)[field];
                }
              });

              this.clientDepoUpdate(res.paisCodigo, 'paisCodigo_codeu', res.codiDept, 'codiDept_codeu');
              this.clientDepoUpdate(Number(res.paisDirTrabajo), 'paisDirTrabajo_codeu', Number(res.deptDirTrabajo), 'deptDirTrabajo_codeu');            
           
          }
        }, error => {
          this.loading = false;
          this.showMessage(error.error.mensaje);
        });
      }
    });
  }

  onCountriesChange(event, name: string) {
    this.idPais = event.value;
    this.clientDepo(this.idPais, name);
  }

  onCountriesChangeJob(event, name: string) {
    this.idPaisJob = event.value;
    this.clientDepo(this.idPaisJob, name);
  }

  onDeptosChange(event, name: string) {

    if (undefined == this.idPais && name == 'codiDept') {
      this.idPais = this.step.paisCodigo;
    }
    if (undefined == this.idPais && name == 'codiDept_codeu') {
      this.idPais = this.step.codeu.paisCodigo;
    }
    if (undefined == this.idPais && name == 'dirDepNac') {
      this.idPais = this.step.dirPaisTer;
    }
    this.clientCities(this.idPais, event.value, name);
  }

  onDeptosChangeJob(event, name: string) {
    if (undefined == this.idPaisJob && name == 'deptDirTrabajo') {
      this.idPaisJob = Number(this.step.paisDirTrabajo);
    }
    if (undefined == this.idPaisJob && name == 'deptDirTrabajo_codeu') {
      this.idPaisJob = Number(this.step.codeu.paisDirTrabajo);
    }
    this.clientCities(this.idPaisJob, event.value, name);
  }


  getParametersPeriodicidad() {
    this.parameterService.listParametersByParamId('PERIODICIDAD').subscribe(async (res: DTOParameter[]) => {
      this.listTypePeriodicidad = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getCladoc() {
    this.cladocService.listAll().subscribe(async (res: DTOCladoc[]) => {
      this.listCladoc = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  getAccountType() {
    this.basTTipCtaService.listAll().subscribe(async (res: DTOBasTTipCta[]) => {
      this.listAccountType = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  clientDepoUpdate(idPais: number, namePais: string, idDep: number, nameDepo: string) {
    this.loading = true;
    this.deptosService.listAll(idPais).subscribe(async (res: DTODeptos[]) => {
      this.loading = false;
      if ("paisCodigo" == namePais) {        
        this.listDeptos = res;
        this.listCities = [];
      } else if ("paisDirTrabajo" == namePais) {
        this.listDeptosJob = res;
        this.listCitiesJob = [];
      } else if ("paisCodigo_codeu" == namePais) {
        this.listDeptosDeu = res;
        this.listCitiesDeu = [];
      } else if ("paisDirTrabajo_codeu" == namePais) {
        this.listDeptosDeuJob = res;
        this.listCitiesDeuJob = [];
      } else if ("dirPaisNac" == namePais) {
        this.listDeptosNac = res;
        this.listCitiesNac = [];
      }
      this.clientCities(idPais, idDep, nameDepo);
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }

  clientDepo(idPais: number, name: string) {
    this.loading = true;
    this.deptosService.listAll(idPais).subscribe(async (res: DTODeptos[]) => {
      this.loading = false;
      if ("paisCodigo" == name) {
        this.listDeptos = res;
        this.listCities = [];
      } else if ("paisDirTrabajo" == name) {
        this.listDeptosJob = res;
        this.listCitiesJob = [];
      } else if ("paisCodigo_codeu" == name) {
        this.listDeptosDeu = res;
        this.listCitiesDeu = [];
      } else if ("paisDirTrabajo_codeu" == name) {
        this.listDeptosDeuJob = res;
        this.listCitiesDeuJob = [];
      } else if ("dirPaisNac" == name) {
        this.listDeptosNac = res;
        this.listCitiesNac = [];
      }
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }

  clientCities(idPais: number, idDep: number, name: string) {
    this.loading = true;
    this.citiesService.listAll(idPais, idDep).subscribe(async (res: DTOCities[]) => {
      this.loading = false;
      if ("codiDept" == name) {
        this.listCities = res;
      } else if ("deptDirTrabajo" == name) {
        this.listCitiesJob = res;
      } else if ("codiDept_codeu" == name) {
        this.listCitiesDeu = res;
      } else if ("deptDirTrabajo_codeu" == name) {
        this.listCitiesDeuJob = res;
      } else if ("dirDepNac" == name) {
        this.listCitiesNac = res;
      }
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }

  initStep() {

    if (this.step == undefined) {
      this.step = new DTOWfSteps();
      this.step.idStep = '1';
      this.step.idSubStep = '1';
      this.step.nextStep = '1';
      this.step.numeroRadicacion = 0;
      this.codeu = new DTOWfStepsCodeudor();
      this.step.codeu = this.codeu;
      this.step.tipVivienda = '0';
      this.step.bienAfecta = '0';
      this.step.bienHipoteca = '0';
      this.step.vehPignorado = '0';
      this.step.codeu.tipVivienda = '0';
      this.step.codeu.bienAfecta = '0';
      this.step.codeu.bienHipoteca = '0';
      this.step.codeu.vehPignorado = '0';
      this.step.idWf = '0';
    }
  }


  onEntitieChange(event) {
    this.isCodeudor = false;
    this.listFoclaaso.forEach((currentValue, index) => {
      if (currentValue.id == event.value) {
        this.entitie = currentValue;
      }
    });
  }

  valueRequestchange(value) {
    if (this.entitie != undefined) {


      if ("" != value && value != undefined && value.length >= 6) {
        if (value <= this.entitie.monto1 && this.entitie.indCodeudorMonto1 == "1") {
          this.isCodeo();
        } else if (value > this.entitie.monto1 && value <= this.entitie.monto2 && this.entitie.indCodeudorMonto2 == "1") {
          this.isCodeo();
        } else if (value > this.entitie.monto2 && value <= this.entitie.monto3 && this.entitie.indCodeudorMonto3 == "1") {
          this.isCodeo();
        } else if (value > this.entitie.monto3 && value <= this.entitie.monto4 && this.entitie.indCodeudorMonto4 == "1") {
          this.isCodeo();
        } else {
          this.isCodeudor = false;
          this.removeFormularioWithCodeo();
        }
      }
    }
  }

  isCodeo() {
    this.crearFormularioWithCodeo();
    this.isCodeudor = true;
  }
}