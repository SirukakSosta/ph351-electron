import { Injectable } from "@angular/core";
import * as math from "mathjs";
import { MatrixHelperService } from "./matrix-helper.service";

/** Constants */
const N = 10; /** Grid size */
const step = 1 / N; /** Step */
const TIME_START = 0;
const TIME_END = 100;
const TIME_STEP = 0.1;
@Injectable({
  providedIn: "root"
})
export class EdCoreService {
  private initialVector: Array<any>;
  private eigenValues: Array<any>;
  private eigenVectors: Array<any>;
  private basisVectors: Array<any>;
  constructor(private _matrixHelper: MatrixHelperService) {}

  public start() {
    let initialVector = [1, 1, 1, 0, 1, 2, 1, 0, 2, 1];
    initialVector = this._matrixHelper.normalizeVector(initialVector);
    const basisVectors = this.createVectorBase(); /** IMPORTANT - vectors are in columns in this matrix */
    let hamiltonianMatrix = this.hamiltonianMatrix(basisVectors);
    let hamiltonianMatrixWithPotential = this.addPotential(hamiltonianMatrix);
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
    return this.constractParts();
    // retun
  }

  private createVectorBase(): Array<Array<number>> {
    /** kathe sthlh toy pinaka eiai idiodianisma ths bashs */
    let basisVectors = new Array(N).fill(0).map(() => new Array(N).fill(0));
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        if (row === col) {
          basisVectors[row][col] = 1;
        }
      }
    }
    return basisVectors;
  }
  private hamiltonianMatrix(
    basisVectors: Array<Array<number>>
  ): Array<Array<number>> {
    let hamiltonian = new Array(N).fill(0).map(() => new Array(N).fill(0));
    let tmp = new Array(N).fill(0).map(() => new Array(N).fill(0));

    for (let i = 0; i < N; i++) {
      let k = 0;
      if (i === N - 1) {
        k = -1; /** gia na girisi sosta sti mideniki thesi */
      } else {
        k = i;
      }
      const firstPartColumn = this.columnVector(basisVectors, k + 1);
      const firstPartRow = this.rowVector(basisVectors, i);
      const secondPartColumn = this.columnVector(basisVectors, i);
      const secondPartRow = this.rowVector(basisVectors, k + 1);

      const firstPart = this._matrixHelper.calculateketBra(
        firstPartColumn,
        firstPartRow
      );
      const secondPart = this._matrixHelper.calculateketBra(
        secondPartColumn,
        secondPartRow
      );

      /** Add the two matrices for N step */
      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          tmp[row][col] = firstPart[row][col] + secondPart[row][col];
          hamiltonian[row][col] =
            hamiltonian[row][col] + firstPart[row][col] + secondPart[row][col];
        }
      }
    }

    return hamiltonian;
  }
  addPotential(oldHamiltonian: Array<Array<number>>): Array<Array<number>> {
    let newHamiltonian = new Array(N).fill(0).map(() => new Array(N).fill(0));
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        //  prostheto stixia mono sth diagonio
        if (row === col) {
          console.log(this.potentialFunction(row));
          newHamiltonian[row][col] =
            oldHamiltonian[row][col] + this.potentialFunction(row);
        } else {
          newHamiltonian[row][col] = oldHamiltonian[row][col];
        }
      }
    }
    return newHamiltonian;
    return oldHamiltonian;
  }
  potentialFunction(i: number): number {
    const x = this.relalX(i);
    const factor = 1;
    const harmonicOscilator = factor * Math.pow(x, 2);
    return harmonicOscilator;
    // x = transform i to real x
  }
  relalX(i: number): number {
    const x = i / (N - 1);
    return x;
  }
  private constractParts() {
    let m = 1;
    let i = 1;
    // lets find k = 4;
    const k = 8;
    let states = [];
    for (let k = 0; k < N; k++) {
      let finalDataForEachState = [];
      for (let dt = TIME_START; dt < TIME_END; dt += TIME_STEP) {
        finalDataForEachState.push({
          time: dt,
          mag: this.getPropability(dt, k)
        });
      }
      states.push(finalDataForEachState);
    }
    return states;
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
    const x_i = this.columnVector(this.basisVectors, i);
    const e_m = this.rowVector(this.eigenVectors, m);
    const zPartIM = this._matrixHelper.calculateBraKet(x_i, e_m);
    return zPartIM;
  }

  private columnVector(basisVectors, col) {
    let tmp = [];
    for (let row = 0; row < N; row++) {
      tmp.push(basisVectors[row][col]);
    }
    return tmp;
  }
  private rowVector(basisVectors, row) {
    let tmp = [];
    for (let col = 0; col < N; col++) {
      tmp.push(basisVectors[row][col]);
    }
    return tmp;
  }
}
