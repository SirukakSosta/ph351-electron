import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LayoutModule } from "../layout/layout.module";
import { MathCommonModule } from "../math-common/math-common.module";
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

    LayoutModule,
    MathCommonModule


  ],
})
export class EdModule { }
