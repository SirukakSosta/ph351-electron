import { Component, OnInit } from "@angular/core";
import BigNumber from "bignumber.js";
// constants
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  OMEGA = new BigNumber(1.2);
  SIZE = 10;
  H = new BigNumber(1).div(this.SIZE - 1);
  ITERATIONS: number = 20;
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

  voltageMatrix: BigNumber[][];
  chargeMatrix: BigNumber[][];
  axis: BigNumber[] = [];

  constructor() {}

  ngOnInit(): void {}

  public start() {
    this.OMEGA = new BigNumber(this.OMEGA);
    this.H = new BigNumber(1).div(this.SIZE - 1);
    this.axis = [];
    this.energies = [];
    this.voltageMatrix = new Array(this.SIZE)
      .fill(0)
      .map(() => new Array(this.SIZE).fill(0));

    this.chargeMatrix = new Array(this.SIZE)
      .fill(0)
      .map(() => new Array(this.SIZE).fill(0));

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

      console.log(k);
      this.energies.push(this.calculateTotalEnergy());
    }

    this.graph.data[0].z = this.voltageMatrix.map(arr =>
      arr.map(val => val.toString())
    );
    this.graph.data[0].x = this.axis.map(val => val.toString());
    this.graph.data[0].y = this.axis.map(val => val.toString());
    this.loading = false;
  }

  private getRealXY(i: number) {
    return new BigNumber(i).div(this.SIZE - 1);
  }

  private initializeMatrices(): void {
    for (let i = 0; i < this.SIZE; i++) {
      this.axis.push(this.getRealXY(i));
    }

    this.initialiseVoltageMatrixWithRandomValues();
    this.fillChargeMatrixWithValues();
    // console.log(this.voltageMatrix);
    // console.log(this.chargeMatrix);
  }

  private initialiseVoltageMatrixWithRandomValues(): void {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        console.log(i, j);
        console.log(this.voltageMatrix);
        const atBounds = this.isAtBoundaries(i, j);

        if (atBounds) {
          console.log("at bounds");
          this.voltageMatrix[i][j] = new BigNumber(0);
        } else {
          console.log("no bounds");
          this.voltageMatrix[i][j] = this.getRandomValues();
        }
      }
    }
  }

  private calculateTotalEnergy(): BigNumber {
    let sumOne = new BigNumber(0);
    let sumTwo = new BigNumber(0);

    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        const firstTerm = this.getVoltage(i, j)
          .minus(this.getVoltage(i - 1, j))
          .pow(2);

        const secondTerm = this.getVoltage(i, j)
          .minus(this.getVoltage(i, j - 1))
          .pow(2);

        const thirdTerm = this.chargeMatrix[i][j].pow(2);

        sumOne = sumOne.plus(firstTerm).plus(secondTerm);

        if (i < this.SIZE - 2 || i < this.SIZE - 2) {
          sumTwo = sumTwo.plus(thirdTerm);
        }
      }
    }

    return sumOne.div(2).minus(this.H.pow(2).times(sumTwo));
  }

  private getVoltage(i: number, j: number): BigNumber {
    const isBound = this.isAtBoundaries(i, j);
    if (isBound) return new BigNumber(0);
    return this.voltageMatrix[i][j];
  }

  private fillChargeMatrixWithValues(): void {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        this.chargeMatrix[i][j] = this.chargeEquation(i, j);
      }
    }
  }

  private calculatePotential(i: number, j: number): BigNumber {
    if (this.isAtBoundaries(i, j)) return new BigNumber(0);
    // Equation below: (1 - OMEGA) * matrix[i][j] + (OMEGA / 4) * (matrix[i + 1][j] + matrix[i - 1][j] + matrix[i][j + 1] + matrix[i][j - 1] + chargeMatrix[i][j])
    return this.OMEGA.negated()
      .plus(1)
      .times(this.voltageMatrix[i][j])
      .plus(
        this.OMEGA.div(4).times(
          this.voltageMatrix[i + 1][j]
            .plus(this.voltageMatrix[i - 1][j])
            .plus(this.voltageMatrix[i][j + 1])
            .plus(this.voltageMatrix[i][j - 1])
            .plus(this.chargeMatrix[i][j])
        )
      );
  }

  private chargeEquation(i: number, j: number): BigNumber {
    const x = this.getRealXY(i);
    const y = this.getRealXY(j);
    // Equation Below: H^2 * 2((x - 1) * x + (y - 1) * y);
    return this.H.pow(2).times(
      x
        .times(x.minus(1))
        .plus(y.times(y.minus(1)))
        .times(2)
    );
  }

  // Random in the range (0...1], random() returns [0...1) multiplied by -1 (-1...0] plus 1 (0...1]
  private getRandomValues(): BigNumber {
    return BigNumber.random()
      .negated()
      .plus(1);
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
