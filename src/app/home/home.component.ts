import { Component, OnInit } from "@angular/core";
import * as mathjs from "mathjs";
// constants
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  H = 1;
  OMEGA = 1.2;
  SIZE = 50;
  ITERATIONS = 1000;
  loading: boolean;
  energies = [];
  public graph = {
    data: [
      {
        z: [],
        x: [],
        y: [],
        type: "surface",
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: "#42f462",
            project: { z: true }
          }
        }
      }
    ],
    layout: { width: 1200, height: 800, title: "Poisson" }
  };

  voltageMatrix: number[][];
  chargeMatrix: number[][];
  axis: number[] = [];
  constructor() {}

  ngOnInit(): void {}
  public start() {
    this.startIteration();
  }
  private startIteration() {
    this.initializeMatrices();
    for (let k = 0; k < this.ITERATIONS; k++) {
      for (let i = 0; i < this.SIZE; i++) {
        for (let j = 0; j < this.SIZE; j++) {
          const prevVoltageValue = this.calculatePotential(i, j);
          //   console.log(`(${i}, ${j}->)`, point);
          this.voltageMatrix[i][j] = prevVoltageValue;
        }
      }
      ///fml
      console.log(k);
      this.energies.push(this.calculateTotalEnergy(this.voltageMatrix));
    }
    this.graph.data[0].z = this.voltageMatrix;
    this.graph.data[0].x = this.axis;
    this.graph.data[0].y = this.axis;
    this.loading = false;
  }
  private initializeMatrices(): void {
    for (let i = 0; i < this.SIZE; i++) {
      this.axis.push(i);
      for (let j = 0; j < this.SIZE; j++) {
        this.voltageMatrix = new Array(this.SIZE)
          .fill(0)
          .map(() => new Array(this.SIZE).fill(0));
        this.chargeMatrix = new Array(this.SIZE)
          .fill(0)
          .map(() => new Array(this.SIZE).fill(0));
      }
    }

    this.initialiseVoltageMatrixWithRandomValues();
    this.fillChargeMatrixWithValues();
  }
  private initialiseVoltageMatrixWithRandomValues(): void {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        const atBounds = this.isAtBoundaries(i, j);
        if (atBounds) {
          this.voltageMatrix[i][j] = 0.0;
        } else {
          this.voltageMatrix[i][j] = this.getRandomValues();
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
    return Math.pow(this.H, 2) * (2.0 * ((i - 1) * i + (j - 1) * j));
  }
  private getRandomValues(): number {
    return Math.floor(Math.random() * (1000 - 100) + 100) / 10;
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
// const f1 = mathjs.subtract(mathjs.bignumber(1.0), mathjs.bignumber(this.OMEGA));
// const f2 = mathjs.bignumber(this.voltageMatrix[i][j]);
// const f3 = mathjs.divide(mathjs.bignumber(this.OMEGA), mathjs.bignumber(4.0));
// const f4 = mathjs.bignumber(this.voltageMatrix[i + 1][j]);
// const f5 = mathjs.bignumber(this.voltageMatrix[i - 1][j]);
// const f6 = mathjs.bignumber(this.voltageMatrix[i][j + 1]);
// const f7 = mathjs.bignumber(this.voltageMatrix[i][j - 1]);
// const f8 = mathjs.bignumber(this.chargeMatrix[i][j]);
// const sum1 = mathjs.add(f4, f5);
// const sum2 = mathjs.add(f6, f7);
// // const sum3 = mathjs.add(sum2, f8);
// let sumFinal = mathjs.add(sum1, sum2);
// const mult = mathjs.multiply(f1, f2);
