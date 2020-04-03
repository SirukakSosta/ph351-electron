import { Injectable } from "@angular/core";
import * as math from "mathjs";
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, Subscription } from "rxjs";
import { map, sampleTime, tap } from "rxjs/operators";
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
  timeStepResultsAggregate$ = this.timeStepResultsAggregate$$.asObservable();

  resultCollectorSuscription: Subscription;
  operationSubscription: Subscription;

  constructor(private _hamiltonianService: HamiltonianService) {

  }

  constructTimeStepComputationBucketMap(start: number, end: number, step: number) {

console.log(88)

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
      sampleTime(200),
      // set time steps
      tap(computationEvents => {
        // const timeSteps = computationEvents.map(computationEvent => computationEvent.result.propabilityForAllStates);
        this.timeStepResultsAggregate$$.next(computationEvents)
      }),
      // set averages
      tap(computationEvents => {
        const average = computationEvents.map(computationEvent => computationEvent.result.avgs);
        this.average$$.next(average)
      }),
      // set diaspora
      tap(computationEvents => {
        const diaspora = computationEvents.map(computationEvent => computationEvent.result.diaspora);
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
    start: number, end: number, step: number, size: number) {

    // clear buckets if already exist. terminates workers as well
    this.clearTimeStepComputationBucketMap();
    // construct new computation buckets for new space and time variables
    this.constructTimeStepComputationBucketMap(start, end, step);
    // construct final result observable by merging all the step computations
    this.constructResultObservables();
    // this.resetExistingWorkers();
    // start parallel computations 
    Array.from(this.timeStepComputationBucketMap.values()).forEach(bucket => {
      const dt = bucket.dt;
      const dtIndex = bucket.dtIndex;
      bucket.worker.postMessage(JSON.stringify({ dt, dtIndex, initialVector, eigenValues, eigenVectors, basisVectors, size }))
    })

  }

  public stop() {

    this.clearTimeStepComputationBucketMap();
    if (this.operationSubscription) {
      this.operationSubscription.unsubscribe();
    }
    if (this.resultCollectorSuscription) {
      this.resultCollectorSuscription.unsubscribe();
    }

  }

  public start(size: number, start: number, end: number, step: number) {

    this.stop();

    const basisVectors = createVectorBase(size); /** IMPORTANT - vectors are in columns in this matrix */
    let hamiltonianMatrix = this._hamiltonianService.generateHamiltonian(basisVectors);
    let hamiltonianMatrixWithPotential = this._hamiltonianService.addPotential(hamiltonianMatrix);

    const ans = (<any>math).eigs(hamiltonianMatrixWithPotential);
    const { values, vectors } = ans;
    const eigenVectors = vectors;
    const eigenValues = values;
    const initialVector = createInitialVector(size);
    this.deltaTimes = createDeltaTimes(start, end, step);
    this.realPosition = createPosition(size);

    this.startTimelapseComputations(initialVector, eigenValues, eigenVectors, basisVectors, start, end, step, size)
  }


}
