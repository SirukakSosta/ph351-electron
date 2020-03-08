import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PlotlyModule } from "angular-plotly.js";
import { HomeRoutingModule } from "./home-routing.module";

import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";
import { LoadingComponent } from "../components/loading/loading.component";

@NgModule({
  declarations: [HomeComponent, LoadingComponent],
  imports: [CommonModule, SharedModule, PlotlyModule, HomeRoutingModule]
})
export class HomeModule {}
