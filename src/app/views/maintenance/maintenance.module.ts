// Angular
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { NgModule } from '@angular/core';




// Components Routing
import { BaseRoutingModule } from './maintenance-routing.module';

import { MatIconRegistry } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ParameterComponent } from './parameter/parameter.component';
import { ParameterEditionComponent } from './parameter/parameter-edition/parameter-edition.component';

import { ProfilesComponent } from './profiles/profiles.component';
import { ProfileEditionComponent } from './profiles/profiles-edition/profile-edition.component';
import { ProfileOptionComponent } from './profiles/profiles-option/profile-option.component';
import { ProfileUserComponent } from './profiles/profiles-user/profile-user.component';
import { DialogConfirmationComponent } from "../../_components/dialog-confirmation/dialog-confirmation.component"
import { DialogMessageComponent } from "../../_components/dialog-message/dialog-message.component";
import { ProgressSpinnerComponent } from '../../_components/progress-spinner/progress-spinner.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    BaseRoutingModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  declarations: [
    ParameterComponent,
    ParameterEditionComponent,
    ProfilesComponent,
    ProfileEditionComponent,
    ProfileOptionComponent,
    ProfileUserComponent,
    DialogConfirmationComponent,
    DialogMessageComponent,
    ProgressSpinnerComponent,
  ]
})
export class BaseModule { }
