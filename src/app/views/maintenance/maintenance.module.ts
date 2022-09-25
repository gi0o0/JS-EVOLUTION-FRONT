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
import { MatTableExporterModule } from 'mat-table-exporter';

import { ParameterComponent } from './parameter/parameter.component';
import { ParameterEditionComponent } from './parameter/parameter-edition/parameter-edition.component';

import { WfParameterComponent } from './wfparameter/wfparameter.component';
import { WfParameterStepComponent } from './wfparameter/wfparameter-step/wfparameter-step.component';
import { WfParameterStateComponent } from './wfparameter/wfparameter-state/wfparameter-state.component';
import { WfParameterStepDocComponent } from './wfparameter/wfparameter-step-doc/wfparameter-step-doc.component';
import { WfParameterStepUserComponent } from './wfparameter/wfparameter-step-user/wfparameter-step-user.component';

import { ProfilesComponent } from './profiles/profiles.component';
import { ProfileEditionComponent } from './profiles/profiles-edition/profile-edition.component';
import { ProfileOptionComponent } from './profiles/profiles-option/profile-option.component';
import { ProfileUserComponent } from './profiles/profiles-user/profile-user.component';
import { EconomicsectorComponent } from './economicsector/economicsector.component';
import { EconomicsectorEditionComponent } from './economicsector/economicsector-edition/economicsector-edition.component';

import { SharedModule } from '../sharedModule/shared.module';


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
    MatFormFieldModule,
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
    MatTableExporterModule,

    SharedModule
  ],
  declarations: [
    ParameterComponent,
    ParameterEditionComponent,
    ProfilesComponent,
    ProfileEditionComponent,
    ProfileOptionComponent,
    ProfileUserComponent,

    EconomicsectorComponent,
    EconomicsectorEditionComponent,
    WfParameterComponent,
    WfParameterStepComponent,
    WfParameterStateComponent,
    WfParameterStepDocComponent,
    WfParameterStepUserComponent
  ],
  
})
export class BaseModule { }


