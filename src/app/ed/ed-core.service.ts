import { Injectable } from "@angular/core";
import * as MathJS from "mathjs";

/** Constants */
const N = 10; /** Grid size */
const step = 1 / N; /** Step */
@Injectable({
  providedIn: "root"
})
export class EdCoreService {
  constructor() {
    const initialVector = [];
    const basisVectors = this.createVectorBase();
    console.table(basisVectors);
  }

  private createVectorBase(): Array<Array<number>> {
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
}
