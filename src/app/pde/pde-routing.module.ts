import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdeComponent } from './pde.component';

const routes: Routes = [
  {
    path: 'eq/:am',
    component: PdeComponent
  },
  {
    path: '',
    component: PdeComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: []
})
export class PdeRoutingModule { }
