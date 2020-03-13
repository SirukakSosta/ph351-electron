import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { ElectricField } from "./electricField";
import { getHFromSize } from "./method";

@Injectable({
  providedIn: "root"
})
export class PdeLabService {
  private voltageMatrix$$ = new BehaviorSubject([] as number[][]);
  public voltageMatrix$ = this.voltageMatrix$$.asObservable();
  private axis$$ = new BehaviorSubject([] as number[]);
  public axis$ = this.axis$$.asObservable();
  public electricField$ = this.voltageMatrix$$.pipe(
    debounceTime(5),
    map(voltageMatrix => ({
      ...this.getVoltageMatrixDerivatives(voltageMatrix),
      voltageMatrix
    })),
    map(({ xVector, yVector, voltageMatrix }) => {
      const SIZE = voltageMatrix.length;
      const derivtionForPlot = [];
      // TODO: we need constant i or j (ask zotos)
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          let x = getRealXY(i);
          let y = getRealXY(j);

          const eX = xVector[i][j];
          const eY = yVector[i][j];
          // const eX = getEx(x, y);
          // const eY = getEy(x, y);
          // const axisPoint = this.lab.axis[j];
          derivtionForPlot.push([x, y, magnitude(eX, eY), radians(eX, eY)]);
        }
      }
      console.log(derivtionForPlot);
      return derivtionForPlot;

      // function getEx(x, y) {
      //   let eq = -1 * (1 - 2 * x) * y * (1 - y);
      //   return eq;
      // }
      // function getEy(x, y) {
      //   let eq = -1 * (1 - 2 * y) * x * (1 - x);
      //   return eq;
      // }
      function magnitude(i, j) {
        const sum = Math.pow(i, 2) + Math.pow(j, 2);
        return Math.sqrt(sum);
      }
      function radians(i, j) {
        let p = j / i;

        let rads: number;
        if ((i <= 0 && j >= 0) || (i <= 0 && j <= 0)) {
          rads = (Math.atan(p) * 180) / Math.PI + 180;
        } else {
          rads = (Math.atan(p) * 180) / Math.PI;
        }
        //becouse atan dont know about the (+-) of xy we need
        // to map it atan 's angle run from -p/2 to p/2 means -90 to 90
        let mapToChats = (-1 * rads + 270) % 360;

        // if (rads < 0) return -1 * rads;
        return mapToChats;
      }

      function getRealXY(i: number) {
        return i / (SIZE - 1);
      }
    })
  );

  constructor() {}

  get voltageMatrix() {
    return this.voltageMatrix$$.getValue();
  }

  set voltageMatrix(e: number[][]) {
    this.voltageMatrix$$.next(e);
  }

  get axis() {
    return this.axis$$.getValue();
  }

  set axis(e: number[]) {
    this.axis$$.next(e);
  }

  private getVoltageMatrixDerivatives(voltageMatrix: number[][]) {
    let tempY = [];
    const size = this.voltageMatrix.length;
    const xDerivativesMatrix = new Array(size)
      .fill(0)
      .map(() => new Array(size).fill(0));
    const yDerivativesMatrix = new Array(size)
      .fill(0)
      .map(() => new Array(size).fill(0));
    const h = getHFromSize(voltageMatrix.length);

    // for (let i = 0; i < size; i++) {
    //   // tempY = [];
    //   // for (let j = 0; j < this.SIZE; j++) {
    //   //   tempY.push(this.lab.voltageMatrix[i][j]);
    //   // }
    //   tempY = getColumnFrom2dArray(voltageMatrix, i);
    //   let calculatedDerivativeY = this.calculateDerivative(tempY, h);

    //   for (let k = 0; k < size; k++) {
    //     xDerivativesMatrix[i][k] = calculatedDerivativeY[k];
    //   }
    // }
    // //End  Calculate y derivative
    // // Start Calculate x derivative

    // let tempX = [];
    // for (let j = 0; j < size; j++) {
    //   tempX = [];
    //   for (let i = 0; i < size; i++) {
    //     tempX.push(voltageMatrix[i][j]);
    //   }

    //   let calculatedDerivativeX = this.calculateDerivative(tempX, h);
    //   for (let p = 0; p < size; p++) {
    //     yDerivativesMatrix[p][j] = calculatedDerivativeX[p];
    //   }
    // }
    let k = new ElectricField(
      this.voltageMatrix,
      getHFromSize(this.voltageMatrix.length)
    );
    console.log(k);
    const { xVector, yVector } = k;
    return { xVector, yVector };
  }

  private calculateDerivative(matrix: any, h: number): Array<number> {
    let temp = matrix;
    let derivatives = [];
    const _H = h;
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

  resetVariables(){
    this.voltageMatrix$$.next([])
    this.axis$$.next([])
  }
}
