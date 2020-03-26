import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "../layout/layout.module";
import { SharedModule } from "../shared/shared.module";
import { EdRoutingModule } from "./ed-routing.module";
import { EdWrapperComponent } from './ed-wrapper/ed-wrapper.component';


@NgModule({
  declarations: [

    EdWrapperComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    EdRoutingModule,


    RouterModule,
    LayoutModule
  ],
})
export class EdModule { }
