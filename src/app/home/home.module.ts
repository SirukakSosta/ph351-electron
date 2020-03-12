import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HighchartsConfig, HighchartsModule } from "@howtimeflies/ngx-highcharts";
import { PlotlyModule } from "angular-plotly.js";
import { KatexModule } from "ng-katex";
import { LayoutModule } from "../layout/layout.module";
import { SharedModule } from "../shared/shared.module";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { LineComponent } from "./line/line.component";
import { ThreeDSurfaceComponent } from "./three-d-surface/three-d-surface.component";
import { VectorPlotComponent } from "./vector-plot/vector-plot.component";
const config: HighchartsConfig = {
  cdnBaseUrl: "https://code.highcharts.com",
  scriptName: "highcharts.js", 
  delayToExecuteModulesCode: 200,
  maxDelayToResizeContainer: 10000,
  globalOptions: {
    lang: {
      drillUpText: "Drill-Up"
    }
  }
};

@NgModule({
  declarations: [
    HomeComponent,
    ThreeDSurfaceComponent,
    LineComponent,
    VectorPlotComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlotlyModule,
    HomeRoutingModule,
    HighchartsModule,
    KatexModule,
    LayoutModule
  ],
  providers: [{ provide: HighchartsConfig, useValue: config }]
})
export class HomeModule {}
