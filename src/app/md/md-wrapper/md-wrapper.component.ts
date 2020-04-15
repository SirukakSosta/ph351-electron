import { Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import { fromEvent, timer } from "rxjs";
import { filter, map, take, tap } from "rxjs/operators";
import { createArrayWithRandomNumbers } from "../../math-common/method";
import { ExperimentConstant, MdWorkerInput, MdWorkerOutput } from "../interface";
import { MdCoreService } from "../md-core.service";
import { calculateAcceleration, calculateKineticEnergy, calculatePotentialEnergy, createInitialDisplacement } from "../methods";
import { displacementPlotLayout } from "../variable";

@Component({
  selector: "app-md-wrapper",
  templateUrl: "./md-wrapper.component.html",
  styleUrls: ["./md-wrapper.component.scss"],
})
export class MdWrapperComponent implements OnInit {

  displacementPlotLayout = displacementPlotLayout;
  isCollapsed = false;
  dt = 0.1;
  dtStart = 0;
  dtEnd = 1000;
  particleCount = 200;
  initialDisplacement: number[] = [];
  perlinDistribution = true;
  worker = new Worker('../md.worker', { type: 'module' });
  workerEvent$ = fromEvent<MessageEvent>(this.worker, 'message').pipe(map(e => e.data as MdWorkerOutput))
  progress$ = this.workerEvent$.pipe(map(e => e.progress));
  particleArray: number[];

  energyData$ = this.workerEvent$.pipe(
    // sampleTime(1000),
    filter(e => e.progress === 100),
    map(e => {

      const kineticEnergyAxis = e.kineticEnergy.map(kineticEnergyForAllParticles => kineticEnergyForAllParticles.reduce((a, b) => a + b));
      const timeAxis = e.kineticEnergy.map((e, i) => i * this.dt)

      let kineticTrace = {
        x: timeAxis,
        y: kineticEnergyAxis,
        marker: {
          size: 1
        },
        mode: "lines+markers",
        name: `Kinetic`
      };

      const potentialEnergyAxis = e.potentialEnergy.map(potentialEnergyForAllParticles => potentialEnergyForAllParticles.reduce((a, b) => a + b));

      let potentialTrace = {
        x: timeAxis,
        y: potentialEnergyAxis,
        marker: {
          size: 1
        },
        mode: "lines+markers",
        name: `Potential`
      };

      const totalEnergyAxis = potentialEnergyAxis.map((potentialEnergyAxisElement, i) => potentialEnergyAxisElement + kineticEnergyAxis[i]);

      let totalTrace = {
        x: timeAxis,
        y: totalEnergyAxis,
        marker: {
          size: 1
        },
        mode: "lines+markers",
        name: `Total`
      };

      return [potentialTrace, kineticTrace, totalTrace]

    }))

  constructor(public service: MdCoreService, public plotly: PlotlyService) { }

  ngOnInit() {
    this.particleArray = new Array(this.particleCount).fill(0).map((e, i) => i); // mock array used for particle mappings
    this.initialDisplacement = createInitialDisplacement(this.particleCount, this.perlinDistribution);
    console.log(this)
  }

  onParticleCountChange() {
    timer(1).pipe(
      take(1),
      tap(() => {
        this.particleArray = new Array(this.particleCount).fill(0).map((e, i) => i);
        this.initialDisplacement = createInitialDisplacement(this.particleCount, this.perlinDistribution);
      })
    ).subscribe()

  }

  start(): void {

    const constant: ExperimentConstant = { k: 1, g: 4, a: 4, b: 4 };
    const mass = createArrayWithRandomNumbers(this.particleCount, 1, 1, false); // mass for each particle

    const initialDisplacement = this.initialDisplacement
    console.log('initialDisplacement', initialDisplacement)

    const initialVelocity = createArrayWithRandomNumbers(this.particleCount, -0.1, 0.1, true); // initial velocity values for each particle
    const initialAcceleration = this.particleArray.map((e, particle) => {
      const particleDisplacement = {
        previousParticle: initialDisplacement[particle - 1] || initialDisplacement[this.particleCount - 1],
        currentParticle: initialDisplacement[particle],
        nextParticle: initialDisplacement[particle + 1] || initialDisplacement[0],
      };
      return calculateAcceleration(particleDisplacement, mass[particle], constant);
    })

    const initialKineticEnergy = this.particleArray.map((e, particle) => calculateKineticEnergy(mass[particle], initialVelocity[particle]));
    const initialPotentialEnergy = this.particleArray.map((e, particle) => calculatePotentialEnergy({
      currentParticle: initialDisplacement[particle],
      nextParticle:
        initialDisplacement[particle + 1] || initialDisplacement[0],
    }, constant));


    const workerInput: MdWorkerInput = {
      constant,
      dt: this.dt,
      dtEnd: this.dtEnd,
      dtStart: this.dtStart,
      initialDisplacement,
      initialVelocity,
      initialAcceleration,
      initialKineticEnergy,
      initialPotentialEnergy,
      mass
    }

    this.workerEvent$
      .pipe(
        filter(e => e.progress === 100),
        tap(e => {

          console.log('results', e)

          // let dtIndex = 0;
          // for (let t = this.dtStart; t < this.dtEnd; t += this.dt) {

          //   const totalKineticEnergyForDt = e.kineticEnergy[dtIndex].reduce((a, b) => a + b);
          //   const totalPotentialEnergyForDt = e.potentialEnergy[dtIndex].reduce((a, b) => a + b);
          //   console.log(t, 'kinetic', totalKineticEnergyForDt, 'potential ', totalPotentialEnergyForDt, 'total energy', totalKineticEnergyForDt + totalPotentialEnergyForDt)

          //   dtIndex++
          // }

        })
      ).subscribe()

    this.worker.postMessage(JSON.stringify(workerInput))

  }
}
