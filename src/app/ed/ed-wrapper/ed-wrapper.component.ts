import { Component, OnInit } from "@angular/core";
import { EdLabService } from "../ed-lab.service";
import { EdCoreService } from "../tight-binding-model/ed-core.service";

@Component({
  selector: "app-ed-wrapper",
  templateUrl: "./ed-wrapper.component.html",
  styleUrls: ["./ed-wrapper.component.scss"]
})
export class EdWrapperComponent implements OnInit {
  // todo
  // play with https://github.com/sasekazu/visualize-jacobi-diagonalization/blob/master/js/main.js
  states = [];
  traces = [];
  data: any;
  layout: any;
  dataHist: any;
  listOfOption: Array<{ label: string; value: number }> = [];
  singleValue = 0;
  constructor(
    // private lab: EdLabService,
    private _edCoreService: EdCoreService
  ) {}

  ngOnInit(): void {
    const children: Array<{
      label: string;
      value: number;
    }> = [];
    for (let i = 0; i < 10; i++) {
      children.push({
        label: `State - ${i + 1}`,
        value: i
      });
    }
    this.listOfOption = children;
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
    this.traces = traces;
    this.data = [traces[0]];
    this.layout = {
      width: 1600,
      title: `Propability Time evolution for state - 1`
    };
    setTimeout(() => {
      console.log("rerender");
    }, 5000);
  }
  selectNewData(index) {
    this.data = [this.traces[index]];
    this.layout.title = `Propability Time evolution for state ${index + 1}`;
  }
}
