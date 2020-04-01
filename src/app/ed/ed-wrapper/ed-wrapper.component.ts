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
  states = [];
  data: any;
  layout: any;
  dataHist: any;
  constructor(
    // private lab: EdLabService,
    private _edCoreService: EdCoreService
  ) {}

  ngOnInit(): void {
    // this.lab.diagonalize()
    const states = this._edCoreService.start();
    // states.forEach((state, index) => {
    //   let trace1 = {
    //     x: [],
    //     y: [],
    //     mode: "lines+markers",
    //     name: "Scatter + Lines"
    //   };
    //   state.forEach(item => {
    //     trace1.x.push(item.time);
    //     trace1.y.push(item.mag);
    //   });
    //   let customWidth = 600;
    //   var data = [trace1];
    //   var layout = {
    //     width: customWidth,
    //     title: `Propability Time evolution for state ${index + 1}`
    //   };
    //   this.states.push({ data, layout });
    // });
    let traces = [];
    states.forEach((state, index) => {
      let trace1 = {
        x: [],
        y: [],
        marker: {
          size: 1
        },
        mode: "lines+markers",
        name: `Status - (${index + 1})`
      };

      trace1.x = state.map(s => s.time);
      trace1.y = state.map(k => k.mag);
      traces.push(trace1);
    });
    console.log(traces);
    this.data = traces;
    this.layout = {
      width: 1600,
      title: `Propability Time evolution for state`
    };
  }
}
