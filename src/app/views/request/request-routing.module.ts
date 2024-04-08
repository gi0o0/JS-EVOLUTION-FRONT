import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditComponent } from './credit/credit.component';
import { CreditSearchComponent } from './creditsearch/creditsearch.component';
import { CreditStateComponent } from './creditstate/creditstate.component';
import { PqrComponent } from './pqr/pqr.component';
import { PqrSearchComponent } from './pqrsearch/pqrsearch.component';
import { PortfolioSearchComponent } from './portfoliosearch/portfoliosearch.component';


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
        path: 'pqrsearch',
        component: PqrSearchComponent,
        data: {
          title: 'creditsearch'
        }
      },
      {
        path: 'portfoliosearch',
        component: PortfolioSearchComponent,
        data: {
          title: 'portfoliosearch'
        }
      },
      {
        path: 'creditstate',
        component: CreditStateComponent,
        data: {
          title: 'creditstate'
        }
      },
      {
        path: 'pqr',
        component: PqrComponent,
        data: {
          title: 'pqr'
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
