import { Injectable } from "@angular/core";
import * as math from "mathjs";
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, Subscription, timer } from "rxjs";
import { map, shareReplay, take, tap } from "rxjs/operators";
import { createDeltaTimes, createInitialVector, createPosition } from "../methods";
import { createVectorBase } from "./defaults";
import { HamiltonianService } from "./hamiltonian.service";

interface TimeStepResult {
  propabilityForAllStates: number[];
  diaspora: number;
  avgs: number;
}

interface TimeStepComputationBucket {
  dtIndex: number;
  dt: number;
  worker: Worker;
  workerEvent$: Observable<EdComputationWorkerEvent>;
}

export type EdComputationWorkerEvent = {
  dtIndex: number;
  dt: number,
  progress: number,
  result: TimeStepResult;
}

// const fs = require("fs");
@Injectable({
  providedIn: "root"
})
export class EdCoreService {

  timeStepComputationBucketMap: Map<number, TimeStepComputationBucket> = new Map();
  private diaspora$$ = new BehaviorSubject([] as number[])
  private average$$ = new BehaviorSubject([] as number[])
  diaspora$ = this.diaspora$$.asObservable();
  average$ = this.average$$.asObservable();
  deltaTimes = [];
  realPosition = [];

  private timeStepResultsAggregate$$ = new BehaviorSubject([] as EdComputationWorkerEvent[])
  timeStepResultsAggregate$ = this.timeStepResultsAggregate$$.asObservable().pipe(shareReplay());

  resultCollectorSuscription: Subscription;
  operationSubscription: Subscription;
  refreshLatency = 200;

  constructor(private _hamiltonianService: HamiltonianService) {

  }

  constructTimeStepComputationBucketMap(start: number, end: number, step: number) {

    let dtIndex = 0;
    for (let dt = start; dt < end; dt += step) {

      const worker = new Worker('../ed.worker', { type: 'module' });
      const workerEvent$ = fromEvent<MessageEvent>(worker, 'message')
        .pipe(map(e => JSON.parse(e.data) as EdComputationWorkerEvent));

      this.timeStepComputationBucketMap.set(dt, { worker, workerEvent$, dt, dtIndex })
      dtIndex++;
    }

  }

  private constructResultObservables() {

    const computationEvents$ = Array.from(this.timeStepComputationBucketMap.values()).map(e => e.workerEvent$);

    this.resultCollectorSuscription = combineLatest(computationEvents$).pipe(
      // sampleTime(this.refreshLatency),
      // set time steps
      tap(computationEvents => {
        // const timeSteps = computationEvents.map(computationEvent => computationEvent.result.propabilityForAllStates);
        this.timeStepResultsAggregate$$.next(computationEvents)
      }),
      // filter(computationEvents => !!computationEvents.filter(computationEvent => !!computationEvent.result).length),


    ).subscribe()


    this.timeStepResultsAggregate$$.pipe(
      // set averages
      // filter(computationEvents => !!computationEvents.filter(computationEvent => computationEvent.result.avgs).length),
      tap(computationEvents => {
        const average = computationEvents
          .filter(computationEvent => !!computationEvent.result && !!computationEvent.result.avgs)
          .map(computationEvent => computationEvent.result.avgs);
        this.average$$.next(average)
      }),
    ).subscribe()

    this.timeStepResultsAggregate$$.pipe(

      // set diaspora
      // filter(computationEvents => !!computationEvents.filter(computationEvent => computationEvent.result.diaspora).length),
      tap(computationEvents => {
        const diaspora = computationEvents
          .filter(computationEvent => !!computationEvent.result && !!computationEvent.result.diaspora)
          .map(computationEvent => computationEvent.result.diaspora);
        this.diaspora$$.next(diaspora)
      })
    ).subscribe()

    this.operationSubscription = merge(...computationEvents$).subscribe()

  }

  private clearTimeStepComputationBucketMap() {

    this.timeStepComputationBucketMap.forEach(e => {
      e.worker.terminate();
    })
    this.timeStepComputationBucketMap.clear()

  }

  private startTimelapseComputations(initialVector: Array<any>, eigenValues: Array<any>, eigenVectors: Array<any>, basisVectors: Array<any>,
    start: number, end: number, step: number, size: number, startDxStep: number, postResultsDuringComputation: boolean) {

    // clear buckets if already exist. terminates workers as well
    this.clearTimeStepComputationBucketMap();
    // construct new computation buckets for new space and time variables
    this.constructTimeStepComputationBucketMap(start, end, step);


    // this.resetExistingWorkers();
    // start parallel computations 
    Array.from(this.timeStepComputationBucketMap.values()).forEach((bucket, i) => {
      const dt = bucket.dt;
      const dtIndex = bucket.dtIndex;
      // post to web worker

      timer(i * 300).pipe(
        tap(() => {
          bucket.worker.postMessage(JSON.stringify({ dt, dtIndex, initialVector, eigenValues, eigenVectors, basisVectors, size, startDxStep, postResultsDuringComputation }))
        }),
        take(1)
      ).subscribe()

    })

    // construct final result observable by merging all the step computations
    this.constructResultObservables();

  }

  public reset() {

    this.clearTimeStepComputationBucketMap();
    if (this.operationSubscription) {
      this.operationSubscription.unsubscribe();
    }
    if (this.resultCollectorSuscription) {
      this.resultCollectorSuscription.unsubscribe();
    }

  }

  public start(size: number, start: number, end: number, step: number, startDxStep: number, waveFunction: string, potentialFunction: string, postResultsDuringComputation: boolean) {

    this.reset();

    const basisVectors = createVectorBase(size); /** IMPORTANT - vectors are in columns in this matrix */
    let hamiltonianMatrix = this._hamiltonianService.generateHamiltonian(basisVectors);
    let hamiltonianMatrixWithPotential = this._hamiltonianService.addPotential(hamiltonianMatrix, potentialFunction);

    console.log(hamiltonianMatrixWithPotential)

    const ans = (<any>math).eigs(hamiltonianMatrixWithPotential);
    const { values, vectors } = ans;
    const eigenVectors = vectors;

    // console.log('eigenVectors', eigenVectors)

    const eigenValues = values;

    const isOrthogonal = this.isOrthogonal(eigenVectors)

    const initialVector = createInitialVector(size, waveFunction);
    this.deltaTimes = createDeltaTimes(start, end, step);
    this.realPosition = createPosition(size, startDxStep);

    this.startTimelapseComputations(initialVector, eigenValues, eigenVectors, basisVectors, start, end, step, size, startDxStep, postResultsDuringComputation)
  }

  isOrthogonal(eigenVectors: number[][]) {

    // let initialVector = eigenVectors[68];
    // console.log(calculateBraKet(initialVector,eigenVectors[69]))
    // for (let i = 1; i < eigenVectors.length; i++) {

    //   console.log(calculateBraKet(initialVector, eigenVectors[i]))


    // }

  }

}
