import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { ElectricField } from "./electricField";
import { getHFromSize, getRealXY, magnitude, radians } from "./method";

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
      ...this.getVoltageMatrixDerivatives(),
      voltageMatrix
    })),
    map(({ xVector, yVector, voltageMatrix }) => {
      const SIZE = voltageMatrix.length;
      let derivtionForPlot: [number, number, number, number][] = [];
      // TODO: we need constant i or j (ask zotos)
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {

          let x = getRealXY(i, SIZE);
          let y = getRealXY(j, SIZE);

          const eX = xVector[i][j];
          const eY = yVector[i][j];
          const mag = magnitude(eX, eY);
          const rad = radians(eX, eY);
          derivtionForPlot.push([x, y, mag, rad]);
        }
      }
      console.log(derivtionForPlot);
      return derivtionForPlot;


    })
  );

  constructor() { }

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

  private getVoltageMatrixDerivatives() {

    let k = new ElectricField(
      this.voltageMatrix,
      getHFromSize(this.voltageMatrix.length)
    );
    console.log(k);
    const { xVector, yVector } = k;
    return { xVector, yVector };
  }

  resetVariables() {
    this.voltageMatrix$$.next([])
    this.axis$$.next([])
  }

}
