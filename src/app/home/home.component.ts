import { Component, OnInit } from "@angular/core";
import * as mathjs from "mathjs";
// constants
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  OMEGA = 0.3;
  SIZE: number = 50;
  H = 1 / this.SIZE;
  ITERATIONS: number = 500;
  ready: boolean = false;
  energies = new Array(this.SIZE).fill(0);
  action: string;
  voltageMatrix: number[][];
  chargeMatrix: number[][];
  axis: number[] = [];
  derivativesMatrix = [];
  constructor() {}

  ngOnInit(): void {}
  public start() {
    this.ready = false;
    setTimeout(() => {
      this.SIZE = Number(this.SIZE);
      this.ITERATIONS = Number(this.ITERATIONS);
      this.H = Number(1 / this.SIZE);
      this.OMEGA = Number(this.OMEGA);

      this.initializeMatrices();
      this.emptyMainArrays();
      this.initialiseVoltageMatrixWithRandomValues();
      this.fillChargeMatrixWithValues();
      // console.log(this.voltageMatrix);
      // console.log(this.chargeMatrix);
      // return;
      this.startIteration();
      this.derivativesMatrix = this.calculateDerivative(this.voltageMatrix);

      console.log("this.potentialMatrix[i]", this.voltageMatrix);
      this.ready = true;
    }, 500);
  }
  private startIteration() {
    console.log("H", this.H);
    for (let k = 0; k < this.ITERATIONS; k++) {
      for (let i = 0; i < this.SIZE; i++) {
        for (let j = 0; j < this.SIZE; j++) {
          const prevVoltageValue = this.calculatePotential(i, j);
          //   console.log(`(${i}, ${j}->)`, point);
          this.voltageMatrix[i][j] = prevVoltageValue;
        }
      }
      ///fml
      // console.log(k);
      this.energies[k] = this.calculateTotalEnergy(this.voltageMatrix);
    }
  }
  private getRealXY(i: number) {
    return i / (this.SIZE - 1);
  }
  private initializeMatrices(): void {
    for (let i = 0; i < this.SIZE; i++) {
      this.axis.push(this.getRealXY(i));
      for (let j = 0; j < this.SIZE; j++) {
        this.voltageMatrix = new Array(this.SIZE)
          .fill(0)
          .map(() => new Array(this.SIZE).fill(0));
        this.chargeMatrix = new Array(this.SIZE)
          .fill(0)
          .map(() => new Array(this.SIZE).fill(0));
      }
    }
  }
  private initialiseVoltageMatrixWithRandomValues(): void {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        const atBounds = this.isAtBoundaries(i, j);
        if (atBounds) {
          this.voltageMatrix[i][j] = 0.0;
        } else {
          const random = this.getRandomValues();
          this.voltageMatrix[i][j] = random;
        }
      }
    }
  }
  private calculateTotalEnergy(a: any): number {
    let sumOne = 0.0;
    let sumTwo = 0.0;
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        let firstTerm = Math.pow(
          this.getVoltage(i, j) - this.getVoltage(i - 1, j),
          2
        );
        let secondTerm = Math.pow(
          this.getVoltage(i, j) - this.getVoltage(i, j - 1),
          2
        );
        let thirdTerm = this.chargeMatrix[i][j] * this.voltageMatrix[i][j];
        sumOne += firstTerm + secondTerm;
        if (i < this.SIZE - 2 || i < this.SIZE - 2) {
          sumTwo += thirdTerm;
        }
      }
    }
    let final = (1.0 / 2.0) * sumOne - Math.pow(this.H, 2) * sumTwo;
    return final;
  }
  private calculateDerivative(matrix: any): Array<number> {
    let temp = [];
    let derivatives = [];
    const _H = this.H;
    for (let i = 0; i < matrix.length; i++) {
      temp.push(matrix[matrix.length / 2][i]);
    }
    for (let i = 0; i < temp.length; i++) {
      if (i === 0) {
        derivatives.push(frontDerivative(i));
      } else if (i === temp.length - 1) {
        derivatives.push(backDerivative(i));
      } else if (i === 1) {
        derivatives.push(frontDerivative(i));
      } else {
        derivatives.push(commonDerivative(i));
      }
    }
    return derivatives;

    function commonDerivative(i: number) {
      let value = (temp[i + 1] - temp[i - 1]) / (2 * _H);
      return value;
    }
    function frontDerivative(i: number) {
      let value = (temp[i + 1] - temp[i]) / _H;
      return value;
    }
    function backDerivative(i: number) {
      let value = (temp[i] - temp[i - 1]) / _H;
      return value;
    }
  }
  private getVoltage(i: number, j: number) {
    const isBound = this.isAtBoundaries(i, j);
    if (isBound) return 0.0;
    return this.voltageMatrix[i][j];
  }
  private fillChargeMatrixWithValues(): void {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        this.chargeMatrix[i][j] = this.chargeEquation(i, j);
      }
    }
  }
  private calculatePotential(i: number, j: number): number {
    if (this.isAtBoundaries(i, j)) return 0.0;
    let p =
      (1 - this.OMEGA) * this.voltageMatrix[i][j] +
      (this.OMEGA / 4.0) *
        (this.voltageMatrix[i + 1][j] +
          this.voltageMatrix[i - 1][j] +
          this.voltageMatrix[i][j + 1] +
          this.voltageMatrix[i][j - 1] +
          this.chargeMatrix[i][j]);
    return p;
  }
  private chargeEquation(i: number, j: number): number {
    const x = this.getRealXY(i);
    const y = this.getRealXY(j);
    const result = Math.pow(this.H, 2) * (2.0 * ((1 - x) * x + (1 - y) * y));
    return result;
  }
  private getRandomValues(): number {
    const random = Math.floor(Math.random() * (1000 - 100) + 100) / 10000;
    return random;
  }
  private emptyMainArrays(): void {
    for (let i = 0; i < this.SIZE; i++) {
      this.energies[i] = 0;
      for (let j = 0; j < this.SIZE; j++) {
        this.chargeMatrix[i][j] = 0;
        this.voltageMatrix[i][j] = 0;
      }
    }
  }
  private isAtBoundaries(i: number, j: number): boolean {
    if (
      i == 0 ||
      j == 0 ||
      i == this.SIZE - 1 ||
      j == this.SIZE - 1 ||
      i < 0 ||
      j < 0 ||
      i > this.SIZE - 1 ||
      j > this.SIZE - 1
    ) {
      return true;
    }
    return false;
  }
}
