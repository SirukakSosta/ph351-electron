import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PlotlyModule } from "angular-plotly.js";
import { HomeRoutingModule } from "./home-routing.module";

import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";
import { LoadingComponent } from "../components/loading/loading.component";
import { ThreeDSurfaceComponent } from "./three-d-surface/three-d-surface.component";
import { LineComponent } from "./line/line.component";
import { VectorPlotComponent } from "./vector-plot/vector-plot.component";
import { KatexModule } from "ng-katex";
import {
  HighchartsConfig,
  HighchartsModule
} from "@howtimeflies/ngx-highcharts";
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
    LoadingComponent,
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
    KatexModule
  ],
  providers: [{ provide: HighchartsConfig, useValue: config }]
})
export class HomeModule {}
