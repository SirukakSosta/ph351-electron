import { Injectable } from "@angular/core";
import { createPotentialFunction } from "../methods";
import { MatrixHelperService } from "./matrix-helper.service";
@Injectable({
  providedIn: "root"
})
export class HamiltonianService {
  constructor(private _matrixHelper: MatrixHelperService) { }
  public generateHamiltonian(basisVectors: Array<Array<number>>): Array<Array<number>> {
    const N = basisVectors.length;
    let hamiltonian = new Array(N).fill(0).map(() => new Array(N).fill(0));
    let tmp = new Array(N).fill(0).map(() => new Array(N).fill(0));

    for (let i = 0; i < N; i++) {
      let k = 0;
      if (i === N - 1) {
        k = 1; /** gia na girisi sosta sti mideniki thesi */
      } else if (i === 0) {
        k = N - 2;
      } else {
        k = i;
      }
      const firstPartColumn = this._matrixHelper.getColVector(
        basisVectors,
        k + 1
      );
      const firstPartRow = this._matrixHelper.getRowVector(basisVectors, i);
      const secondPartColumn = this._matrixHelper.getColVector(basisVectors, i);
      const secondPartRow = this._matrixHelper.getRowVector(
        basisVectors,
        k + 1
      );

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
  public addPotential(oldHamiltonian: Array<Array<number>>, potentialFunction: string, dxEnd: number, dx: number): Array<Array<number>> {
    const N = oldHamiltonian.length;
    // let newHamiltonian = new Array(N).fill(0).map(() => new Array(N).fill(0));

    console.log('N', N)
    for (let point = 0; point < N; point++) {

      const scaledPoint = Math.ceil(dx * point);
      const potential = createPotentialFunction(scaledPoint, potentialFunction)

      console.log(point, scaledPoint, potential)
      oldHamiltonian[point][point] = oldHamiltonian[point][point] + potential
    }

    // for (let row = 0; row < N; row++) {
    //   for (let col = 0; col < N; col++) {
    //     //  prostheto stixia mono sth diagonio
    //     if (row === col) {
    //       newHamiltonian[row][col] = oldHamiltonian[row][col] + createPotentialFunction(row * (dx / dxEnd), potentialFunction);
    //     } else {
    //       newHamiltonian[row][col] = oldHamiltonian[row][col];
    //     }
    //   }
    // }
    // return newHamiltonian;
    return oldHamiltonian;
  }
  // public potentialFunction(i: number): number {
  //   // const x = this.relalX(i);
  //   const x = i;
  //   const factor = 1;
  //   const harmonicOscilator = factor * Math.pow(x, 2);
  //   const exam = Math.sin((2 * Math.PI * x) / 10);
  //   const tanoglidis = 0.5 * x;
  //   return tanoglidis;
  //   // x = transform i to real x
  // }

  // public relalX(i: number): number {
  //   const x = i / (N - 1);
  //   return x;
  // }
}
