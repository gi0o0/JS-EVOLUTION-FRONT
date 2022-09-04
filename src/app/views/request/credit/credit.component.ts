import { Component, OnInit, ViewChild } from '@angular/core';
import { DTOWfParameter } from '../../../_model/DTOWfParameter';
import { DTOParameter } from '../../../_model/DTOParameter';

import { ParameterService } from '../../../_services/parameter/parameter.service';
import { FoclaasoService } from '../../../_services/foclaaso/foclaaso.service';
import { FotipcreService } from '../../../_services/fotipcre/fotipcre.service';
import { CladocService } from '../../../_services/cladoc/cladoc.service';
import { CountriesService } from '../../../_services/countries/countries.service';
import { DeptosService } from '../../../_services/deptos/deptos.service';
import { CitiesService } from '../../../_services/cities/cities.service';
import { WfService } from '../../../_services/wf/wf.service';


import { Router } from '@angular/router';
import { DTOWfSteps } from '../../../_model/DTOWfSteps';
import { DTOWfStepParameterDoc } from '../../../_model/DTOWfStepParameterDoc';
import { DTOWfStepParameterAut } from '../../../_model/DTOWfStepParameterAut';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO, EXP_REGULAR_CORREO } from '../../../_shared/constantes';
import { DialogConfirmationComponent } from "../../../_components/dialog-confirmation/dialog-confirmation.component";
import { DialogMessageComponent } from "../../../_components/dialog-message/dialog-message.component";
import { AddressComponent } from '../../queries_reports/address/address.component';
import { MatDialog } from '@angular/material/dialog';

import { DTOFoclaaso } from '../../../_model/DTOFoclaaso';
import { DTOFotipcre } from '../../../_model/DTOFotipcre';
import { DTOCladoc } from '../../../_model/DTOCladoc';
import { DTOCountries } from '../../../_model/DTOCountries';
import { DTODeptos } from '../../../_model/DTODeptos';
import { DTOCities } from '../../../_model/DTOCities';
import { FotabproService } from '../../../_services/fotabpro/fotabpro.service';
import { DTOFotabpro } from '../../../_model/DTOFotabpro';
import { BaentidadService } from '../../../_services/baentidad/baentidad.service';
import { DTOBaentidad } from '../../../_model/DTOBaentidad';
import { BasTTipCtaService } from '../../../_services/basttipcta/basttipcta.service';
import { DTOBasTTipCta } from '../../../_model/DTOBasTTipCta';
import { DTOWfStepsCodeudor } from '../../../_model/DTOWfStepsCodeudor';

@Component({
  selector: 'app-dialogo',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent implements OnInit {

  o: DTOWfParameter;
  step: DTOWfSteps;
  codeu: DTOWfStepsCodeudor;
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  listSteps: DTOWfSteps[];
  loading: boolean = false;
  showFormAdd: boolean = false;
  displayedColumns = ['idPaso', 'nomPaso', 'ordPaso', 'action'];
  displayedColumnsDocs = ['nomDocumento', 'envRec', 'action'];
  docs: DTOWfStepParameterDoc[] = [];
  auts: DTOWfStepParameterAut[];
  listFoclaaso: DTOFoclaaso[];
  listFotipcre: DTOFotipcre[];
  listBaentidad: DTOBaentidad[];
  listFotabpro: DTOFotabpro[];
  listFotabproCodeu: DTOFotabpro[];
  listTypeSolicitud: DTOParameter[];
  listTypeContrato: DTOParameter[];
  listTypeContratoCodeu: DTOParameter[];
  listTypePeriodicidad: DTOParameter[];
  listEps: DTOParameter[];
  listEpsCodeu: DTOParameter[];
  listCladoc: DTOCladoc[];
  listAccountType: DTOBasTTipCta[];
  listCountries: DTOCountries[];
  listCountriesJob: DTOCountries[];
  listCountriesDeu: DTOCountries[];
  listCountriesDeuJob: DTOCountries[];
  listDeptos: DTODeptos[];
  listDeptosJob: DTODeptos[];
  listDeptosDeu: DTODeptos[];
  listDeptosDeuJob: DTODeptos[];
  listCities: DTOCities[];
  listCitiesJob: DTOCities[];
  listCitiesDeu: DTOCities[];
  listCitiesDeuJob: DTOCities[];

  idPais: number;
  idPaisJob: number;
  maxDate: Date;
  isCodeudor: boolean;

  dataSource: MatTableDataSource<DTOWfSteps>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceDocs: MatTableDataSource<DTOWfStepParameterDoc>;
  @ViewChild(MatPaginator) paginatorDocs: MatPaginator;
  @ViewChild(MatSort) sortDocs: MatSort;

  constructor(private router: Router, private parameterService: ParameterService, private formBuilder: FormBuilder, public dialog: MatDialog,
    private foclaasoService: FoclaasoService, private fotipcreService: FotipcreService, private cladocService: CladocService
    , private countriesService: CountriesService, private deptosService: DeptosService, private citiesService: CitiesService,
    private fotabproService: FotabproService, private baentidadService: BaentidadService, private basTTipCtaService: BasTTipCtaService, private wfService: WfService) {
    this.o = new DTOWfParameter();

  }

  ngOnInit() {
    //   this.loading = true;
    this.initStep();
    this.crearFormulario();
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear - 2, 12, 31);
    this.isCodeudor = true;
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

    //  this.getSteps();

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
      nomTer: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      priApellido: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      segApellido: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      lugarDoc: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(20)]],
      mailTer: ['', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      dirTerpal: ['', [Validators.required]],
      telTer: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      telTer1: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      telTer2: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      paisCodigo: ['', [Validators.required]],
      codiDept: ['', [Validators.required]],
      codiCiud: ['', [Validators.required]],
      barrio: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      fecIngEmpresa: ['', [Validators.required]],
      antiEmpresa: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(1)]],
      fecCump: ['', [Validators.required]],
      tipVivienda: ['', [Validators.required]],
      dirTeralt: ['', [Validators.required]],
      barrioTra: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      paisDirTrabajo: ['', [Validators.required]],
      deptDirTrabajo: ['', [Validators.required]],
      codiciuDirTrabajoCiud: ['', [Validators.required]],
      faxTer: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      codProfe: ['', [Validators.required]],
      indContrato: ['', [Validators.required]],
      paramText: ['', [Validators.required]],
      entBan: ['', [Validators.required]],
      tipCta: ['', [Validators.required]],
      numCta: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      idConyuge: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
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
      bienNombre: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      bienValor: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(6)]],
      bienAfecta: ['', [Validators.required]],
      bienHipoteca: ['', [Validators.required]],
      bienHipAFavor: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehMarca: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehClase: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehModelo: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehPlaca: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehPignorado: ['', [Validators.required, Validators.required]],
      vehPigAFavor: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehValVomercial: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(6)]],

      doctip_codeu: ['', [Validators.required]],
      nitter_codeu: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      nomTer_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      priApellido_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      segApellido_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      lugarDoc_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(20)]],
      mailTer_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      dirTerpal_codeu: ['', [Validators.required]],
      telTer_codeu: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      feExp: ['', [Validators.required]],
      paisCodigo_codeu: ['', [Validators.required]],
      codiDept_codeu: ['', [Validators.required]],
      codiCiud_codeu: ['', [Validators.required]],
      barrio_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      antiEmpresa_codeu: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(2), Validators.minLength(1)]],
      tipVivienda_codeu: ['', [Validators.required]],
      dirTeralt_codeu: ['', [Validators.required]],
      barrioTra_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      paisDirTrabajo_codeu: ['', [Validators.required]],
      deptDirTrabajo_codeu: ['', [Validators.required]],
      codiciuDirTrabajoCiud_codeu: ['', [Validators.required]],
      faxTer_codeu: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      codProfe_codeu: ['', [Validators.required]],
      indContrato_codeu: ['', [Validators.required]],
      paramText_codeu: ['', [Validators.required]],
      idConyuge_codeu: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      nomCony_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      emailConyuge_codeu: ['', [Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      celConyuge_codeu: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      refNombre1_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refParen1_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refMail1_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      refCel1_codeu: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      refNombre2_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refParen2_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refMail2_codeu: ['', [Validators.required, Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      refCel2_codeu: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],
      refNombre3_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refParen3_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      refMail3_codeu: ['', [Validators.pattern(EXP_REGULAR_CORREO), Validators.maxLength(60)]],
      refCel3_codeu: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(11), Validators.minLength(6)]],

      bienNombre_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      bienValor_codeu: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(6)]],
      bienAfecta_codeu: ['', [Validators.required]],
      bienHipoteca_codeu: ['', [Validators.required]],
      bienHipAFavor_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehMarca_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehClase_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehModelo_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehPlaca_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehPignorado_codeu: ['', [Validators.required]],
      vehPigAFavor_codeu: ['', [Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(60)]],
      vehValVomercial_codeu: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(6)]],
      comments: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]],
    });

  }




  changeFormValidation = () => {
    for (const key in this.forma.controls) {
      this.forma.get(key).clearValidators();
      this.forma.get(key).updateValueAndValidity();
    }
    if (this.step.nextStep == "2") {
      this.forma.get('comments').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]);
      this.forma.get('comments').updateValueAndValidity();
    }
    if (this.step.nextStep == "3") {
      this.forma.get('comments').setValidators([Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(120)]);
      this.forma.get('comments').updateValueAndValidity();
    }
  }


  hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }



  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }



  getSteps() {

    /*   this.service.listStepById(this.o.id).subscribe(async (res: DTOWfStepParameter[]) => {
         this.listSteps = new Array<DTOWfStepParameter>();
         res.forEach(r => {
           this.listSteps.push(r);
         });
         this.dataSource = new MatTableDataSource(this.listSteps);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
         this.loading = false;
       }, error => {
         this.loading = false;
       });*/
  }

  actualizar(o?: DTOWfSteps) {
    let med = o != null ? o : new DTOWfSteps();
    this.step = med;
    this.showForm();
  }


  operarStep1() {
    console.log(this.step);
    if (!this.validarErroresCampos()) {
      this.loading = true;
      this.wfService.createStep(this.step).subscribe(data => {
        this.showMessage("Step Ingresado.");
        this.resetForm();
        this.loading = false;
        this.step = data as DTOWfSteps;
        this.step.comments='';
        this.changeFormValidation();
        this.sendEmail();
        
      }, error => {
        this.loading = false;
        this.showMessage(error.mensaje);
      });

    } else {
      this.showMessage("Algunos campos no cumplen las validaciones");
    }
  }

  sendEmail(){
    this.step.idStep="2";
    this.step.idSubStep="1";
    this.wfService.createStep(this.step).subscribe(data => {
      this.showMessage("Correo de  verificación remitido.");
    }, error => {
      this.loading = false;
      this.showMessage(error.mensaje);
    });
  }

  operarStep2() {
   
    if (!this.validarErroresCampos()) {
      this.loading = true;
        this.wfService.listById(this.step.numeroRadicacion).subscribe(data => {
          this.loading = false;
          if (data.estado != "4") {
            this.showMessage("Solicitar al usuario " + this.step.nitter + "que ingrese a la bandeja del correo " + this.step.mailTer + " y seleccione el enlace remitido para culminar el proceso de verificación");      
          } else {
            this.showMessage("Se ha realizado la verificación del correo "+ this.step.mailTer +" de forma Correcta.");
            this.step.nextStep = "3";
            this.resetForm();
            this.changeFormValidation();
          }    
        }, error => {
          this.loading = false;
          this.showMessage(error.mensaje);
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
    this.getEntities();
    this.getParameters();
    this.getTipoContrato();
    this.getFotipcre();
    this.getCladoc();
    this.getParametersPeriodicidad();
    this.getCountries();
    this.getFotabpro();
    this.getEps();
    this.getBaentidad();
    this.getAccountType();
    this.showFormAdd = true;
  }

  hideForm() {
    this.forma.reset;
    this.initStep();
    this.showFormAdd = false;
  }

  eliminarDialogo(o: DTOWfSteps): void {
    this.dialog
      .open(DialogConfirmationComponent, {
        width: '300px',
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.eliminar(o)
        }
      });
  }

  eliminar(o: DTOWfSteps) {
    /*  this.loading = true;
      this.service.deleteStep(o).subscribe(data => {
        this.getSteps();
        this.showMessage("Se elimino")
      }, error => {
        this.showMessage(error.error.mensaje)
      });*/
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

  getFotabpro() {
    this.fotabproService.listAll().subscribe(async (res: DTOFotabpro[]) => {
      this.listFotabpro = res;
      this.listFotabproCodeu = res;
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
      this.listCountriesJob = res;
      this.listCountriesDeu = res;
      this.listCountriesDeuJob = res;
      this.loading = false;
    }, error => {
      this.loading = false;
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
    this.clientCities(this.idPais, event.value, name);
  }

  onDeptosChangeJob(event, name: string) {
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
      }
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }

  initStep() {
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
