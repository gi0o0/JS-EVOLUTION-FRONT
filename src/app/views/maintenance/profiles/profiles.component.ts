import { Component, OnInit, ViewChild } from '@angular/core';

import { DTOProfile } from '../../../_model/DTOProfile';
import { ProfileService } from '../../../_services/profiles/profiles.service';
import { ProfileEditionComponent } from './profiles-edition/profile-edition.component';
import { ProfileOptionComponent } from './profiles-option/profile-option.component';
import { ProfileUserComponent } from './profiles-user/profile-user.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';



import { DialogConfirmationComponent } from "../../../_components/dialog-confirmation/dialog-confirmation.component";
import { DialogMessageComponent } from "../../../_components/dialog-message/dialog-message.component";

@Component({
  selector: 'app-dashboard',
  styleUrls: ['profiles.component.css'],
  templateUrl: 'profiles.component.html'
})
export class ProfilesComponent implements OnInit {

  public listaProfiles: DTOProfile[];
  loading: boolean = false;
  displayedColumns = ['id', 'NombrePerfil', 'action'];
  dataSource: MatTableDataSource<DTOProfile>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private profileService: ProfileService, public dialog: MatDialog,) { }

  ngOnInit() {

    this.loading = true;

    this.profileService.profileCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


    this.profileService.mensajeCambio.subscribe(data => {

      this.dialog.open(DialogMessageComponent, {
        width: '250px',
        data: data
      });

    });

    this.getProfiles();
    
  }


  getProfiles() {
    this.profileService.listAll().subscribe(async (responseMatriculas: DTOProfile[]) => {
      this.listaProfiles = new Array<DTOProfile>();
      responseMatriculas.forEach(matricula => {
        this.listaProfiles.push(matricula);
      });

      this.dataSource = new MatTableDataSource(this.listaProfiles);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    },error => {
         this.loading = false;
          this.profileService.mensajeCambio.next(error.error.mensaje);
        });;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(profile?: DTOProfile) {
    let med = profile != null ? profile : new DTOProfile();
    this.dialog.open(ProfileEditionComponent, {
      width: '300px',
      data: med
    });
  }

  eliminar(profile: DTOProfile) {
    this.loading = true;
    this.profileService.delete(profile.id).subscribe(data => {
      this.profileService.listAll().subscribe(profiles => {
        this.profileService.profileCambio.next(profiles);
        this.loading = false;
        this.profileService.mensajeCambio.next("Se elimino");

      });
    }, error => {
      this.loading = false;
      this.dialog.open(DialogMessageComponent, {
        width: '300px',
        data: error.error.mensaje
      });
    });
  }

  mostrarDialogo(profile: DTOProfile): void {
    this.dialog
      .open(DialogConfirmationComponent, {
        width: '300px',
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.eliminar(profile)
        }
      });
  }

  mostrarDialogoOption(profile: DTOProfile): void {
    let med = profile != null ? profile : new DTOProfile();
    this.dialog.open(ProfileOptionComponent, {
      width: '500px',
      data: med
    });
  }

  mostrarDialogoUser(profile: DTOProfile): void {
    let med = profile != null ? profile : new DTOProfile();
    this.dialog.open(ProfileUserComponent, {
      width: '500px',
      data: med
    });
  }

}
