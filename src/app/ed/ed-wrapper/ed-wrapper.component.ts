import { Component, OnInit } from "@angular/core";
import { EdLabService } from "../ed-lab.service";
import { EdCoreService } from "../tight-binding-model/ed-core.service";
import { Chart, Options } from "highcharts";
import { N } from "../tight-binding-model/defaults";

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
  public chart: Chart;
  threeDdata: any;
  threeDlayout: any;
  data: any;
  edData: any;
  layout: any;
  dataHist: any;
  listOfOption: Array<{ label: string; value: number }> = [];
  singleValue = 0;
  public options: Options = {
    chart: {
      height: 600,
      type: "column",
      spacingBottom: 30,
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 1000,
        viewDistance: 25
      }
    },
    title: {
      text: "Electric Field"
    },
    // legend: {
    //   layout: "vertical",
    //   align: "left",
    //   verticalAlign: "top",
    //   x: 150,
    //   y: 100,
    //   floating: true,
    //   borderWidth: 1
    // },
    // xAxis: {
    //   min: 0,
    //   max: 1,
    //   title: {
    //     text: "x"
    //     //align: 'center'
    //   }
    // },
    // yAxis: {
    //   min: 0,
    //   max: 1,
    //   title: {
    //     text: "y"
    //   }
    // },
    plotOptions: {
      area: {
        fillOpacity: 0.5
      }
    },
    credits: {
      enabled: false
    },
    series: []
  };
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
    console.log("finaldata", states);
    this.edData = states;
    const time = states.time;
    const space = states.space;
    let traces = [];
    for (let row = 0; row < states.propabilities.length; row++) {
      let trace = {
        x: space,
        y: states.propabilities[row],
        marker: {
          size: 1
        },
        mode: "lines+markers",
        name: `time - (${time[row]})`
      };
      traces.push(trace);
    }

    this.data = [...traces];
    this.layout = {
      width: 1600,
      title: `Propability Time evolution`
    };
  }
  selectNewData(index) {
    this.data = [this.traces[index]];
    this.layout.title = `Propability Time evolution for state ${index + 1}`;
  }
  public onLoad(evt) {
    this.chart = evt.chart;
    console.log("ON LOAD");
    this.chart.series = [];

    // if (this.chart.get("series-a")) {
    //   this.chart.get("series-a").remove();
    // }
    for (let row = 0; row < this.edData.propabilities.length; row++) {
      console.log(row);
      // for each time we have 1 row of propabilities
      let data = [];
      const time = this.edData.time[row];
      for (let prop = 0; prop < N; prop++) {
        const space = this.edData.space[prop];
        const propability = this.edData.propabilities[row][prop];
        data.push([space, propability, time]);
      }
      this.chart.addSeries({
        type: "scatter",
        turboThreshold: 0,
        lineWidth: 2,
        data
      });
    }

    console.log("data to plot", this.chart);
    // this.chart.redraw()
  }
}
