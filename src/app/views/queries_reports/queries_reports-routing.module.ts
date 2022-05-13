import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocsComponent } from './docs/docs.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'queries_reports'
    },
    children: [
      {
        path: '',
        redirectTo: 'docs'
      },
      {
        path: 'docs',
        component: DocsComponent,
        data: {
          title: 'Docs'
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
