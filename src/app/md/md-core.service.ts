import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { createArrayWithRandomNumbers, roundDecimal } from "../math-common/method";
const _K = 1;
const _G = 1;
const _A = 1;
const _B = 1;
const _MASS = 1;
const TIME_START = 0;
const TIME_END = 20;
const DELTA_TIME = 0.1;
const GRID_SIZE = 10;
const MASS_MATRIX = createArrayWithRandomNumbers(GRID_SIZE, 1, 1, false);
const displacementInitialMatrix = createArrayWithRandomNumbers(
  GRID_SIZE,
  -1,
  1,
  true
); // initial displacement values for each particle
const velocityInitialMatrix = createArrayWithRandomNumbers(
  GRID_SIZE,
  -0.1,
  0.1,
  true
);
@Injectable({
  providedIn: "root",
})
export class MdCoreService {
  private destroyExp$: Subject<number>;

  constructor() {
    console.log("starting");
    // this.start();
  }

  start(): void {
    // console.log("MAsses", MASS_MATRIX);
    // console.log("displacementInitialMatrix", displacementInitialMatrix);
    // console.log("velocityInitialMatrix", velocityInitialMatrix);
    let oldDisplacments = displacementInitialMatrix;
    let oldVelocities = velocityInitialMatrix;
    let oldAccelerations = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const prevI = oldDisplacments[i - 1] || oldDisplacments[GRID_SIZE - 1];
      const currI = oldDisplacments[i];
      const nextI = oldDisplacments[i + 1] || oldDisplacments[0];
      const acc = this.calculateAcceleration(prevI, currI, nextI);
      oldAccelerations.push(acc);
    }
    console.log("x", oldDisplacments);

    console.log("V", oldVelocities);

    console.log("A", oldAccelerations);

    for (let t = TIME_START + DELTA_TIME; t < TIME_END; t += DELTA_TIME) {
      t = roundDecimal(t);
      console.log("time", t);
      let newDisp = [];
      let newVel = [];
      let newAcc = [];
      // calculate current displacment
      for (let i = 0; i < GRID_SIZE; i++) {
        const prevX = oldDisplacments[i];
        const prevV = oldVelocities[i];
        const prevA = oldAccelerations[i];
        const displacement = this.calculateDisplacement(
          prevX,
          prevV,
          prevA,
          DELTA_TIME
        );
        newDisp.push(displacement);
      }
      // calculate current acceleration
      for (let i = 0; i < GRID_SIZE; i++) {
        const prevI = newDisp[i - 1] || newDisp[GRID_SIZE - 1];
        const currI = newDisp[i];
        const nextI = newDisp[i + 1] || newDisp[0];
        const acceleration = this.calculateAcceleration(prevI, currI, nextI);
        newAcc.push(acceleration);
      }
      // calculate current velocity
      for (let i = 0; i < GRID_SIZE; i++) {
        const prevV = oldVelocities[i];
        const prevA = oldAccelerations[i];
        const currA = newAcc[i];
        const velocity = this.calculateVelocity(
          prevV,
          prevA,
          currA,
          DELTA_TIME
        );
        newVel.push(velocity);
      }
      // calculate kinetik
      let energy = 0;
      let potential = 0;
      for (let i = 0; i < GRID_SIZE; i++) {
        const currentV = newVel[i];
        const nextI = newDisp[i + 1] || newDisp[0];
        const currentI = newDisp[i];
        energy += this.calculateKinetikEnergy(currentV);
        potential += this.calculateDynamik(nextI, currentI);
      }
      oldDisplacments = newDisp;
      oldVelocities = newVel;
      oldAccelerations = newAcc;
      // console.log("x", oldDisplacments);
      // console.log("v", oldVelocities);
      // console.log("a", oldAccelerations);
      console.log("kinetik", energy + potential);
      // console.log("potential", potential);
    }
  }
  calculateDisplacement(
    prevX: number,
    prevV: number,
    prevA: number,
    dt: number
  ) {
    const displacement = prevX + prevV * dt + 0.5 * prevA * Math.pow(dt, 2);
    return displacement;
  }
  calculateVelocity(
    prevV: number,
    prevA: number,
    currentA: number,
    dt: number
  ) {
    const velocity = prevV + 0.5 * (prevA + currentA) * dt;
    return velocity;
  }
  calculateAcceleration(prevI: number, currI: number, nextI: number) {
    const factor1 = (_K / _MASS) * (nextI - 2 * currI + prevI);
    const factor2 =
      (_G / _MASS) * (Math.pow(nextI - currI, 3) - Math.pow(currI - prevI, 3));
    const factor3 = (_A / _MASS) * currI;
    const factor4 = (_B / _MASS) * Math.pow(currI, 3);

    const acceleration = factor1 + factor2 - factor3 - factor4;
    return acceleration;
  }
  calculateKinetikEnergy(currentV: number) {
    const factor1 = 0.5 * _MASS * Math.pow(currentV, 2);
    return factor1;
  }
  calculateDynamik(nextI: number, currentI: number) {
    const factor2 = 0.5 * _K * Math.pow(nextI - currentI, 2);
    const factor3 = 0.25 * _G * Math.pow(nextI - currentI, 4);
    const factor4 = 0.5 * _A * Math.pow(currentI, 2);
    const factor5 = 0.25 * _B * Math.pow(currentI, 4);
    return factor2 + factor3 + factor4 + factor5;
  }
}
