import { Injectable } from "@angular/core";
import * as math from "mathjs";

/** Constants */
const N = 10; /** Grid size */
const step = 1 / N; /** Step */
@Injectable({
  providedIn: "root"
})
export class EdCoreService {
  constructor() {}

  public start() {
    let initialVector = [1, 1, 1, 0, 1, 2, 1, 0, 2, 1];
    initialVector = this.normalizeVector(initialVector);
    const basisVectors = this.createVectorBase(); /** IMPORTANT - vectors are in columns in this matrix */
    const hamiltonianMatrix = this.hamiltonianMatrix(basisVectors);
    const ans = (<any>math).eigs(hamiltonianMatrix);
    const { values, vectors } = ans;
    const eigenValues = values;
    /** IMPORTANT - vectors are in rows in this matrix */
    const eigenVectors = vectors;
    return this.constractParts(
      initialVector,
      eigenValues,
      eigenVectors,
      basisVectors
    );
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

      const firstPart = this.calculateketBra(firstPartColumn, firstPartRow);
      const secondPart = this.calculateketBra(secondPartColumn, secondPartRow);

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
  private constractParts(
    initialVector,
    eigenValues,
    eigenVectors,
    basisVectors
  ) {
    let m = 1;
    let i = 1;
    // lets find k = 4;
    const k = 8;
    let finalData = [];
    for (let dt = 0.1; dt < 50; dt += 0.01) {
      let realPart = 0;
      let imageinaryPart = 0;
      for (let i = 0; i < N; i++) {
        for (let m = 0; m < N; m++) {
          const Z_IM_PART = this.createZpart(m, i, eigenVectors, basisVectors);
          const Z_KM_PART = this.createZpart(m, k, eigenVectors, basisVectors);
          realPart =
            realPart +
            initialVector[i] *
              Z_IM_PART *
              Z_KM_PART *
              Math.cos(eigenValues[m] * dt);
          imageinaryPart =
            imageinaryPart +
            initialVector[i] *
              Z_IM_PART *
              Z_KM_PART *
              Math.sin(eigenValues[m] * dt);
        }
      }
      let magnitude = Math.pow(realPart, 2) + Math.pow(imageinaryPart, 2);
      finalData.push({ time: dt, mag: magnitude });
    }
    return finalData;
  }
  private createZpart(m, i, eigenVectors, basisVectors): number {
    // <e_m|x_i>
    const x_i = this.columnVector(basisVectors, i);
    const e_m = this.rowVector(eigenVectors, m);
    const zPartIM = this.calculateBraKet(x_i, e_m);
    return zPartIM;
  }
  private calculateketBra(
    columnVector: Array<number>,
    rowVector: Array<number>
  ): Array<Array<any>> {
    let currentMatrix = new Array(N).fill(0).map(() => new Array(N).fill(0));
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        currentMatrix[row][col] = columnVector[row] * rowVector[col];
      }
    }
    return currentMatrix;
  }
  private calculateBraKet(
    columnVector: Array<number>,
    rowVector: Array<number>
  ): number {
    let dotProduct = 0;
    for (let i = 0; i < N; i++) {
      dotProduct = dotProduct + columnVector[i] * rowVector[i];
    }
    return dotProduct;
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
  private normalizeEigenVectors(
    eigenVectors: Array<Array<any>>
  ): Array<Array<any>> {
    let tmp = new Array(N).fill(0).map(() => new Array(N).fill(0));
    for (let row = 0; row < N; row++) {
      let count = 0;
      for (let col = 0; col < N; col++) {
        count = count + Math.pow(eigenVectors[row][col], 2);
      }
      for (let i = 0; i < N; i++) {
        tmp[row][i] = eigenVectors[row][i] / Math.sqrt(count);
      }
    }
    return tmp;
  }
  private normalizeVector(vector: Array<number>): Array<number> {
    let tmp = [];
    let count = 0;
    for (let i = 0; i < N; i++) {
      count = count + Math.pow(vector[i], 2);
    }
    count = Math.sqrt(count);

    for (let i = 0; i < N; i++) {
      tmp.push(vector[i] / count);
    }
    return tmp;
  }
}
