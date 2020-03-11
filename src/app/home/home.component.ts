import { Component, OnInit } from "@angular/core";
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
  energy = 0;
  action: string;
  voltageMatrix: number[][];
  chargeMatrix: number[][];
  axis: number[] = [];
  yDerivativesMatrix: number[][]; /**oritontio */
  xDerivativesMatrix: number[][]; /** katheto */
  loading = false;
  poissonEquation: string = "$-\\nabla^2\\Phi(x,y) = S(x,y)$";
  chargeEquationLatex = "$S(x,y) = x(1-x)y(1-y)$";
  constantY = 0;
  derivtionForPlot = [];
  constructor() { }

  ngOnInit(): void { }
  public start() {
    this.ready = false;
    this.loading = true;
    setTimeout(() => {
      this.SIZE = Number(this.SIZE);
      this.ITERATIONS = Number(this.ITERATIONS);
      this.H = Number(1 / this.SIZE);
      this.OMEGA = Number(this.OMEGA);
      this.constantY = this.SIZE / 2;
      this.initializeMatrices();
      this.emptyMainArrays();
      this.initialiseVoltageMatrixWithRandomValues();
      this.fillChargeMatrixWithValues();
      // 
      // 
      // return;
      this.startIteration();
      // this.derivativesMatrix = this.calculateDerivative(this.voltageMatrix);


      this.ready = true;
      this.loading = false;
    }, 4000);
  }
  private startIteration() {

    for (let k = 0; k < this.ITERATIONS; k++) {
      for (let i = 0; i < this.SIZE; i++) {
        for (let j = 0; j < this.SIZE; j++) {
          const prevVoltageValue = this.calculatePotential(i, j);
          //   
          this.voltageMatrix[i][j] = prevVoltageValue;
        }
      }
      ///fml
      // 
    }

    this.energy =
      Math.round(
        (this.calculateTotalEnergy(this.voltageMatrix) + Number.EPSILON) * 10000
      ) / 10000;

    this.calculateDerivativeMatrices();
    console.log(this.xDerivativesMatrix)
    console.log(this.yDerivativesMatrix)
    this.createElectricFieldData()
    console.log(this.derivtionForPlot)


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
        this.xDerivativesMatrix = new Array(this.SIZE)
          .fill(0)
          .map(() => new Array(this.SIZE).fill(0));
        this.yDerivativesMatrix = new Array(this.SIZE)
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
  private calculateDerivativeMatrices() {
    // Start Calculate y derivative
    let tempY = [];
    for (let i = 0; i < this.SIZE; i++) {

      tempY = [];
      for (let j = 0; j < this.SIZE; j++) {
        tempY.push(this.voltageMatrix[i][j]);
      }
      let calculatedDerivativeY = this.calculateDerivative(tempY);

      for (let k = 0; k < this.SIZE; k++) {

        this.xDerivativesMatrix[i][k] = calculatedDerivativeY[k];
      }
    }
    //End  Calculate y derivative
    // Start Calculate x derivative

    let tempX = [];
    for (let j = 0; j < this.SIZE; j++) {

      tempX = [];
      for (let i = 0; i < this.SIZE; i++) {
        tempX.push(this.voltageMatrix[i][j]);
      }

      let calculatedDerivativeX = this.calculateDerivative(tempX);
      for (let p = 0; p < this.SIZE; p++) {
        this.yDerivativesMatrix[p][j] = calculatedDerivativeX[p];
      }
    }
    //End  Calculate x derivative
  }
  private createElectricFieldData() {
    const constantY = 1;

    for (let l = 0; l < this.SIZE; l++) {
      const x = this.xDerivativesMatrix[l][constantY];
      const y = this.yDerivativesMatrix[l][constantY];
      this.derivtionForPlot.push([x, y, magnitude(x, y), radians(x, y)]);
    }

    function magnitude(i, j) {
      const sum = Math.pow(i, 2) + Math.pow(j, 2)
      return Math.sqrt(sum)
    }
    function radians(i, j) {
      if (j == 0) {
        return 0;
      } else {
        return Math.atan((j / i));
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
        if (i < this.SIZE - 2 || j < this.SIZE - 2) {
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
      temp.push(matrix[i]);
    }
    for (let i = 0; i < temp.length; i++) {
      if (i === 0 || i === temp.length - 1) {
        derivatives.push(0);
      }
      else if (i === temp.length - 2) {
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
    // const result = Math.pow(this.H, 2) * 12 * (Math.pow(x, 2));
    return result;
  }
  private getRandomValues(): number {
    const random = Math.floor(Math.random() * (1000 - 100) + 100) / 10000;
    return random;
  }
  private emptyMainArrays(): void {
    for (let i = 0; i < this.SIZE; i++) {
      this.energy = 0;
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
