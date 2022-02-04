import { Component, OnInit, ViewChild } from '@angular/core';

import { DTOProfile } from '../../../_model/DTOProfile';
import { ProfileService } from '../../../_services/profiles/profiles.service';
import { ProfileEditionComponent } from './profiles-edition/profile-edition.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dashboard',
  styleUrls: ['profiles.component.css'],
  templateUrl: 'profiles.component.html'
})
export class ProfilesComponent implements OnInit {

  public listaProfiles: DTOProfile[];

  displayedColumns = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<DTOProfile>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private profileService: ProfileService, private snackBar: MatSnackBar, public dialog: MatDialog,) { }

  ngOnInit() {

    this.profileService.profileCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


    this.profileService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'Aviso', { duration: 4000  ,verticalPosition: 'top'});
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

    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(profile?: DTOProfile) {
    let med = profile != null ? profile : new DTOProfile();
    this.dialog.open(ProfileEditionComponent, {
      width: '250px',
      data: med
    });
  }

  eliminar(profile: DTOProfile) {
    this.profileService.delete(profile.id).subscribe(data => {
      this.profileService.listAll().subscribe(profiles => {
        this.profileService.profileCambio.next(profiles);
        this.profileService.mensajeCambio.next("Se elimino");
      });
    });
  }

}
