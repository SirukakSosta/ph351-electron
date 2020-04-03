import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EdWrapperComponent } from './ed-wrapper/ed-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: EdWrapperComponent,

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
export class EdRoutingModule { }
