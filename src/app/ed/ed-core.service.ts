import { Injectable } from "@angular/core";
import * as math from "mathjs";

/** Constants */
const N = 4; /** Grid size */
const step = 1 / N; /** Step */
@Injectable({
  providedIn: "root"
})
export class EdCoreService {
  constructor() {
    const initialVector = [];
    const basisVectors = this.createVectorBase();
    console.log("BasiVector Created");
    const hamiltonianMatrix = this.hamiltonianMatrix(basisVectors);
    console.log("hamiltonianMatrix Created");
    console.table(hamiltonianMatrix);
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
      console.log(
        "----------------------------------------------------------------------"
      );
      console.log("Hamiltonian N=", i);
      /** Sunoriaki sinithiki */
      if (i === N - 1) {
        k = -1; /** gia na girisi sosta sti mideniki thesi */
      } else {
        k = i;
      }
      console.log("BRACKETS");
      console.log(`|${k + 1}><${i}|`);
      console.log(`|${i}><${k + 1}|`);
      const firstPartColumn = this.columnVector(basisVectors, k + 1);
      const firstPartRow = this.rowVector(basisVectors, i);
      const secondPartColumn = this.columnVector(basisVectors, i);
      const secondPartRow = this.rowVector(basisVectors, k + 1);

      const firstPart = this.calculateketBra(firstPartColumn, firstPartRow);
      const secondPart = this.calculateketBra(secondPartColumn, secondPartRow);
      // console.table(firstPart);
      // console.table(secondPart);
      /** Add the two matrices for N step */
      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          tmp[row][col] = firstPart[row][col] + secondPart[row][col];
          hamiltonian[row][col] =
            hamiltonian[row][col] + firstPart[row][col] + secondPart[row][col];
        }
      }
      // console.table(tmp);
      console.log(
        "----------------------------------------------------------------------"
      );
    }

    return hamiltonian;
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
