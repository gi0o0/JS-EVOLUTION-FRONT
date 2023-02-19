import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditComponent } from './credit/credit.component';
import { CreditSearchComponent } from './creditsearch/creditsearch.component';
import { CreditStateComponent } from './creditstate/creditstate.component';



const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Request'
    },
    children: [
      {
        path: '',
        redirectTo: 'credit'
      },
      {
        path: 'credit',
        component: CreditComponent,
        data: {
          title: 'credit'
        }
      },
      {
        path: 'creditsearch',
        component: CreditSearchComponent,
        data: {
          title: 'creditsearch'
        }
      },
      {
        path: 'creditstate',
        component: CreditStateComponent,
        data: {
          title: 'creditstate'
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
