import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PlotlyModule } from "angular-plotly.js";
import { HomeRoutingModule } from "./home-routing.module";

import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";
import { LoadingComponent } from "../components/loading/loading.component";
import { ThreeDSurfaceComponent } from './three-d-surface/three-d-surface.component';
import { LineComponent } from './line/line.component';

@NgModule({
  declarations: [HomeComponent, LoadingComponent, ThreeDSurfaceComponent, LineComponent],
  imports: [CommonModule, SharedModule, PlotlyModule, HomeRoutingModule]
})
export class HomeModule {}
