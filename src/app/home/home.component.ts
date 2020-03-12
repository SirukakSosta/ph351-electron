import { Component, OnInit } from "@angular/core";
// constants
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  OMEGA = 0.3;
  SIZE: number = 30;
  H = 1 / (this.SIZE - 1);
  ITERATIONS: number = 3000;
  ready: boolean = false;
  energy = 0;
  action: string;
  voltageMatrix: number[][];
  chargeMatrix: number[][];
  axis: number[] = [];
  yDerivativesMatrix: number[][]; /**oritontio */
  xDerivativesMatrix: number[][]; /** katheto */
  loading = false;
  poissonEquation: string = "\\nabla^2\\Phi(x,y) = S(x,y)";
  chargeEquationLatex = "S(x,y) = x(1-x)y(1-y)";
  constantY = 0;
  derivtionForPlot = [];
  constructor() {}

  ngOnInit(): void {
    let test = [0, 1, 2, 1, 3, 2, 2, 2, 3, 0];
    this.H = 1 / 10;
    const lk = this.calculateDerivative(test);
    console.log(test);
    console.log(lk);
  }
  public start() {
    this.ready = false;
    this.loading = true;
    setTimeout(() => {
      this.SIZE = Number(this.SIZE);
      this.ITERATIONS = Number(this.ITERATIONS);
      this.H = Number(1 / (this.SIZE - 1));
      console.log("Size - 1", this.H);
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
    console.log("voltage", this.voltageMatrix);
    console.log("difx", this.xDerivativesMatrix);
    console.log("dify", this.yDerivativesMatrix);
    this.createElectricFieldData();
    console.log(this.derivtionForPlot);
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
    let _this = this;
    const constantY = 1;
    // TODO: we need constant i or j (ask zotos)
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        let x = _this.getRealXY(i);
        let y = _this.getRealXY(j);

        const eX = this.xDerivativesMatrix[i][j];
        const eY = this.yDerivativesMatrix[i][j];
        // const eX = getEx(x, y);
        // const eY = getEy(x, y);
        const axisPoint = this.axis[j];
        this.derivtionForPlot.push([x, y, magnitude(eX, eY), radians(eX, eY)]);
      }
    }

    function roundMe(val) {
      return Math.round((val + Number.EPSILON) * 10000) / 10000;
    }
    function getEx(x, y) {
      let eq = (1 - 2 * x) * y * (1 - y);
      return eq;
    }
    function getEy(x, y) {
      let eq = (1 - 2 * y) * x * (1 - x);
      return eq;
    }
    function magnitude(i, j) {
      const sum = Math.pow(i, 2) + Math.pow(j, 2);
      return Math.sqrt(sum);
    }
    function radians(i, j) {
      if (i == 0) {
        return 0;
      } else {
        let rads = (Math.atan(j / i) * 180) / Math.PI;
        let mapToChats = (-1 * rads + 270) % 360;

        // if (rads < 0) return -1 * rads;
        return mapToChats;
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
    let temp = matrix;
    let derivatives = [];
    const _H = this.H;
    for (let i = 0; i < temp.length; i++) {
      if (i === 0) {
        derivatives.push(frontDerivative(i));
      } else if (i === temp.length - 1) {
        derivatives.push(backDerivative(i));
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
