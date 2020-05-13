import { Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import { McCoreService } from "../mc-core.service";

@Component({
  selector: "app-mc-wrapper",
  templateUrl: "./mc-wrapper.component.html",
  styleUrls: ["./mc-wrapper.component.scss"],
})
export class McWrapperComponent implements OnInit {

  isCollapsed = false;
  constructor(public service: McCoreService, public plotly: PlotlyService) { }

  ngOnInit() {
     

  } 

}
