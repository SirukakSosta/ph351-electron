import { Component, OnInit } from "@angular/core";
import { EdLabService } from "../ed-lab.service";
import { EdCoreService } from "../ed-core.service";

@Component({
  selector: "app-ed-wrapper",
  templateUrl: "./ed-wrapper.component.html",
  styleUrls: ["./ed-wrapper.component.scss"]
})
export class EdWrapperComponent implements OnInit {
  // todo
  // play with https://github.com/sasekazu/visualize-jacobi-diagonalization/blob/master/js/main.js
  data: any;
  layout: any;
  dataHist: any;
  constructor(
    // private lab: EdLabService,
    private _edCoreService: EdCoreService
  ) {}

  ngOnInit(): void {
    // this.lab.diagonalize()
    const d = this._edCoreService.start();
    var trace1 = {
      x: [],
      y: [],
      mode: "lines+markers",
      name: "Scatter + Lines"
    };
    d.forEach(item => {
      trace1.x.push(item.time);
      trace1.y.push(item.mag);
    });
    let customWidth = 800;
    console.log(d);
    var data = [trace1];
    var layout = {
      width: customWidth,
      title: "Adding Names to Line and Scatter Plot"
    };
    this.data = data;
    this.layout = layout;
    this.dataHist = [
      {
        ...trace1,
        type: "histogram2d",
        histnorm: "probability",
        autobinx: false,
        autobiny: false,
        xbins: {
          start: 0,
          end: 10,
          size: 0.01
        },
        ybins: {
          start: 0,
          end: 1,
          size: 0.1
        }
      }
    ];
  }
}
