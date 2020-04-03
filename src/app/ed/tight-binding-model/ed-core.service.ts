import { Injectable } from "@angular/core";
import * as math from "mathjs";
import { fromEvent, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { createVectorBase, N, TIME_END, TIME_START, TIME_STEP } from "./defaults";
import { HamiltonianService } from "./hamiltonian.service";
import { MatrixHelperService } from "./matrix-helper.service";

// const fs = require("fs");
@Injectable({
  providedIn: "root"
})
export class EdCoreService {

  edWorkers: Worker[] = [];
  // private initialVector: Array<any>;
  // private eigenValues: Array<any>;
  // private eigenVectors: Array<any>;
  // private basisVectors: Array<any>;
  deltaTimes = [];
  realPosition = [];
  constructor(
    private _matrixHelper: MatrixHelperService,
    private _hamiltonianService: HamiltonianService
  ) {

    for (let dt = TIME_START; dt < TIME_END; dt += TIME_STEP) {
      let worker = new Worker('../ed.worker', { type: 'module' });
      fromEvent<MessageEvent>(worker, 'message').pipe(
        map(e => JSON.parse(e.data) as {
          progress: number,
          data: {
            propabilityForAllStatesPerTime: number[],
            diaspora: number[], avgs:
            number[]
          }
        }
        ),
        tap(e => console.log(e)),
        // tap(e => worker.terminate())
      ).subscribe()
      this.edWorkers.push(worker)
    }



  }

  someCPUHeavyFunction(input) {
    // console.log(this)
    return Math.pow(input, lel());

    function lel() {
      return 10
    }
  }

  public start() {

    // const input = 100;
    // const promise = this._webWorkerService.run(this.someCPUHeavyFunction, input);
    // this._webWorkerService.run(this.someCPUHeavyFunction, input).pipe(
    //   tap(e => {
    //     console.log(e)
    //   })
    // ).subscribe()

    let initialVector = this._matrixHelper.generateRandomVector();
    initialVector = this._matrixHelper.normalizeVector(initialVector);
    const basisVectors = createVectorBase(); /** IMPORTANT - vectors are in columns in this matrix */
    let hamiltonianMatrix = this._hamiltonianService.generateHamiltonian(
      basisVectors
    );
    let hamiltonianMatrixWithPotential = this._hamiltonianService.addPotential(
      hamiltonianMatrix
    );

    const ans = (<any>math).eigs(hamiltonianMatrixWithPotential);
    const { values, vectors } = ans;
    const eigenVectors = vectors;
    const eigenValues = values;
    /** IMPORTANT - vectors are in rows in this matrix */
    /** Set global array/ matrices */
    // this.initialVector = initialVector;
    // this.eigenValues = eigenValues;
    // this.basisVectors = basisVectors;
    // this.eigenVectors = eigenVectors;
    // console.log(this.averagePosition());


    for (let dt = TIME_START; dt < TIME_END; dt += TIME_STEP) {
      this.deltaTimes.push(dt);
    }
    for (let i = 0; i < N; i++) {
      // realPosition.push(this._hamiltonianService.relalX(i));
      this.realPosition.push(i);
    }

    return this.constractParts(this._matrixHelper, initialVector, eigenValues, basisVectors, eigenVectors);
    // retun
  }

  private constractParts(_matrixHelper: MatrixHelperService, initialVector: Array<any>, eigenValues: Array<any>, eigenVectors: Array<any>, basisVectors: Array<any>) {
    /** Gia kathe xroniki stigmi. Exo ena array me tis pithanotites YR^2 + YI ^2. Kathe element toy array antistixi se mia idiokatastasi toy sistimatos */
    let finalDataForEachState = [];

    let avgX = [];
    let diaspora = [];
    let increment = 0;

    let delay = 0;

    let obs: Observable<any>[] = [];


    let i = 0
    for (let dt = TIME_START; dt < TIME_END; dt += TIME_STEP) {


      // let worker = new Worker('../ed.worker', { type: 'module' })
      // delay += 1000;

      // worker.postMessage({ dt, initialVector, eigenValues, eigenVectors, basisVectors, _matrixHelper, points: N });
      this.edWorkers[i].postMessage(JSON.stringify({ dt, initialVector, eigenValues, eigenVectors, basisVectors, _matrixHelper, points: N }));
      i++
      // let workerStream$ = fromEvent<MessageEvent>(this.edWorker, 'message').pipe(
      //   map(e => JSON.parse(e.data) as {
      //     progress: number,
      //     data: {
      //       propabilityForAllStatesPerTime: number[],
      //       diaspora: number[], avgs:
      //       number[]
      //     }
      //   }
      //   ),
      //   tap(e => console.log(e))
      // );
      // workerStream$.subscribe()
      // obs.push(workerStream$)



      // obs.push(this._webWorkerService.run(this.calculateVariablesForTimestamp, { dt, initialVector, eigenValues, eigenVectors, basisVectors, _matrixHelper, points: N })
      //   .pipe(
      //     debounceTime(delay),
      //     tap(e => {
      //       console.log(e)
      //     })
      //   ))


    }

    // concat(obs).subscribe()

    // this._webWorkerService.run(this.calculateVariablesForTimestamp, { dt: 0, initialVector, eigenValues, eigenVectors, basisVectors, _matrixHelper, points: N })
    //   .pipe(
    //     // debounceTime(delay),
    //     tap(e => {
    //       console.log(e)
    //     })
    //   ).subscribe()

    // forkJoin(obs).subscribe()


    // for (let i = 0; i < N; i++) {
    //   // realPosition.push(this._hamiltonianService.relalX(i));
    //   realPosition.push(i);
    // }
    return {
      propabilities: finalDataForEachState,
      time: this.deltaTimes,
      space: this.realPosition,
      avgX,
      diaspora
    };
  }

  calculateVariablesForTimestamp(input: {
    dt: number, initialVector: Array<any>, eigenValues: Array<any>, eigenVectors: Array<any>, basisVectors: Array<any>,
    points: number
  }) {
    // console.log(performance.now() * 0.001 + "sec");

    // console.log(this)

    let propabilityForAllStatesPerTime: number[] = [];
    let avgs = 0;
    let avgsSquared = 0;
    for (let k = 0; k < input.points; k++) {

      if ((k % (input.points / 10)) === 0) {
        this['postMessage'](JSON.stringify({ dt: input.dt, progress: (k * 100 / input.points) }))
      }

      const propability = getPropability(input.dt, k);
      propabilityForAllStatesPerTime.push(getPropability(input.dt, k));
      avgs += propability * k;
      avgsSquared += propability * Math.pow(k, 2);
    }
    const diaspora = Math.sqrt(avgsSquared - Math.pow(avgs, 2));
    // avgX.push(avgs);
    // diaspora.push(diasp);
    // finalDataForEachState.push(propabilityForAllStatesPerTime);
    // deltaTimes.push(dt);
    // this.saveData(dt, avgs, diasp, propabilityForAllStatesPerTime, increment);
    // increment++;
    return { propabilityForAllStatesPerTime, diaspora, avgs }

    function getPropability(dt: number, state: number): number {



      let realPart = 0;
      let imageinaryPart = 0;
      for (let i = 0; i < input.points; i++) {
        for (let m = 0; m < input.points; m++) {
          const Z_IM_PART = createZpart(m, i);
          const Z_KM_PART = createZpart(m, state);
          realPart = realPart + input.initialVector[i] * Z_IM_PART * Z_KM_PART * Math.cos(input.eigenValues[m] * dt);
          imageinaryPart = imageinaryPart + input.initialVector[i] * Z_IM_PART * Z_KM_PART * Math.sin(input.eigenValues[m] * dt);
        }
      }
      let magnitude = Math.pow(realPart, 2) + Math.pow(imageinaryPart, 2);
      return magnitude;

      function createZpart(m: number, i: number): number {
        // <e_m|x_i>
        const x_i = getColVector(input.basisVectors, i);
        const e_m = getRowVector(input.eigenVectors, m);
        const zPartIM = calculateBraKet(x_i, e_m);
        return undefined;
      }
      function calculateBraKet(
        columnVector: Array<number>,
        rowVector: Array<number>
      ): number {
        const length = columnVector.length;
        let dotProduct = 0;
        for (let i = 0; i < length; i++) {
          dotProduct = dotProduct + columnVector[i] * rowVector[i];
        }
        return dotProduct;
      }
      function getColVector(basisVectors: Array<Array<number>>, col: number) {
        const N = basisVectors.length;
        let tmp = [];
        for (let row = 0; row < N; row++) {
          tmp.push(basisVectors[row][col]);
        }
        return tmp;
      }
      function getRowVector(basisVectors: Array<Array<number>>, row: number) {
        const N = basisVectors.length;
        let tmp = [];
        for (let col = 0; col < N; col++) {
          tmp.push(basisVectors[row][col]);
        }
        return tmp;
      }
    }
  }

  // private saveData(dt, averageX, diaspora, propabilities, indexing) {
  //   const savedData = {
  //     time: dt,
  //     averageX,
  //     diaspora,
  //     propabilities
  //   };
  //   // const nsavedData = JSON.stringify(savedData);
  //   // fs.writeFile(`./ed-data/time${indexing}.json`, nsavedData, function (err) {
  //   //   // file saved or err
  //   //   console.log("save error", err);
  //   // });
  // }
  // private getPropability(dt: number, state: number): number {
  //   let realPart = 0;
  //   let imageinaryPart = 0;
  //   for (let i = 0; i < N; i++) {
  //     for (let m = 0; m < N; m++) {
  //       const Z_IM_PART = this.createZpart(m, i);
  //       const Z_KM_PART = this.createZpart(m, state);
  //       realPart =
  //         realPart +
  //         this.initialVector[i] *
  //         Z_IM_PART *
  //         Z_KM_PART *
  //         Math.cos(this.eigenValues[m] * dt);
  //       imageinaryPart =
  //         imageinaryPart +
  //         this.initialVector[i] *
  //         Z_IM_PART *
  //         Z_KM_PART *
  //         Math.sin(this.eigenValues[m] * dt);
  //     }
  //   }
  //   let magnitude = Math.pow(realPart, 2) + Math.pow(imageinaryPart, 2);
  //   return magnitude;
  // }
  // private createZpart(m, i): number {
  //   // <e_m|x_i>
  //   const x_i = this._matrixHelper.getColVector(this.basisVectors, i);
  //   const e_m = this._matrixHelper.getRowVector(this.eigenVectors, m);
  //   const zPartIM = this._matrixHelper.calculateBraKet(x_i, e_m);
  //   return zPartIM;
  // }
}
