import { Component, OnInit, Inject } from '@angular/core';
import { DTOProfile } from '../../../../_model/DTOProfile';
import { ProfileService } from '../../../../_services/profiles/profiles.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXP_REGULAR_ALFANUMERICO} from '../../../../_shared/constantes';


@Component({
  selector: 'app-dialogo',
  templateUrl: './profile-edition.component.html',
  styleUrls: ['./profile-edition.component.css']
})
export class ProfileEditionComponent implements OnInit {

  profile: DTOProfile;
  loading: boolean = false;
  public forma: FormGroup;
  constructor(private dialogRef: MatDialogRef<ProfileEditionComponent>, @Inject(MAT_DIALOG_DATA) private data: DTOProfile, 
  private profileService: ProfileService,private formBuilder: FormBuilder) { 

    this.crearFormulario();
  }
  public errorServicio: boolean;

  ngOnInit() {
    this.profile = new DTOProfile();
    this.profile.id = this.data.id;
    this.profile.name = this.data.name;
    this.errorServicio = false;
  }

  cancelar() {
    this.dialogRef.close();
  }

  crearFormulario = () => {
    this.forma = this.formBuilder.group({
      name: ['', [Validators.required,Validators.pattern(EXP_REGULAR_ALFANUMERICO), Validators.maxLength(15)]]
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.forma.controls[controlName].hasError(errorName);
  }

  operar() {
    if (!this.validarErroresCampos()) {
    this.loading = true;
    if (this.profile != null && this.profile.id > 0) {
      this.profileService.update(this.profile).subscribe(data => {
        this.profileService.listAll().subscribe(profiles => {
          this.profileService.profileCambio.next(profiles);
          this.loading = false;
          this.profileService.mensajeCambio.next("Se modifico");
          this.dialogRef.close();
        });
      }, error => {
        this.loading = false;
        this.profileService.mensajeCambio.next(error.error.mensaje);
        this.dialogRef.close();
      });
    } else {
      this.profileService.create(this.profile).subscribe(data => {
        this.profileService.listAll().subscribe(profiles => {
          this.profileService.profileCambio.next(profiles);
          this.loading = false;
          this.profileService.mensajeCambio.next("Se registro");
          this.dialogRef.close();
        });
      }, error => {
       this.loading = false;
        this.profileService.mensajeCambio.next(error.error.mensaje);
        this.dialogRef.close();
      });
    }
  }

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

  mensajeErrorServicio = () => {
    return this.errorServicio;
  }

}
