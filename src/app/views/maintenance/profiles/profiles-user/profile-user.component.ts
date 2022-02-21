import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { DTOProfile } from '../../../../_model/DTOProfile';
import { UserService } from '../../../../_services/user/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { DTOUser } from '../../../../_model/DTOUser';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-dialogo',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {

  profile: DTOProfile;
  profileUser: DTOUser;

  public listUser: DTOUser[];
  displayedColumns = ['user','name', 'select'];

  dataSource: MatTableDataSource<DTOUser>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  idSystem: string;
  loading: boolean = false;


  constructor(private dialogRef: MatDialogRef<ProfileUserComponent>, @Inject(MAT_DIALOG_DATA) private data: DTOProfile,
    private userService: UserService) { }


  ngOnInit() {
    this.loading = true;
    this.profile = new DTOProfile();
    this.profile.id = this.data.id;
    this.profile.name = this.data.name;

    this.getUsers();

  }

  applyFilter(value: string) {
     this.dataSource.filter = value.trim().toLocaleLowerCase();;
  }


  getUsers() {
    this.userService.listAll().subscribe(async (res: DTOUser[]) => {
      this.listUser = new Array<DTOUser>();
      res.forEach(r => {
        r.checkedProfile = (this.profile.id + "" == r.idProfile)
        this.listUser.push(r);
      });
      this.dataSource = new MatTableDataSource(this.listUser);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  changeChkState(id) {

    this.loading = true;
    this.listUser.forEach(chk => {
      if (chk.id === id) {

        var checkedProfile = !chk.checkedProfile;
        this.profileUser = new DTOUser();
        this.profileUser.id = id;
        if (checkedProfile) {

          this.profileUser.idProfile = this.profile.id + "";
          this.userService.updateProfile(this.profileUser).subscribe(data => {
            this.getUsers();
            this.loading = false;
          }, error => {
            this.loading = false;
            console.log(error.error.mensaje);
          });
        } else {
          this.profileUser.idProfile = "0";

          this.userService.updateProfile(this.profileUser).subscribe(data => {
            this.getUsers();
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
