// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components Routing
import { BaseRoutingModule } from './request-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { CreditComponent } from './credit/credit.component';

import { Step1Component } from './credit/step1/step1.component';
import { Step2Component } from './credit/step2/step2.component';
import { Step3Component } from './credit/step3/step3.component';
import { Step4Component } from './credit/step4/step4.component';
import { Step5Component } from './credit/step5/step5.component';
import { Step6Component } from './credit/step6/step6.component';
import { Step7Component } from './credit/step7/step7.component';
import { Step8Component } from './credit/step8/step8.component';



import { SharedModule } from '../sharedModule/shared.module';
import { CreditSearchComponent } from './creditsearch/creditsearch.component';
import { CreditStateComponent } from './creditstate/creditstate.component';
import { CreditChangeStateComponent } from './creditstate/credit-change_state/credit-change_state.component';
import { PqrComponent } from './pqr/pqr.component';
import { Step1PqrComponent } from './pqr/step1/step1.component';
import { PqrWfComponent } from './pqr/pqr-wf/pqr-wf.component';
import { Step2PqrComponent } from './pqr/step2/step2.component';
import { Step3PqrComponent } from './pqr/step3/step3.component';
import { Step4PqrComponent } from './pqr/step4/step4.component';
import { Step5PqrComponent } from './pqr/step5/step5.component';
import { CreditEditComponent } from './credit/credit-edit/credit-edit.component';
import { PqrEditComponent } from './pqr/credit-edit/credit-edit.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    CreditComponent,
    CreditSearchComponent,
    CreditStateComponent,
    PqrComponent,
    Step1Component,
    Step1PqrComponent,
    Step2PqrComponent,
    Step3PqrComponent,
    Step4PqrComponent,
    Step5PqrComponent,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component,
    Step7Component,
    Step8Component,
    CreditChangeStateComponent,
    CreditEditComponent,
    PqrEditComponent,
    PqrWfComponent
  ]
  
})
export class BaseModule { }

