import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PlotlyModule } from "angular-plotly.js";
import { NzSelectModule } from "ng-zorro-antd/select";
import { LayoutModule } from "../layout/layout.module";
import { MathCommonModule } from "../math-common/math-common.module";
import { SharedModule } from "../shared/shared.module";
import { MdRoutingModule } from "./md-routing.module";
import { MdWrapperComponent } from "./md-wrapper/md-wrapper.component";

@NgModule({
  declarations: [MdWrapperComponent],
  imports: [
    CommonModule,
    SharedModule,
    PlotlyModule,
    NzSelectModule,
    MdRoutingModule,
    LayoutModule,
    MathCommonModule
  ]
})
export class MdModule {}
