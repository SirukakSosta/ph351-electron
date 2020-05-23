import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MdWrapperComponent } from './md-wrapper/md-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: MdWrapperComponent,
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes),],
  exports: [RouterModule]
})
export class MdRoutingModule { }
