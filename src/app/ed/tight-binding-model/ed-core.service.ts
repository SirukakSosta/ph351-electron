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
    let states = [];
    // for (let k = 0; k < N; k++) {
    let finalDataForEachState = [];
    for (let dt = TIME_START; dt < TIME_END; dt += TIME_STEP) {
      finalDataForEachState.push({
        time: dt,
        mag: this.getPropability(dt, 50)
      });
    }
    states.push(finalDataForEachState);
    // }
    return states;
  }
  private averagePosition() {
    let averageXOverTime = [];
    for (let dt = TIME_START; dt < TIME_END; dt += TIME_STEP) {
      console.log(
        `dt is ${dt}--------------------------------------------------`
      );

      let propabilityOverAllStates = 0;
      let test = "";
      for (let k = 0; k < N; k++) {
        const propability = this.getPropability(dt, k);
        test += ", " + propability.toFixed(4);
        propabilityOverAllStates += propability;
        // console.log("k", k, propability);
      }
      averageXOverTime.push(propabilityOverAllStates);
      // console.log(test + "----" + propabilityOverAllStates);
      console.log(`--------------------------------------------------`);
    }

    // console.log(test);
    return averageXOverTime;
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
