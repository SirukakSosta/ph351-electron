import { Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import { createArrayWithRandomNumbers } from "../../math-common/method";
import { MdCoreService } from "../md-core.service";

@Component({
  selector: "app-md-wrapper",
  templateUrl: "./md-wrapper.component.html",
  styleUrls: ["./md-wrapper.component.scss"]
})
export class MdWrapperComponent implements OnInit {

  isCollapsed = false;

  constructor(public service: MdCoreService, public plotly: PlotlyService) { }


  ngOnInit(): void {


    const displacementInitialMatrix = createArrayWithRandomNumbers(10, 0, 1)
    console.log(displacementInitialMatrix)

  }

}
