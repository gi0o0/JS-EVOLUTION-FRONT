import { Component, OnInit, Inject } from '@angular/core';
import { DTOProfile } from '../../../../_model/DTOProfile';
import { ProfileService } from '../../../../_services/profiles/profiles.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialogo',
  templateUrl: './profile-edition.component.html',
  styleUrls: ['./profile-edition.component.css']
})
export class ProfileEditionComponent implements OnInit {

  profile: DTOProfile;
  loading: boolean = false;

  constructor(private dialogRef: MatDialogRef<ProfileEditionComponent>, @Inject(MAT_DIALOG_DATA) private data: DTOProfile, private profileService: ProfileService) { }


  ngOnInit() {
    this.profile = new DTOProfile();
    this.profile.id = this.data.id;
    this.profile.name = this.data.name;
  }

  cancelar() {
    this.dialogRef.close();
  }

  operar() {
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
