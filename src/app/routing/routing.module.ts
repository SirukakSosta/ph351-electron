import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './routes';


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
