import { Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import { filter, map } from "rxjs/operators";
// import { randomDecimal, randomInteger } from "../../math-common/method";
import { McCoreService } from "../mc-core.service";
import { eidikhThermotitaLayout, energyLayout, magLayout, magSusceptibilityLayout } from "../variable";
// import { calculateEnergy } from "../method";
// import { B, J, K } from "../variable";

@Component({
  selector: "app-mc-wrapper",
  templateUrl: "./mc-wrapper.component.html",
  styleUrls: ["./mc-wrapper.component.scss"],
})
export class McWrapperComponent implements OnInit {
  isCollapsed = false;
  magLayout = magLayout;
  energyLayout = energyLayout;
  eidikhThermotitaLayout = eidikhThermotitaLayout;
  magSusceptibilityLayout = magSusceptibilityLayout;
  enegyData = [];
  eidikhThermotitaData = [];
  magData = [];

  // experiment variables
  K = 1;
  B = 0;
  J = 1;
  T0 = 0;
  T_MAX = 6;
  T_STEP = 0.05;

  ITERATIONS = 100000;
  spinChangesPerIteration = 1;
  availableGridSizes = [10, 20, 30];
  selectedGridSizes = [20];

  progress$ = this.service.calculationResults$$.pipe(
    filter((e) => !!e.length),
    map((results) => {
      const temperatureSteps = (this.T_MAX - this.T0) / this.T_STEP;
      const totalSteps = temperatureSteps * this.selectedGridSizes.length;
      const stepsTilNow = results
        .map((e) => e.tempratures.length)
        .reduce((a, b) => a + b);
      const progress =
        (100 * (totalSteps - (totalSteps - stepsTilNow))) / totalSteps;
      return progress.toFixed(1);
    })
  );

  magPlotData$ = this.service.calculationResults$$.pipe(
    filter((e) => !!e.length),
    map((results) => {
      console.log(results)
      let traces = []

      results[0].magnetizations.forEach((m, i) => {

        const dd = [0];

        const t = {
          x: results[0].tempratures,
          y: m,
          type: "scatter",
          name: `Lattice ${results[0].GRID_SIZE}`
        }

        traces.push(t)


      })
      // })
      // let traces = results.map((result) => ({
      //   x: result.tempratures,
      //   y: result.magnetizations,
      //   type: "scatter",
      //   name: `Lattice ${result.GRID_SIZE}`,
      // }));


      // traces.push({
      //   x: results[0].tempratures,
      //   y: results[0].theoritical,
      //   type: "lines+markers",
      //   name: `Theory`,
      // });
      // console.log(traces)
      return traces;
    })
  );

  // energyPlotData$ = this.service.calculationResults$$.pipe(
  //   filter((e) => !!e.length),
  //   map((results) => {
  //     let traces = results.map((result) => ({
  //       x: result.tempratures,
  //       y: result.energies,
  //       type: "lines+markers",
  //       name: `Lattice ${result.GRID_SIZE}`,
  //     }));
  //     return traces;
  //   })
  // );

  // eidikhThermotitaPlotData$ = this.service.calculationResults$$.pipe(
  //   filter((e) => !!e.length),
  //   map((results) => {
  //     let traces = results.map((result) => ({
  //       x: result.tempratures,
  //       y: result.eidikesThermotites,
  //       type: "lines+markers",
  //       name: `Lattice ${result.GRID_SIZE}`,
  //     }));
  //     return traces;
  //   })
  // );

  // magSusceptibilityPlotData$ = this.service.calculationResults$$.pipe(
  //   filter((e) => !!e.length),
  //   map((results) => {
  //     let traces = results.map((result) => ({
  //       x: result.tempratures,
  //       y: result.magSusceptibilities,
  //       type: "lines+markers",
  //       name: `Lattice ${result.GRID_SIZE}`,
  //     }));
  //     return traces;
  //   })
  // );

  constructor(public service: McCoreService, public plotly: PlotlyService) { }

  ngOnInit() { }

  start() {
    this.service.start(
      this.selectedGridSizes,
      this.J,
      this.B,
      this.K,
      this.ITERATIONS,
      this.T0,
      this.T_MAX,
      this.T_STEP,
      this.spinChangesPerIteration
    );


  }
}
