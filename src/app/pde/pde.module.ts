import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PlotlyModule } from "angular-plotly.js";
import { LayoutModule } from "../layout/layout.module";
import { MathCommonModule } from "../math-common/math-common.module";
import { SharedModule } from "../shared/shared.module";
import { LineComponent } from "./line/line.component";
import { PdeRoutingModule } from "./pde-routing.module";
import { PdeWrapperComponent } from "./pde-wrapper/pde-wrapper.component";
import { ThreeDSurfaceComponent } from "./three-d-surface/three-d-surface.component";
import { VectorPlotComponent } from "./vector-plot/vector-plot.component";

@NgModule({
  declarations: [
    PdeWrapperComponent,
    ThreeDSurfaceComponent,
    LineComponent,
    VectorPlotComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlotlyModule,
    PdeRoutingModule,
    MathCommonModule,
    // HighchartsModule,
    // KatexModule,
    // RouterModule,
    LayoutModule
  ],
  // providers: [{ provide: HighchartsConfig, useValue: config }]
})
export class PdeModule { }
