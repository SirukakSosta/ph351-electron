import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AM } from "../interface";
import { PdeLabService } from "../pde-lab.service";
import { exerciseChargeEquationMap, _chargeEquation } from "../variable";
import { getRealXYByIndexLatticeSizeBoundaryLength } from "../method";

// constants
@Component({
  selector: "app-pde-wrapper",
  templateUrl: "./pde-wrapper.component.html",
  styleUrls: ["./pde-wrapper.component.scss"]
})
export class PdeWrapperComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  OMEGA = 0.3;
  SIZE: number = 30;
  H = 1 / (this.SIZE - 1);
  ITERATIONS: number = 3000;
  ready: boolean = false;
  energy = 0;
  chargeMatrix: number[][];
  loading = false;
  poissonEquation: string = "\\nabla^2\\Phi(x,y) = S(x,y)";
  chargeEquationLatex: string;
  exerciseSubscription: Subscription;
  voltageMatrixHasBeenCalculated = this.lab.voltageMatrix$.pipe(map(e => !!e[0] && !!e[0].length));
  chargeEquationStr = 'Math.sin(2 * Math.PI * x / 8) * Math.exp(-1 * Math.pow(y,2) /10)';
  chargeEquationStrValid: boolean = true;
  boundaryCharge = {
    top: 0,
    bottom: 0,
    left: -1,
    right: 1
  }

  constructor(private route: ActivatedRoute, public lab: PdeLabService, private router: Router) { }

  checkChargeEquationStrValidity(val: string) {

    const x = 1, y = 1, h = 1;
    this.chargeEquationStrValid = true
    try {
      const ff = _chargeEquation(val, x, y, h)
      if (Number.isNaN(ff)) {
        this.chargeEquationStrValid = false;
      }
    } catch (error) {
      this.chargeEquationStrValid = false;

    }

  }

  ngOnInit(): void {

    this.lab.chargeEquationStr = this.chargeEquationStr;

    this.exerciseSubscription = this.route.paramMap
      .pipe(
        tap(paramMap => {

          if (paramMap.has("am")) {
            const exercise = paramMap.get("am") as AM;
            this.lab.resetVariables();
            this.chargeEquationStr = exerciseChargeEquationMap[exercise]
            this.chargeEquationStrValid = true;
          } else {
            this.router.navigate(['eq', '3943'], { relativeTo: this.route })
          }
        })
      )
      .subscribe();

    this.lab.axis$.subscribe(e => {
      console.log(e)
    })

    // this.H = 1 / 10;
  }
  public start() {

    this.lab.chargeEquationStr = this.chargeEquationStr;
    this.ready = false;
    this.loading = true;
    setTimeout(() => {

      this.SIZE = Number(this.SIZE);
      this.ITERATIONS = Number(this.ITERATIONS);
      this.H = Number(1 / (this.SIZE - 1));
      console.log("Size - 1", this.H);
      this.OMEGA = Number(this.OMEGA);
      // this.constantY = this.SIZE / 2;
      this.energy = 0;

      this.lab.resetVariables();
      this.initializeMatrices();
      this.initialiseVoltageMatrixWithRandomValues();
      this.fillChargeMatrixWithValues();

     
      this.startIteration();

      this.ready = true;
      this.loading = false;
    }, 4000);
  }
  private startIteration() {

    // 
    for (let k = 0; k < this.ITERATIONS; k++) {
      for (let i = 0; i < this.SIZE; i++) {
        for (let j = 0; j < this.SIZE; j++) {
          const prevVoltageValue = this.calculatePotential(i, j);
          this.lab.voltageMatrix[i][j] = prevVoltageValue;
        }
      }
    }

    this.energy = Math.round((this.calculateTotalEnergy() + Number.EPSILON) * 10000) / 10000;

  }

  /**
   * Create a new 2d voltage matrix and fill with value 0
   * 
   * Create a new 2d charge matrix and fill with value 0
   * 
   *  Create a new 2d axis matrix and fill with the axis real position values
   
  */
  private initializeMatrices(): void {
    const axis: number[] = [];
    for (let i = 0; i < this.SIZE; i++) {
      axis.push(getRealXYByIndexLatticeSizeBoundaryLength(i, this.SIZE, this.lab.xStart, this.lab.xEnd));

      for (let j = 0; j < this.SIZE; j++) {
        this.lab.voltageMatrix = new Array(this.SIZE)
          .fill(0)
          .map(() => new Array(this.SIZE).fill(0));
        this.chargeMatrix = new Array(this.SIZE)
          .fill(0)
          .map(() => new Array(this.SIZE).fill(0));
      }
    }

    this.lab.axis = axis;

  }

  private initialiseVoltageMatrixWithRandomValues(): void {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        const atBounds = this.isAtBoundaries(i, j);
        if (atBounds) {
          this.lab.voltageMatrix[i][j] = this.getBoundaryChargeBySide(atBounds);
        } else {
          const random = this.getRandomValues();
          this.lab.voltageMatrix[i][j] = random;
        }
      }
    }
  }

  private calculateTotalEnergy(): number {
    let sumOne = 0.0;
    let sumTwo = 0.0;
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        let firstTerm = Math.pow(this.getVoltage(i, j) - this.getVoltage(i - 1, j), 2);
        let secondTerm = Math.pow(this.getVoltage(i, j) - this.getVoltage(i, j - 1), 2);
        let thirdTerm = this.chargeMatrix[i][j] * this.lab.voltageMatrix[i][j];
        sumOne += firstTerm + secondTerm;
        if (i < this.SIZE - 2 || j < this.SIZE - 2) {
          sumTwo += thirdTerm;
        }
      }
    }
    let final = (1.0 / 2.0) * sumOne - Math.pow(this.H, 2) * sumTwo;
    return final;
  }

  private getVoltage(i: number, j: number) {
    const isBound = this.isAtBoundaries(i, j);
    if (isBound) {
      return this.getBoundaryChargeBySide(isBound);
    };
    return this.lab.voltageMatrix[i][j];
  }
  private fillChargeMatrixWithValues(): void {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        this.chargeMatrix[i][j] = this.calculateCharge(i, j);
      }
    }
  }
  private calculatePotential(i: number, j: number): number {
    const isBound = this.isAtBoundaries(i, j);
    if (isBound) {
      return this.getBoundaryChargeBySide(isBound);
    };
    let p =
      (1 - this.OMEGA) * this.lab.voltageMatrix[i][j] +
      (this.OMEGA / 4.0) *
      (this.lab.voltageMatrix[i + 1][j] +
        this.lab.voltageMatrix[i - 1][j] +
        this.lab.voltageMatrix[i][j + 1] +
        this.lab.voltageMatrix[i][j - 1] +
        this.chargeMatrix[i][j]);
    return p;
  }
  private calculateCharge(i: number, j: number): number {
    const x = this.lab.axis[i]; //getRealXY(i, this.SIZE, this.lab.boundaryLength);
    const y = this.lab.axis[j];// getRealXY(j, this.SIZE, this.lab.boundaryLength);
    // console.log(x,y)
    const result = _chargeEquation(this.chargeEquationStr, x, y, this.H) // this.chargeEquation(x, y, this.H);
    return result;
  }
  private getRandomValues(): number {
    const random = Math.floor(Math.random() * (1000 - 100) + 100) / 10000;
    return random;
  }

  private isAtBoundaries(j: number, i: number) {

    const left = i === 0 || i > this.SIZE - 1;
    if (left) {
      return 'left';
    }
    const right = i === (this.SIZE - 1) || i < 0;
    if (right) {
      return 'right';
    }
    const bottom = j === 0 || j > this.SIZE - 1;
    if (bottom) {
      return 'bottom';
    }
    const top = j === (this.SIZE - 1) || j < 0;
    if (top) {
      return 'top';
    }


    return null;
    // if (
    //   i == 0 ||
    //   j == 0 ||
    //   i == this.SIZE - 1 ||
    //   j == this.SIZE - 1 ||
    //   i < 0 ||
    //   j < 0 ||
    //   i > this.SIZE - 1 ||
    //   j > this.SIZE - 1
    // ) {
    //   return true;
    // }
    // return false;
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }

  getBoundaryChargeBySide(e: 'top' | 'left' | 'right' | 'bottom') {
    // return 0
    return this.boundaryCharge[e]
  }
}
