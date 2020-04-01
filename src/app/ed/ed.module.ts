import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LayoutModule } from "../layout/layout.module";
import { MathCommonModule } from "../math-common/math-common.module";
import { SharedModule } from "../shared/shared.module";
import { EdRoutingModule } from "./ed-routing.module";
import { EdWrapperComponent } from "./ed-wrapper/ed-wrapper.component";
import { PlotlyModule } from "angular-plotly.js";
import { NzSelectModule } from "ng-zorro-antd/select";

@NgModule({
  declarations: [EdWrapperComponent],
  imports: [
    CommonModule,
    SharedModule,
    PlotlyModule,
    NzSelectModule,
    EdRoutingModule,

    LayoutModule,
    MathCommonModule
  ]
})
export class EdModule {}
