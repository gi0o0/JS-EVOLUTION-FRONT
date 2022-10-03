import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilesComponent } from './profiles/profiles.component';
import { ParameterComponent } from './parameter/parameter.component';
import { EconomicsectorComponent } from './economicsector/economicsector.component';
import { WfParameterComponent } from './wfparameter/wfparameter.component';
import { WfParameterStepComponent } from './wfparameter/wfparameter-step/wfparameter-step.component';
import { WfParameterStateComponent } from './wfparameter/wfparameter-state/wfparameter-state.component';
import { ProfilesUserAddComponent } from './profiles/profiles-user-add/profiles-user-add.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Maintenance'
    },
    children: [
      {
        path: '',
        redirectTo: 'profiles'
      },
      {
        path: 'profiles',
        component: ProfilesComponent,
        data: {
          title: 'Profiles'
        }
      },
      {
        path: 'profilesuseradd',
        component: ProfilesUserAddComponent,
        data: {
          title: 'ProfilesUserAdd'
        }
      },
      {
        path: 'parameter',
        component: ParameterComponent,
        data: {
          title: 'Parameters'
        }
      },
      {
        path: 'economicsector',
        component: EconomicsectorComponent,
        data: {
          title: 'Economicsector'
        }
      },
      {
        path: 'wfparameter',
        component: WfParameterComponent,
        data: {
          title: 'WFParameter'
        }
      },
      {
        path: 'wfparameterstep',
        component: WfParameterStepComponent,
        data: {
          title: 'WFParameterstep'
        }
      },
      {
        path: 'wfparameterstate',
        component: WfParameterStateComponent,
        data: {
          title: 'WFParameterstate'
        }
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
