import { Injectable } from "@angular/core";
import { N } from "./defaults";
@Injectable({
  providedIn: "root"
})
export class HamiltonianService {
  constructor() {}
  public addPotential(
    oldHamiltonian: Array<Array<number>>
  ): Array<Array<number>> {
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
  public potentialFunction(i: number): number {
    const x = this.relalX(i);
    const factor = 1;
    const harmonicOscilator = factor * Math.pow(x, 2);
    return harmonicOscilator;
    // x = transform i to real x
  }

  private relalX(i: number): number {
    const x = i / (N - 1);
    return x;
  }
}
