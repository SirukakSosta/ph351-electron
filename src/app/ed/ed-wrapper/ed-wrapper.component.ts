import { Component, OnInit } from "@angular/core";
import { Chart, Options } from "highcharts";
import { Observable } from "rxjs";
import { filter, map, startWith, tap } from "rxjs/operators";
import {
  TIME_END,
  TIME_START,
  TIME_STEP
} from "../tight-binding-model/defaults";
import {
  EdComputationWorkerEvent,
  EdCoreService
} from "../tight-binding-model/ed-core.service";
// const fs = require("fs");
interface extractedData {
  time: number;
  averageX: number;
  diaspora: number;
  propabilities: Array<number>;
}
@Component({
  selector: "app-ed-wrapper",
  templateUrl: "./ed-wrapper.component.html",
  styleUrls: ["./ed-wrapper.component.scss"]
})
export class EdWrapperComponent implements OnInit {
  // chart data observables
  diasporaData: Observable<any[]>;
  avgData: Observable<any[]>;

  // chart layouts
  avgLayout: any;
  diasporaLayout: any;
  options: Options = {
    chart: {
      // height: 600,
      type: "column",
      spacingBottom: 30,
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 1000,
        viewDistance: 25,
        fitToPlot: true
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

  containerWidth: number = 0;
  isCollapsed = false;
  // states = [];
  // traces = [];

  public chart: Chart;
  // threeDdata: any;
  // threeDlayout: any;
  // data: any;
  // edData: any;
  // layout: any;
  // dataHist: any;
  // listOfOption: Array<{ label: string; value: number }> = [];
  // singleValue = 0;

  // computational variables
  size = 100;
  timeStart = TIME_START;
  timeEnd = TIME_END;
  timeStep = TIME_STEP;

  progresses: Observable<number>[] = [];

  constructor(public _edCoreService: EdCoreService) {}

  ngOnInit(): void {
    this.containerWidth =
      document.getElementById("inner-content").offsetWidth - 500;

    // const children: Array<{ label: string; value: number; }> = [];

    // for (let i = 0; i < 10; i++) {
    //   children.push({
    //     label: `State - ${i + 1}`,
    //     value: i
    //   });
    // }
    // this.listOfOption = children;
    // this.lab.diagonalize()

    // let increment = 0;
    // let noError = true;
    // var t0 = performance.now();

    // this._edCoreService.start();

    // this._edCoreService.timeStepResultsAggregate$.pipe(
    //   // tap(e => console.log(e))
    // ).subscribe()

    // var t1 = performance.now();
    // console.log("Call to doSomething took " + (t1 - t0) * 0.001 + " seconds.");
    // // return;
    // while (noError) {
    //   // console.log("i run", increment);
    //   // fs.readFile(`./ed-data/time${increment}.json`, "utf-8", (err, data) => {
    //   //   if (err) {
    //   //     noError = false;
    //   //     return;
    //   //   }

    //   //   // Change how to handle the file content
    //   //   console.log("The file content is : ", <extractedData>JSON.parse(data));
    //   // });
    //   if (increment === 9) {
    //     noError = false;
    //   }
    //   increment++;
    // }

    // return;
    // console.log("finaldata", states);
    // this.edData = states;
    // const time = states.time;
    // const space = states.space;
    // // const avgX = states.avgX;
    // // const diaspora = states.diaspora;
    // let traces = [];
    // // plot 1 P(x,t)
    // for (let row = 0; row < states.propabilities.length; row++) {
    //   let trace = {
    //     x: space,
    //     y: states.propabilities[row],
    //     marker: {
    //       size: 1
    //     },
    //     mode: "lines+markers",
    //     name: `time - (${time[row]})`
    //   };
    //   traces.push(trace);
    // }

    // this.data = [...traces];
    // this.layout = {
    //   width: 1600,
    //   title: `Propability Time evolution`
    // };
    //plot 2 mesi thesi over time

    this.avgData = this._edCoreService.average$.pipe(
      map(average => [
        {
          x: this._edCoreService.deltaTimes,
          y: average,
          marker: {
            size: 1
          },
          mode: "lines+markers",
          name: `time - ()`
        }
      ])
    );

    // this.avgData = [
    //   {
    //     x: time,
    //     y: avgX,
    //     marker: {
    //       size: 1
    //     },
    //     mode: "lines+markers",
    //     name: `time - ()`
    //   }
    // ];
    this.avgLayout = {
      // width: 1600,
      responsive: true,
      title: `Mean position over time`
    };

    // this.diasporaData .subscribe(e => console.log(e))
    // plot 3 diaspora over time
    this.diasporaData = this._edCoreService.diaspora$.pipe(
      // tap(e=> console.log(e)),
      map(diaspora => [
        {
          x: this._edCoreService.deltaTimes,
          y: diaspora,
          marker: {
            size: 1
          },
          mode: "lines+markers",
          name: `time - ()`
        }
      ])
    );

    // this.diasporaData = [
    //   {
    //     x: time,
    //     y: diaspora,
    //     marker: {
    //       size: 1
    //     },
    //     mode: "lines+markers",
    //     name: `time - ()`
    //   }
    // ];
    this.diasporaLayout = {
      // width: 400,
      responsive: true,
      title: `Diaspora over time`
    };
  }

  start() {
    this._edCoreService.start(
      this.size,
      this.timeStart,
      this.timeEnd,
      this.timeStep
    );

    this.progresses = Array.from(
      this._edCoreService.timeStepComputationBucketMap.values()
    ).map(e =>
      e.workerEvent$.pipe(
        filter(e => !!e.progress),
        map(e => e.progress)
      )
    );
  }

  // selectNewData(index) {
  //   this.data = [this.traces[index]];
  //   this.layout.title = `Propability Time evolution for state ${index + 1}`;
  // }

  public onLoad(evt) {
    this._edCoreService.timeStepResultsAggregate$
      .pipe(
        startWith([] as EdComputationWorkerEvent[]),
        tap(timestepResults => {
          // console.log('timestepResults', timestepResults)

          const space = this._edCoreService.realPosition;
          const time = this._edCoreService.deltaTimes;

          // let series = []
          timestepResults
            .filter(e => !!e.result && e.progress === 100)
            .forEach((timestepResult, index) => {
              // console.log(timestepResult, index)

              const seriesName = `timestep${index}`;
              const series = this.chart.get(seriesName);
              if (!series) {
                this.chart.addSeries({
                  id: seriesName,
                  type: "scatter",
                  turboThreshold: 0,
                  lineWidth: 2,
                  data: []
                });
              }
              // console.log([space, timestepResult.result.propabilityForAllStates, time])
              const data = [
                space,
                timestepResult.result.propabilityForAllStates,
                time
              ];
              console.log(data);
              this.chart.get(seriesName).update({ data } as any, true);
            });

          // this.chart.series = []

          // this.chart.options.data. = timestepResults.map(timestepResult => timestepResult.result)
        })
      )
      .subscribe();

    // .subscribe(e => console.log(e))

    this.chart = evt.chart;
    // console.log("ON LOAD");
    // this.chart.series = [];

    // // if (this.chart.get("series-a")) {
    // //   this.chart.get("series-a").remove();
    // // }
    // for (let row = 0; row < this.edData.propabilities.length; row++) {
    //   console.log(row);
    //   // for each time we have 1 row of propabilities
    //   let data = [];
    //   const time = this.edData.time[row];
    //   for (let prop = 0; prop < N; prop++) {
    //     const space = this.edData.space[prop];
    //     const propability = this.edData.propabilities[row][prop];
    //     data.push([space, propability, time]);
    //   }
    //   this.chart.addSeries({
    //     id: `timestep${row}`,
    //     type: "scatter",
    //     turboThreshold: 0,
    //     lineWidth: 2,
    //     // data
    //   });
    // }

    // console.log("data to plot", this.chart);
    // this.chart.redraw()
  }
}
