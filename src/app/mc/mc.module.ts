import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PlotlyModule } from "angular-plotly.js";
import { NzSelectModule } from "ng-zorro-antd/select";
import { LayoutModule } from "../layout/layout.module";
import { MathCommonModule } from "../math-common/math-common.module";
import { SharedModule } from "../shared/shared.module";
import { McRoutingModule } from "./mc-routing.module";
import { McWrapperComponent } from "./mc-wrapper/mc-wrapper.component";

@NgModule({
  declarations: [McWrapperComponent],
  imports: [
    CommonModule,
    SharedModule,
    PlotlyModule,
    NzSelectModule,
    McRoutingModule,
    LayoutModule,
    MathCommonModule
  ]
})
export class MdModule {}
