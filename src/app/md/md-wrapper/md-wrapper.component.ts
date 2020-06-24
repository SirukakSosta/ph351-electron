import { Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import { BehaviorSubject, combineLatest, concat, fromEvent, Observable, of, timer } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { createArrayWithRandomNumbers } from "../../math-common/method";
import { ExperimentConstant, MdWorkerInput, MdWorkerOutput } from "../interface";
import { calculateAcceleration, calculateKineticEnergy, calculatePotentialEnergy, createInitialDisplacement, getVelocityBoundsByIndex } from "../method";
import { energyTimePlotLayout, totalEnergyTemperaturePlotLayout } from "../variable";

@Component({
  selector: "app-md-wrapper",
  templateUrl: "./md-wrapper.component.html",
  styleUrls: ["./md-wrapper.component.scss"],
})
export class MdWrapperComponent implements OnInit {
  totalEnergyTemperaturePlotLayout = totalEnergyTemperaturePlotLayout;
  energyTimePlotLayout = energyTimePlotLayout;
  isCollapsed = false;
  constant: ExperimentConstant = { k: 1, g: 0, a: 0, b: 0 }; // harmonic
  dt = 0.1;
  dtStart = 0;
  dtEnd = 70;
  particleCount = 20;
  initialDisplacement: number[] = [];
  perlinDistribution = true;
  worker = new Worker("../md.worker", { type: "module" });
  workerEvent$ = fromEvent<MessageEvent>(this.worker, "message").pipe(
    map((e) => e.data as MdWorkerOutput)
  );

  particleArray: number[];
  calculationResults$$: BehaviorSubject<MdWorkerOutput[]> = new BehaviorSubject(
    []
  );
  selectedEnergyTimeExperiment$$ = new BehaviorSubject(0);
  velocityInitialStart = -0.1;
  velocityInitialEnd = 4;
  velocityStep = 0.05;
  progress$ = this.calculationResults$$.pipe(
    map((e) => Math.round((e.length / 20) * 100))
  );

  energyTimePlotData$ = combineLatest(
    this.calculationResults$$,
    this.selectedEnergyTimeExperiment$$
  ).pipe(
    filter(
      ([experimentResults, selectedExperimentIndex]) =>
        !!experimentResults.length
    ),
    map(
      ([experimentResults, selectedExperimentIndex]) =>
        experimentResults[selectedExperimentIndex]
    ),
    map((e) => {
      const kineticEnergyAxis = e.kineticEnergy.map(
        (kineticEnergyForAllParticles) =>
          kineticEnergyForAllParticles.reduce((a, b) => a + b) /
          this.particleCount
      );
      const timeAxis = e.kineticEnergy.map((e, i) => i * this.dt);

      let kineticTrace = {
        x: timeAxis,
        y: kineticEnergyAxis,
        marker: {
          size: 1,
        },
        mode: "lines+markers",
        name: `Kinetic`,
      };

      const potentialEnergyAxis = e.potentialEnergy.map(
        (potentialEnergyForAllParticles) =>
          potentialEnergyForAllParticles.reduce((a, b) => a + b) /
          this.particleCount
      );

      let potentialTrace = {
        x: timeAxis,
        y: potentialEnergyAxis,
        marker: {
          size: 1,
        },
        mode: "lines+markers",
        name: `Potential`,
      };

      const totalEnergyAxis = potentialEnergyAxis.map(
        (potentialEnergyAxisElement, i) =>
          potentialEnergyAxisElement + kineticEnergyAxis[i]
      );

      let totalTrace = {
        x: timeAxis,
        y: totalEnergyAxis,
        marker: {
          size: 1,
        },
        mode: "lines+markers",
        name: `Total`,
      };

      return [totalTrace];
    })
  );

  experimentDescription = "";
  totalEnergyTemperaturePlotData$ = this.calculationResults$$.pipe(
    map((results) => {
      let traceTotalEnergy = {
        x: results.map((result) => result.temperature),
        y: results.map((result) => result.averageTotalEnergy),
        marker: {
          size: 1,
        },
        mode: "lines+markers",
        name: `Total`,
      };

      let traceKineticEnergy = {
        x: results.map((result) => result.temperature),
        y: results.map((result) => result.averageKineticEnergy),
        marker: {
          size: 1,
        },
        mode: "lines+markers",
        name: `Kinetic`,
      };

      let tracePotentialEnergy = {
        x: results.map((result) => result.temperature),
        y: results.map((result) => result.averagePotentialEnergy),
        marker: {
          size: 1,
        },
        mode: "lines+markers",
        name: `Potential`,
      };

      return [traceTotalEnergy];
    })
  );
  energyTimePlotLayout$ = this.selectedEnergyTimeExperiment$$.pipe(
    map((index) => {
      console.log(index);
      const bounds = getVelocityBoundsByIndex(
        index,
        this.velocityInitialStart,
        this.velocityInitialEnd,
        this.velocityStep
      );
      const layout = { ...energyTimePlotLayout };
      layout.title += ` (Velocity [${bounds.velocityStart} , ${bounds.velocityEnd}])`;
      return layout;
    })
  );

  constructor(public plotly: PlotlyService) { }

  ngOnInit() {
    this.particleArray = new Array(this.particleCount).fill(0).map((e, i) => i); // mock array used for particle mappings
    this.initialDisplacement = createInitialDisplacement(
      this.particleCount,
      this.perlinDistribution
    );
    console.log(this);
  }

  onSelectedEnergyTimeExperimentChange(e: number) {
    this.selectedEnergyTimeExperiment$$.next(e);
  }

  onParticleCountChange() {
    timer(1)
      .pipe(
        take(1),
        tap(() => {
          this.particleArray = new Array(this.particleCount)
            .fill(0)
            .map((e, i) => i);
          this.initialDisplacement = createInitialDisplacement(
            this.particleCount,
            this.perlinDistribution
          );
        })
      )
      .subscribe();
  }

  start(): void {
    this.selectedEnergyTimeExperiment$$.next(0);
    this.calculationResults$$.next([]);

    let ops$: Observable<MdWorkerOutput>[] = [];

    for (let i = 1; i <= this.particleCount; i++) {
      const bounds = getVelocityBoundsByIndex(i, this.velocityInitialStart, this.velocityInitialEnd, this.velocityStep);
      ops$.push(this.runCalculation(this.initialDisplacement, bounds.velocityStart, bounds.velocityEnd, i));
    }

    concat(...ops$).subscribe();
  }

  runCalculation(initialDisplacement: number[], velocityStart: number, velocityEnd: number, calculationIndex: number) {

    const constant = this.constant;
    const mass = createArrayWithRandomNumbers(this.particleCount, 1, 1, false); // mass for each particle

    const initialVelocity = createArrayWithRandomNumbers(this.particleCount, velocityStart, velocityEnd, true);    // initial velocity values for each particle
    const initialAcceleration = this.particleArray.map((e, particle) => {
      const particleDisplacement = {
        previousParticle:
          initialDisplacement[particle - 1] ||
          initialDisplacement[this.particleCount - 1],
        currentParticle: initialDisplacement[particle],
        nextParticle:
          initialDisplacement[particle + 1] || initialDisplacement[0],
      };
      return calculateAcceleration(particleDisplacement, mass[particle], constant);
    });

    const initialKineticEnergy = this.particleArray.map((e, particle) =>
      calculateKineticEnergy(mass[particle], initialVelocity[particle])
    );
    const initialPotentialEnergy = this.particleArray.map((e, particle) =>
      calculatePotentialEnergy(
        {
          currentParticle: initialDisplacement[particle],
          nextParticle:
            initialDisplacement[particle + 1] || initialDisplacement[0],
        },
        constant
      )
    );

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
      mass,
    };

    return of(1).pipe(
      tap(() => {
        this.experimentDescription = `Calculation ${calculationIndex} with velocities in range [${velocityStart}, ${velocityEnd}] `;
        this.worker.postMessage(JSON.stringify(workerInput));
      }),
      switchMap(() => this.workerEvent$),
      filter((e) => e.progress === 100),
      take(1),
      tap((e) => {
        this.calculationResults$$.next([
          ...this.calculationResults$$.getValue(),
          e,
        ]);
      })
    );
  }
}
