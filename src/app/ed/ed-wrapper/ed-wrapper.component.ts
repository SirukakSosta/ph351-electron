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
  time: number;
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
  public chart: Chart;
  layout: any;

  timeStart = TIME_START;
  timeEnd = TIME_END;
  timeStep = TIME_STEP;

  startDx = 30;
  endDx = 70;
  dx = 1;

  waveFunction: string = "Math.exp((-1 / 50) * Math.pow(x - 50, 2))";
  potentialFunction: string = "0.5 * x";

  progresses: Observable<number>[] = [];
  progresses1: Observable<number>;

  propabilityPlotlyData$$ = new BehaviorSubject([]);
  propabilityPlotlyData$ = this.propabilityPlotlyData$$
    .asObservable()
    .pipe
    // sampleTime(1000)
    ();
  potentialEquationStrValid: boolean = true;
  waveEquationStrValid: boolean = true;
  postResultsDuringComputation = false;
  potentialOverDistanceLayout: any;
  potentialOverDistanceData: any;
  waveOverDistanceLayout: any;
  waveOverDistanceData: any;

  constructor(public _edCoreService: EdCoreService, public plotly: PlotlyService) { }


  ngOnInit(): void {
    console.log(this);

    this.containerWidth = document.getElementById("inner-content").offsetWidth - 500;

    //plot 2 mesi thesi over time
    this.plotPotentialOverDistance()
    this.plotWaveOverDistance()

    this.createDiasporaChart();
    this.createAvgsChart()
    this.plot3dAllTimeSteps();

    this.layout = {
      // width: 1600,
      title: `P(x,t) - Propability Time evolution`,
      xaxis: {
        title: "x",
      },
      yaxis: {
        title: "P(x)",
      },
    };

    this.progresses1 = this._edCoreService.timeStepResultsAggregate$.pipe(
      map(computationResults => {
        const pendingComputations = computationResults.filter(computationResult => computationResult.progress < 100).length
        const allComputations = this._edCoreService.timeStepComputationBucketMap.size;
        const remaining = (allComputations - pendingComputations) * 100 / allComputations
        return remaining;
      })
    );

  }

  setPotentialFunctionByAM(e: AM) {
    if (e === "3943") {
      this.potentialFunction = `0.5 * x`;
    } else if (e === "3131") {
      this.potentialFunction = `Math.pow(x,2)`;
    }
    this.potentialEquationStrValid = true;
    this.waveEquationStrValid = true;
  }

  checkWaveFunctionStrValidity(val: string) {
    this.waveEquationStrValid = true;
    try {
      const ff = waveFunctionVal(1, val);
      if (Number.isNaN(ff)) {
        this.waveEquationStrValid = false;
      }
    } catch (error) {
      this.waveEquationStrValid = false;
    }
    if (this.waveEquationStrValid) {
      this.plotWaveOverDistance()
    }
  }

  checkPotentialFunctionStrValidity(val: string) {
    this.potentialEquationStrValid = true;
    try {
      const ff = createPotentialFunction(1, val);
      if (Number.isNaN(ff)) {
        this.potentialEquationStrValid = false;
      }
    } catch (error) {
      this.potentialEquationStrValid = false;
    }
    if (this.potentialEquationStrValid) {
      this.plotPotentialOverDistance()
    }
  }

  plotPotentialOverDistance() {

    this.potentialOverDistanceLayout = {
      // width: 600,
      responsive: true,
      title: `Potential over distance`,
      xaxis: {
        title: "x",
      },
      yaxis: {
        title: "Potential",
      },
    };

    let xData: number[] = [];
    let yData: number[] = [];
    for (let i = this.startDx; i < this.endDx; i += this.dx) {
      const potential = createPotentialFunction(i, this.potentialFunction);
      xData.push(i);
      yData.push(potential);
    }

    this.potentialOverDistanceData = [
      {
        x: xData,
        y: yData,
        marker: {
          size: 1,
        },
        mode: "lines+markers",
        name: `time - ()`,
      },
    ]

  }
  //     this.createDiasporaChart();
  // this.createAvgsChart();
  // this.plot3dAllTimeSteps();

  plotWaveOverDistance() {

    this.waveOverDistanceLayout = {
      // width: 600,
      responsive: true,
      title: `Wave over distance`,
      xaxis: {
        title: "x"
      },
      yaxis: {
        title: "Wave",
      },
    };

    let xData: number[] = [];
    let yData: number[] = [];
    for (let i = this.startDx; i < this.endDx; i += this.dx) {
      const val = waveFunctionVal(i, this.waveFunction);
      xData.push(i);
      yData.push(val);
    }

    this.waveOverDistanceData = [
      {
        x: xData,
        y: yData,
        marker: {
          size: 1,
        },
        mode: "lines+markers",
        name: `time - ()`,
        title: "P(x)"
      },
    ]
  }


  createAvgsChart() {
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

    this.avgLayout = {
      // width: 600,
      responsive: true,
      title: `Mean over time`,
      xaxis: {
        title: "t"
      },
      yaxis: {
        title: "μ(τ)"
      }
    };
  }

  createDiasporaChart() {
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
    this.diasporaLayout = {
      // width: 600,
      responsive: true,
      title: `Standard deviation (σ) over time`,
      xaxis: {
        title: "t"
      },
      yaxis: {
        title: "σ(t)"
      }
    };
  }

  plot3dAllTimeSteps() {
    this._edCoreService.timeStepResultsAggregate$
      .pipe(
        sampleTime(100),
        // startWith([] as EdComputationWorkerEvent[]),
        tap(timestepResults => {
          // console.log('timestepResults', timestepResults)
          this.layout.title = `P(x,t) - Propability Time evolution`;
          const space = this._edCoreService.realPosition;
          const time = this._edCoreService.deltaTimes;

          // let series = []
          timestepResults
            .filter(
              (e) => !!e.result
              // e => !!e.result
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
                name: `P(${time[index]}, x)`
              };
              // this.data.push(trace);
              this.propabilityPlotlyData$$.next([
                ...this.propabilityPlotlyData$$.getValue(),
                trace
              ]);
            });
        }),
        sampleTime(400)
      )
      .subscribe();
  }

  plot3dTimeLapse() {

    this.propabilityPlotlyData$$.next([]);
    this._edCoreService.timeStepResultsAggregate$
      .pipe(
        // take(1),
        tap((timestepResults) => {
          timestepResults.forEach((timestepResult) => {
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

            timer(timestepResult.dtIndex * 300)
              .pipe(
                tap(e => {
                  this.layout.title = `P(x, ${timestepResult.dtIndex}) - Propability Time evolution`;

                  this.propabilityPlotlyData$$.next([trace]);
                }),
                take(1)
              )
              .subscribe();
          });
        })
      )
      .subscribe();
  }

  start() {
    this.propabilityPlotlyData$$.next([]);
    this._edCoreService.start(
      this.startDx,
      this.endDx,
      this.dx,
      this.timeStart,
      this.timeEnd,
      this.timeStep,
      this.waveFunction,
      this.potentialFunction,
      this.postResultsDuringComputation
    );


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
