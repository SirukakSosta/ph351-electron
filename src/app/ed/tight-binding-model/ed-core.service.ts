import { Injectable } from "@angular/core";
import * as math from "mathjs";
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, Subject, Subscription } from "rxjs";
import { filter, map, shareReplay, startWith, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { chunkArray } from "../../math-common/method";
import { createDeltaTimes, createInitialVector, createPosition, getDxTotalPoints } from "../methods";
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

type WorkerInput = {
  dt: { index: number, value: number }[],
  initialVector: Array<any>,
  eigenValues: Array<any>,
  eigenVectors: Array<any>,
  basisVectors: Array<any>,
  dxStart: number
  dxEnd: number
  dx: number
  postResultsDuringComputation: boolean
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
  workerCount = 5;
  progress$: Observable<number>;

  private destroyExp$: Subject<number>;

  constructor(private _hamiltonianService: HamiltonianService) {



  }

  private constructResultObservables() {

    const buckets = Array.from(this.timeStepComputationBucketMap.values())
    const computationEvents$ = buckets.map(bucket => bucket.workerEvent$.pipe(startWith({ dt: bucket.dt, dtIndex: bucket.dtIndex, progress: 0, result: null })));


    this.resultCollectorSuscription = combineLatest(computationEvents$).pipe(
      // sampleTime(this.refreshLatency),
      // set time steps

      tap(computationEvents => {
        console.log(computationEvents)
        // const timeSteps = computationEvents.map(computationEvent => computationEvent.result.propabilityForAllStates);
        this.timeStepResultsAggregate$$.next(computationEvents)
      }),
      takeUntil(this.destroyExp$)
      // filter(computationEvents => !!computationEvents.filter(computationEvent => !!computationEvent.result).length),


    ).subscribe()


    this.progress$ = this.timeStepResultsAggregate$$.pipe(
      map(computationEvents => {

        let progress = 0;
        const progressArray = computationEvents.map(computationEvent => computationEvent.progress);
        if (progressArray.length) {
          progress = progressArray.reduce((a, b) => a + b) / computationEvents.length;
        }
        return progress

      }),
      takeUntil(this.destroyExp$)
    )

    this.progress$.pipe(
      filter(e => e === 100),
      withLatestFrom(this.timeStepResultsAggregate$),
      tap(([progress, computationEvents]) => {
        const average = computationEvents
          .filter(computationEvent => !!computationEvent.result && !!computationEvent.result.avgs)
          .map(computationEvent => computationEvent.result.avgs);
        this.average$$.next(average)
      }),
      takeUntil(this.destroyExp$)
    ).subscribe()

    this.progress$.pipe(
      filter(e => e === 100),
      withLatestFrom(this.timeStepResultsAggregate$),
      tap(([progress, computationEvents]) => {
        // set diaspora
        const diaspora = computationEvents
          .filter(computationEvent => !!computationEvent.result && !!computationEvent.result.diaspora)
          .map(computationEvent => computationEvent.result.diaspora);
        this.diaspora$$.next(diaspora)
      }),
      takeUntil(this.destroyExp$)
    ).subscribe()

    this.operationSubscription = merge(...computationEvents$).pipe(
      takeUntil(this.destroyExp$)
    ).subscribe(e => {
      // console.log(e)
    })

  }

  private clearTimeStepComputationBucketMap() {

    this.timeStepComputationBucketMap.forEach(e => {
      if (e.worker) {
        e.worker.terminate();
      }
    })
    this.timeStepComputationBucketMap.clear()

  }

  private startTimelapseComputations(dxStart: number, dxEnd: number, dx: number,
    initialVector: Array<any>, eigenValues: Array<any>, eigenVectors: Array<any>, basisVectors: Array<any>,
    dtStart: number, dtEnd: number, dtStep: number, postResultsDuringComputation: boolean) {

    // clear buckets if already exist. terminates workers as well
    this.clearTimeStepComputationBucketMap();
    // construct new computation buckets for new space and time variables



    let dtIndex = 0;
    for (let dt = dtStart; dt < dtEnd; dt += dtStep) {
      this.timeStepComputationBucketMap.set(dt, { worker: undefined, workerEvent$: undefined, dt, dtIndex })
      dtIndex++
    }

    // split Dt computation buckets in chunks. chunk total number is worker count.
    const buckets = Array.from(this.timeStepComputationBucketMap.values());
    const bucketSlices = chunkArray(buckets, Math.ceil(buckets.length / this.workerCount));

    bucketSlices.forEach(bucketSlice => {

      console.log(bucketSlice)

      const worker = new Worker('../ed.worker', { type: 'module' });

      // set computation worker event 
      bucketSlice.forEach(bucket => {
        const workerEvent$ = fromEvent<MessageEvent>(worker, 'message')
          .pipe(
            map(e => JSON.parse(e.data) as EdComputationWorkerEvent),
            filter(computationEvent => computationEvent.dtIndex === bucket.dtIndex)
          );

        this.timeStepComputationBucketMap.set(bucket.dt, { worker, workerEvent$, dt: bucket.dt, dtIndex: bucket.dtIndex })
      })

      const dt = bucketSlice.map(bucket => ({ index: bucket.dtIndex, value: bucket.dt }))

      const workerInput: WorkerInput = {
        dxStart, dxEnd, dx, dt, initialVector, eigenValues, eigenVectors, basisVectors, postResultsDuringComputation
      }

      worker.postMessage(JSON.stringify(workerInput))

    })

    // construct final result observable by merging all the step computations
    this.constructResultObservables();

  }

  public reset() {

    if (this.destroyExp$) {
      this.destroyExp$.next(0)
      this.destroyExp$.complete()
    }
    this.destroyExp$ = new Subject()
    this.clearTimeStepComputationBucketMap();

  }

  public start(dxStart: number, dxEnd: number, dx: number, dtStart: number, dtEnd: number, dt: number, waveFunction: string,
    potentialFunction: string, postResultsDuringComputation: boolean) {

    console.log('Experiment start')
    this.reset();
    console.log('Previous experiments cleared')

    const totalPoints = getDxTotalPoints(dxEnd, dx)

    const basisVectors = createVectorBase(totalPoints); /** IMPORTANT - vectors are in columns in this matrix */
    console.log('basisVectors created', basisVectors)
    let hamiltonianMatrix = this._hamiltonianService.generateHamiltonian(basisVectors);
    let hamiltonianMatrixWithPotential = this._hamiltonianService.addPotential(hamiltonianMatrix, potentialFunction, dxEnd, dx);

    console.log('hamiltonian created', hamiltonianMatrixWithPotential)

    const ans = (<any>math).eigs(hamiltonianMatrixWithPotential);
    const { values, vectors } = ans;
    const eigenVectors = vectors;

    // console.log('eigenVectors', eigenVectors)

    const eigenValues = values;
    const isOrthogonal = this.isOrthogonal(eigenVectors)

    const initialVector = createInitialVector(totalPoints, waveFunction);
    this.deltaTimes = createDeltaTimes(dtStart, dtEnd, dt);
    this.realPosition = createPosition(totalPoints, dxStart);

    console.log('Start of timelapse computations')
    this.startTimelapseComputations(dxStart, dxEnd, dx, initialVector, eigenValues, eigenVectors, basisVectors, dtStart, dtEnd, dt, postResultsDuringComputation)
  }

  isOrthogonal(eigenVectors: number[][]) {

    // let initialVector = eigenVectors[68];
    // console.log(calculateBraKet(initialVector,eigenVectors[69]))
    // for (let i = 1; i < eigenVectors.length; i++) {

    //   console.log(calculateBraKet(initialVector, eigenVectors[i]))


    // }

  }

}
