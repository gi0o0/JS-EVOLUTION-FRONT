import { Component, OnInit, Inject } from '@angular/core';
import { DTOProfile } from '../../../../_model/DTOProfile';
import { SystemService } from '../../../../_services/system/system.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { DTOSystem } from '../../../../_model/DTOSystem';
import { DTOOption } from '../../../../_model/DTOOption';
import { DTOOptionRole } from '../../../../_model/DTOOptionRole';


@Component({
  selector: 'app-dialogo',
  templateUrl: './profile-option.component.html',
  styleUrls: ['./profile-option.component.css']
})
export class ProfileOptionComponent implements OnInit {

  profile: DTOProfile;
  optionRole: DTOOptionRole;
  public listSystem: DTOSystem[];
  public listOption: DTOOption[];
  displayedColumns = ['name', 'select'];
  idSystem: string;
  loading: boolean = false;


  constructor(private dialogRef: MatDialogRef<ProfileOptionComponent>, @Inject(MAT_DIALOG_DATA) private data: DTOProfile,
  private systemService: SystemService) { }


  ngOnInit() {
    this.loading = true;
    this.profile = new DTOProfile();
    this.profile.id = this.data.id;
    this.profile.name = this.data.name;

    this.getSystems();

  }


  getSystems() {
    this.systemService.listAll().subscribe(async (res: DTOSystem[]) => {
      this.listSystem = new Array<DTOSystem>();
      res.forEach(r => {
        this.listSystem.push(r);
      });
      this.loading = false;
    },error => {
      this.loading = false;
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  onSystemChange(event) {
    this.loading = true;
    this.idSystem = event.value.id
    this.systemService.listOptionByRoleAndSystem(this.profile.id + "", this.idSystem).subscribe(async (res: DTOOption[]) => {
      this.listOption = new Array<DTOOption>();
      res.forEach(r => {
        r.checked = (r.enabled == "true")
        this.listOption.push(r);
      });
      this.loading = false;
    }, error => {
      this.loading = false;
    });

  }

  changeChkState(id) {

    this.loading = true;
    this.listOption.forEach(chk => {
      if (chk.id === id) {

        var checked = !chk.checked;

        if (checked) {
          this.optionRole = new DTOOptionRole();
          this.optionRole.idOption = id;
          this.optionRole.idRole = this.profile.id + "";
          this.systemService.createOption(this.optionRole).subscribe(data => {
            this.getSystems();
            this.loading = false;
          }, error => {
            this.loading = false;
            console.log(error.error.mensaje);
          });
        }else{
          this.systemService.deleteOption(this.profile.id + "",id).subscribe(data => {
            this.getSystems();
            this.loading = false;
          }, error => {
            this.loading = false;
            console.log(error.error.mensaje);
          });
        }


      }
    });
  }


}
