import { Injectable } from "@angular/core";
import * as math from "mathjs";
import { MatrixHelperService } from "./matrix-helper.service";
import {
  N,
  STEP,
  TIME_STEP,
  TIME_END,
  TIME_START,
  createVectorBase
} from "./defaults";
import { HamiltonianService } from "./hamiltonian.service";
const fs = require("fs");
@Injectable({
  providedIn: "root"
})
export class EdCoreService {
  private initialVector: Array<any>;
  private eigenValues: Array<any>;
  private eigenVectors: Array<any>;
  private basisVectors: Array<any>;
  constructor(
    private _matrixHelper: MatrixHelperService,
    private _hamiltonianService: HamiltonianService
  ) {}

  public start() {
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
    this.initialVector = initialVector;
    this.eigenValues = eigenValues;
    this.basisVectors = basisVectors;
    this.eigenVectors = eigenVectors;
    // console.log(this.averagePosition());
    return this.constractParts();
    // retun
  }

  private constractParts() {
    /** Gia kathe xroniki stigmi. Exo ena array me tis pithanotites YR^2 + YI ^2. Kathe element toy array antistixi se mia idiokatastasi toy sistimatos */
    // let finalDataForEachState = [];
    // let deltaTimes = [];
    // let realPosition = [];
    // let avgX = [];
    // let diaspora = [];
    let increment = 0;
    for (let dt = TIME_START; dt < TIME_END; dt += TIME_STEP) {
      console.log(performance.now() * 0.001 + "sec");
      let propabilityForAllStatesPerTime = [];
      let avgs = 0;
      let avgsSquared = 0;
      for (let k = 0; k < N; k++) {
        const propability = this.getPropability(dt, k);
        propabilityForAllStatesPerTime.push(this.getPropability(dt, k));
        avgs += propability * k;
        avgsSquared += propability * Math.pow(k, 2);
      }
      const diasp = Math.sqrt(avgsSquared - Math.pow(avgs, 2));
      // avgX.push(avgs);
      // diaspora.push(diasp);
      // finalDataForEachState.push(propabilityForAllStatesPerTime);
      // deltaTimes.push(dt);
      this.saveData(dt, avgs, diasp, propabilityForAllStatesPerTime, increment);
      increment++;
    }

    // for (let i = 0; i < N; i++) {
    //   // realPosition.push(this._hamiltonianService.relalX(i));
    //   realPosition.push(i);
    // }
    return {
      propabilities: "finalDataForEachState",
      time: "deltaTimes",
      space: "realPosition",
      avgX: "avgX",
      diaspora: "diaspora"
    };
  }
  private saveData(dt, averageX, diaspora, propabilities, indexing) {
    const savedData = {
      time: dt,
      averageX,
      diaspora,
      propabilities
    };
    const nsavedData = JSON.stringify(savedData);
    fs.writeFile(`./ed-data/time${indexing}.json`, nsavedData, function(err) {
      // file saved or err
      console.log("save error", err);
    });
  }
  private getPropability(dt: number, state: number): number {
    let realPart = 0;
    let imageinaryPart = 0;
    for (let i = 0; i < N; i++) {
      for (let m = 0; m < N; m++) {
        const Z_IM_PART = this.createZpart(m, i);
        const Z_KM_PART = this.createZpart(m, state);
        realPart =
          realPart +
          this.initialVector[i] *
            Z_IM_PART *
            Z_KM_PART *
            Math.cos(this.eigenValues[m] * dt);
        imageinaryPart =
          imageinaryPart +
          this.initialVector[i] *
            Z_IM_PART *
            Z_KM_PART *
            Math.sin(this.eigenValues[m] * dt);
      }
    }
    let magnitude = Math.pow(realPart, 2) + Math.pow(imageinaryPart, 2);
    return magnitude;
  }
  private createZpart(m, i): number {
    // <e_m|x_i>
    const x_i = this._matrixHelper.getColVector(this.basisVectors, i);
    const e_m = this._matrixHelper.getRowVector(this.eigenVectors, m);
    const zPartIM = this._matrixHelper.calculateBraKet(x_i, e_m);
    return zPartIM;
  }
}
