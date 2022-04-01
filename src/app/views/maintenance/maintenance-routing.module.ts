import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilesComponent } from './profiles/profiles.component';
import { ParameterComponent } from './parameter/parameter.component';
import { EconomicsectorComponent } from './economicsector/economicsector.component';

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

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
