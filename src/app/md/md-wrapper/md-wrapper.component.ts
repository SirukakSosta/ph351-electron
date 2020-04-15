import { Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import * as noiseGenerator from 'png5';
import { fromEvent } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { createArrayWithRandomNumbers } from "../../math-common/method";
import { ExperimentConstant, MdWorkerInput, MdWorkerOutput } from "../interface";
import { MdCoreService } from "../md-core.service";
import { calculateAcceleration, calculateKineticEnergy, calculatePotentialEnergy } from "../methods";
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
  worker = new Worker('../md.worker', { type: 'module' });
  workerEvent$ = fromEvent<MessageEvent>(this.worker, 'message').pipe(map(e => e.data as MdWorkerOutput))
  progress$ = this.workerEvent$.pipe(map(e => e.progress))
  myNoiseMachine = new noiseGenerator({
    lod: 2,
    falloff: 0.25,
    seed: 'seed'
  })
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

    // const noise1D = this.myNoiseMachine.getPerlinNoise(0.1)

    // console.log(this.myNoiseMachine.getPerlinNoise(0.01))
    // console.log(this.myNoiseMachine.getPerlinNoise(0.02))
    // console.log(this.myNoiseMachine.getPerlinNoise(0.03))

  }

  start(): void {

    const constant: ExperimentConstant = { k: 1, g: 4, a: 4, b: 4 };
    const dxStart = 0;
    const dxEnd = 1;

    const particleArray = new Array(this.particleCount).fill(0); // mock array used for particle mappings
    const mass = createArrayWithRandomNumbers(this.particleCount, 1, 1, false); // mass for each particle
    const initialDisplacement = createArrayWithRandomNumbers(this.particleCount, dxStart, dxEnd, true); // initial displacement values for each particle
    const initialVelocity = createArrayWithRandomNumbers(this.particleCount, -0.1, 0.1, true); // initial velocity values for each particle
    const initialAcceleration = particleArray.map((e, particle) => {
      const particleDisplacement = {
        previousParticle: initialDisplacement[particle - 1] || initialDisplacement[this.particleCount - 1],
        currentParticle: initialDisplacement[particle],
        nextParticle: initialDisplacement[particle + 1] || initialDisplacement[0],
      };
      return calculateAcceleration(particleDisplacement, mass[particle], constant);
    })

    const initialKineticEnergy = particleArray.map((e, particle) => calculateKineticEnergy(mass[particle], initialVelocity[particle]));
    const initialPotentialEnergy = particleArray.map((e, particle) => calculatePotentialEnergy({
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
