import { Component, OnInit, ViewChild } from "@angular/core";
import { PlotComponent, PlotlyService } from "angular-plotly.js";
import { Chart, Options } from "highcharts";
import { BehaviorSubject, Observable, timer } from "rxjs";
import { map, sampleTime, take, tap } from "rxjs/operators";
import { AM } from "../../pde/interface";
import { createPotentialFunction, waveFunctionVal } from "../methods";
import { TIME_END, TIME_START, TIME_STEP } from "../tight-binding-model/defaults";
import { EdCoreService } from "../tight-binding-model/ed-core.service";
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
  @ViewChild("propabilityPlotly") propabilityPlotly: PlotComponent;

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
  // data = [];
  // edData: any;
  layout: any;
  // dataHist: any;
  // listOfOption: Array<{ label: string; value: number }> = [];
  // singleValue = 0;

  // computational variables
  size = 70;
  timeStart = TIME_START;
  timeEnd = TIME_END;
  timeStep = TIME_STEP;
  startDxStep = 30;
  waveFunction: string = 'Math.exp((-1 / 50) * Math.pow(x - 50, 2))'
  potentialFunction: string = '0.5 * x'

  progresses: Observable<number>[] = [];
  progresses1: Observable<number>;

  propabilityPlotlyData$$ = new BehaviorSubject([])
  propabilityPlotlyData$ = this.propabilityPlotlyData$$.asObservable().pipe(
    // sampleTime(1000)
  )
  potentialEquationStrValid: boolean = true;
  waveEquationStrValid: boolean = true;

  constructor(
    public _edCoreService: EdCoreService,
    public plotly: PlotlyService
  ) { }

  setPotentialFunctionByAM(e: AM) {

    if (e === '3943') {
      this.potentialFunction = `0.5 * x`
    } else if (e === '3131') {
      this.potentialFunction = `Math.pow(x,2)`
    }
    this.potentialEquationStrValid = true;
    this.waveEquationStrValid = true;
  }

  checkWaveFunctionStrValidity(val: string) {

    this.waveEquationStrValid = true
    try {
      const ff = waveFunctionVal(1, val)
      if (Number.isNaN(ff)) {
        this.waveEquationStrValid = false;
      }
    } catch (error) {
      this.waveEquationStrValid = false;

    }

  }

  checkPotentialFunctionStrValidity(val: string) {

    this.potentialEquationStrValid = true
    try {
      const ff = createPotentialFunction(1, val)
      if (Number.isNaN(ff)) {
        this.potentialEquationStrValid = false;
      }
    } catch (error) {
      this.potentialEquationStrValid = false;

    }

  }

  ngOnInit(): void {

    console.log(this)
    // const update = {
    //   title: 'New Title',
    //   data: this.data
    // }
    // const k = this.plotly.getPlotly();
    // console.log(k);
    // function getData() {
    //   return Math.random();
    // }
    // k.plot("chart", [
    //   {
    //     y: [getData()],
    //     type: "line"
    //   }
    // ]);
    // // return;
    // var cnt = 0;
    // setInterval(function() {
    //   k.extendTraces("chart", { y: [[getData()]] }, [0]);
    //   cnt++;
    //   if (cnt > 500) {
    //     k.relayout("chart", {
    //       xaxis: {
    //         range: [cnt - 500, cnt]
    //       }
    //     });
    //   }
    // }, 15);

    // .relayout(this.propabilityPlotly.plotEl.nativeElement, update);
    // console.log("plot", k);
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

    //plot 2 mesi thesi over time
    let traces1 = [];


    this.plot3dAllTimeSteps();


    this.layout = {
      width: 1600,
      title: `Propability Time evolution`
    };
    this.avgData = this._edCoreService.average$.pipe(
      sampleTime(100),
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
      width: 600,
      responsive: true,
      title: `Mean position over time`
    };

    // this.diasporaData .subscribe(e => console.log(e))
    // plot 3 diaspora over time
    this.diasporaData = this._edCoreService.diaspora$.pipe(
      // tap(e=> console.log(e)),
      sampleTime(100),
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
      width: 600,
      responsive: true,
      title: `Diaspora over time`
    };
  }

  plot3dAllTimeSteps() {
    this._edCoreService.timeStepResultsAggregate$
      .pipe(

        sampleTime(100),
        // startWith([] as EdComputationWorkerEvent[]),
        tap(timestepResults => {
          // console.log('timestepResults', timestepResults)

          const space = this._edCoreService.realPosition;
          const time = this._edCoreService.deltaTimes;

          // let series = []
          timestepResults
            .filter(
              e => !!e.result
              // && (e.dtIndex % 10 === 0)
              // && (e.dtIndex === 0 || e.progress === 100)
              // && e.progress === 100
            )
            .forEach((timestepResult, index) => {
              // let traces = [];


              let trace = {
                x: space,
                y: timestepResult.result.propabilityForAllStates,
                marker: {
                  size: 1
                },
                mode: "lines+markers",
                name: `time - (${time[index]})`
              };
              // this.data.push(trace);
              this.propabilityPlotlyData$$.next([...this.propabilityPlotlyData$$.getValue(), trace])
            });
        }),
        sampleTime(400),
      )
      .subscribe();
  }

  plot3dTimeLapse() {

    this.propabilityPlotlyData$$.next([])
    this._edCoreService.timeStepResultsAggregate$
      .pipe(
        take(1),
        tap(timestepResults => {

          timestepResults.forEach(timestepResult => {

            const space = this._edCoreService.realPosition;
            const time = this._edCoreService.deltaTimes;

            let trace = {
              x: space,
              y: timestepResult.result.propabilityForAllStates,
              marker: {
                size: 1
              },
              mode: "lines+markers",
              name: `time - (${time[timestepResult.dtIndex]})`
            };

            timer(timestepResult.dtIndex * 300).pipe(
              tap(e => {
                this.propabilityPlotlyData$$.next([trace])
              }),
              take(1)
            ).subscribe()


          })
        })

      ).
      subscribe()

    // this._edCoreService.timeStepResultsAggregate$
    //   .pipe(
    //     sampleTime(100),
    //     // startWith([] as EdComputationWorkerEvent[]),
    //     map(timestepResults => {
    //       // console.log('timestepResults', timestepResults)

    //       const space = this._edCoreService.realPosition;
    //       const time = this._edCoreService.deltaTimes;

    //       // let series = []
    //       return timestepResults
    //         .filter(
    //           e => !!e.result
    //           // && (e.dtIndex % 10 === 0)
    //           // && (e.dtIndex === 0 || e.progress === 100)
    //           // && e.progress === 100
    //         )
    //         .map((timestepResult, index) => {
    //           // let traces = [];
    //           let trace = {
    //             x: space,
    //             y: timestepResult.result.propabilityForAllStates,
    //             marker: {
    //               size: 1
    //             },
    //             mode: "lines+markers",
    //             name: `time - (${time[index]})`
    //           };

    //           return trace

    //           // this.data.push(trace);
    //         }),
    //         tap((traces: any[]) => {

    //           console.log('traces', traces)

    //           concat(traces.map(trace => timer(1000))).subscribe(e => {
    //             console.log(e)
    //           })

    //         })
    //     })
    //   )
    //   .subscribe();

  }

  start() {

    this.propabilityPlotlyData$$.next([])
    this._edCoreService.start(
      this.size,
      this.timeStart,
      this.timeEnd,
      this.timeStep,
      this.startDxStep,
      this.waveFunction,
      this.potentialFunction
    );

    this.progresses1 = this._edCoreService.timeStepResultsAggregate$.pipe(

      map(computationResults => {
        return computationResults.filter(computationResult => computationResult.progress < 100).length
      }),
      sampleTime(100),
    )

    // this.progresses = Array.from(
    //   this._edCoreService.timeStepComputationBucketMap.values()
    // ).map(e =>
    //   e.workerEvent$.pipe(
    //     filter(e => !!e.progress),
    //     map(e => e.progress),
    //     map(progresses => {
    //       return
    //     })
    //   )
    // );
  }

  // selectNewData(index) {
  //   this.data = [this.traces[index]];
  //   this.layout.title = `Propability Time evolution for state ${index + 1}`;
  // }

  public onLoad(evt) {
    this._edCoreService.timeStepResultsAggregate$
      .pipe(
        sampleTime(100),
        // startWith([] as EdComputationWorkerEvent[]),
        tap(timestepResults => {
          const space = this._edCoreService.realPosition;
          const time = this._edCoreService.deltaTimes;

          // let series = []
          timestepResults
            .filter(
              e => !!e.result
              // && (e.dtIndex === 0 || e.progress === 100)
              // && e.progress === 100
            )
            .forEach((timestepResult, index) => {
              // highchart config
              // const seriesName = `timestep${index}`;
              // const series = this.chart.get(seriesName);
              // if (!series) {
              //   this.chart.addSeries({
              //     id: seriesName,
              //     type: "scatter",
              //     turboThreshold: 0,
              //     lineWidth: 2,
              //     data: []
              //   });
              // }
              // let data = []
              // for (let i = 0; i < space.length; i++) {
              //   const _space = space[i];
              //   const _propability = timestepResult.result.propabilityForAllStates[i]
              //   data.push([_space, _propability, timestepResult.dt]);
              // }
              // this.chart.get(seriesName).update({ data } as any, true)
            });

          // this.chart.series = []

          // this.chart.options.data. = timestepResults.map(timestepResult => timestepResult.result)
        })
      )
      .subscribe();

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
