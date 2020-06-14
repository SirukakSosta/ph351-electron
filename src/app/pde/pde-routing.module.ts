import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LineComponent } from './line/line.component';
import { PdeWrapperComponent } from './pde-wrapper/pde-wrapper.component';
import { ThreeDSurfaceComponent } from './three-d-surface/three-d-surface.component';
import { VectorPlotComponent } from './vector-plot/vector-plot.component';

const routes: Routes = [
  {
    path: 'eq/:am',
    component: PdeWrapperComponent,
    children: [
      {
        path: 'potential-3d',
        component: ThreeDSurfaceComponent,
      },
      {
        path: 'potential-2d',
        component: LineComponent,
      }
      ,
      {
        path: 'electric-field',
        component: VectorPlotComponent,
      }, {
        path: 'potential-3d',
        redirectTo: '',
        pathMatch: 'full'
      },
      { path: '**', redirectTo: '' }
    ]
  },

  {
    path: '',
    component: PdeWrapperComponent
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
  exports: [RouterModule]
})
export class PdeRoutingModule { }
