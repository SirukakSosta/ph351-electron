import { Injectable } from "@angular/core";
import { BehaviorSubject, fromEvent, Subject } from "rxjs";
import { map, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { McWorkerInput, McWorkerOutput } from "./interface";

@Injectable({
  providedIn: "root",
})
export class McCoreService {
  private newExp$: Subject<boolean> = new Subject();
  calculationResults$$: BehaviorSubject<McWorkerOutput[]> = new BehaviorSubject(
    []
  );

  constructor() { }

  start(
    gridSizes: number[],
    J: number,
    B: number,
    K: number,
    ITERATIONS: number,
    T0: number,
    T_MAX: number,
    T_STEP: number,
    spinChangesPerIteration: number
  ) {
    this.newExp$.next(true);
    this.newExp$ = new Subject();
    this.calculationResults$$.next([]);

    for (let gridIndex = 0; gridIndex < gridSizes.length; gridIndex++) {
      const GRID_SIZE = gridSizes[gridIndex];

      let worker = new Worker("./mc.worker", { type: "module" });
      let workerEvent$ = fromEvent<MessageEvent>(worker, "message").pipe(
        map((e) => e.data as McWorkerOutput),
        withLatestFrom(this.calculationResults$$),
        tap(([gridCalculationData, allData]) => {
          allData = allData.filter((e) => e.GRID_SIZE !== GRID_SIZE);
          const calculationResults = [...allData, gridCalculationData];
          this.calculationResults$$.next(calculationResults);
        }),
        takeUntil(
          this.newExp$.pipe(
            tap((e) => {
              worker.terminate();
            })
          )
        )
      );

      const workerInput: McWorkerInput = {
        GRID_SIZE,
        ITERATIONS,
        T0,
        T_MAX,
        T_STEP,
        B: [0],
        J,
        K,
        spinChangesPerIteration,
      };
      worker.postMessage(JSON.stringify(workerInput));


      workerEvent$.subscribe();


    }
  }
}
