import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DTOWfStepParameter } from '../../../../_model/DTOWfStepParameter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO, EXP_REGULAR_NUMERO, EXP_REGULAR_NUMERO_MIN_8_MAX_11 } from '../../../../_shared/constantes';
import { DialogConfirmationComponent } from "../../../../_components/dialog-confirmation/dialog-confirmation.component";
import { DialogMessageComponent } from "../../../../_components/dialog-message/dialog-message.component";
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../../_services/user/user.service';
import { DTOUser } from '../../../../_model/DTOUser';
import { ProfileService } from '../../../../_services/profiles/profiles.service';
import { DTOProfile } from '../../../../_model/DTOProfile';
import { DTOTercero } from '../../../../_model/DTOTercero';

@Component({
  selector: 'app-dialogo',
  templateUrl: './profiles-user-add.component.html',
  styleUrls: ['./profiles-user-add.component.css']
})
export class ProfilesUserAddComponent implements OnInit {

  o: DTOUser;
  forma: FormGroup;
  @ViewChild('regForm', { static: false }) myForm: NgForm;
  errorServicio: boolean;
  listUsers: DTOUser[];
  listProfiles: DTOProfile[];
  loading: boolean = false;
  isTerceroUser: boolean = false;
  showFormAdd: boolean = false;
  isUpdate: boolean = false;
  displayedColumns = ['usuario', 'nombre', 'perfil', 'action'];

  dataSource: MatTableDataSource<DTOUser>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private router: Router, private service: UserService, private serviceProfile: ProfileService, private formBuilder: FormBuilder, public dialog: MatDialog,) {
    this.cleanObjest();
    this.crearFormulario();
  }

  ngOnInit() {
    this.getUsers();
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      id: ['', [Validators.required, Validators.pattern(EXP_REGULAR_NUMERO), Validators.pattern(EXP_REGULAR_NUMERO_MIN_8_MAX_11)]],
      name: ['', [Validators.required, Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(100)]],
      perfil: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
  }

  hasError = (controlName: string, errorName: string) => {
    return this.forma.controls[controlName].hasError(errorName);
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }

  getUsers() {
    this.loading = true;
    this.service.listAll().subscribe(async (res: DTOUser[]) => {
      this.listUsers = res;
      this.dataSource = new MatTableDataSource(this.listUsers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  sync() {
    this.loading = true;
    this.service.sync().subscribe(async (res: DTOUser[]) => {
      this.getUsers();
      this.loading = false;
      this.showMessage("Proceso Terminado");
    }, error => {
      this.showMessage(error.error.mensaje);
    });
  }

  

  getProfiles() {
    this.loading = true;
    this.serviceProfile.listAll().subscribe(async (res: DTOProfile[]) => {
      this.listProfiles = res;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  onSearchUser(user: number): void {
    const isValidUser = EXP_REGULAR_NUMERO_MIN_8_MAX_11.test(user + "");
    if (isValidUser) {
      this.loading = true;

      this.service.listUserTerceroByNitter(user).subscribe(async (res: DTOTercero) => {
        this.o.name = res.nomTercero + " " + res.priApellido + " " + res.segApellido;
        this.o.codTer = res.codTer;
        this.loading = false;
        this.isTerceroUser = true;
      }, error => {
        this.loading = false;
        this.showMessage(error.error.mensaje);
      });
    }
  }

  actualizar(o?: DTOUser) {
    let med = o != null ? o : new DTOUser();
    this.o = med;
    this.showForm();
    this.isTerceroUser = true;
    this.isUpdate=true;
  }


  operar() {
    if (!this.validarErroresCampos() && this.isTerceroUser) {
      this.executeService(this.o);
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

  returnToPage() {
    this.router.navigate(['maintenance/profiles']);
  }

  activeForm(){
    this.cleanObjest();
    this.showForm() ;
  }

  cleanObjest(){
    this.o = new DTOUser();
    this.o.estado = "0";
    this.isUpdate = false;
  }

  showForm() {
    this.getProfiles();
    this.showFormAdd = true;
  }

  hideForm() {
    this.forma.reset;
    this.showFormAdd = false;
  }

  eliminarDialogo(o: DTOUser): void {
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

  eliminar(o: DTOUser) {
    this.loading = true;
    o.estado="2";
    this.executeService(o);
  
  }

  executeService(o: DTOUser){
    this.loading = true;
    this.service.createUsuario(o).subscribe(data => {
      this.getUsers();
      this.showMessage("Usuario Modificado.");
      this.resetForm();
      this.showFormAdd = false;
      this.loading = false;
    }, error => {
      this.showMessage(error.error.mensaje);
      this.resetForm();
      this.loading = false;
    });
  }


  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message
    });
  }


}
