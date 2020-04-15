import { Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import { fromEvent } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { createArrayWithRandomNumbers } from "../../math-common/method";
import { ExperimentConstant, MdWorkerInput, MdWorkerOutput } from "../interface";
import { MdCoreService } from "../md-core.service";
import { calculateAcceleration, calculateKineticEnergy, calculatePotentialEnergy } from "../methods";

@Component({
  selector: "app-md-wrapper",
  templateUrl: "./md-wrapper.component.html",
  styleUrls: ["./md-wrapper.component.scss"],
})
export class MdWrapperComponent implements OnInit {
  isCollapsed = false;
  dt = 0.1;
  dtStart = 0;
  dtEnd = 100;
  particleCount = 200;
  worker = new Worker('../md.worker', { type: 'module' });
  workerEvent$ = fromEvent<MessageEvent>(this.worker, 'message').pipe(tap((e) => console.log(e)),
    map(e => e.data as MdWorkerOutput)
  )
  progress$ = this.workerEvent$.pipe(tap(e => console.log(e)), map(e => e.progress), tap(e => console.log(e)))

  constructor(public service: MdCoreService, public plotly: PlotlyService) { }

  ngOnInit() {

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
          console.log(e)

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
