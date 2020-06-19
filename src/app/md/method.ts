import * as noiseGenerator from 'png5';
import { createArrayWithRandomNumbers } from "../math-common/method";
import { ExperimentConstant } from "./interface";

export function calculateAcceleration(
  displacement: {
    previousParticle: number;
    currentParticle: number;
    nextParticle: number;
  },
  mass: number,
  constant: ExperimentConstant
) {
  const displacementPrevious = displacement.previousParticle;
  const displacementCurrent = displacement.currentParticle;
  const displacementNext = displacement.nextParticle;

  const term1 =
    (constant.k / mass) *
    (displacementNext - 2 * displacementCurrent + displacementPrevious);
  const term2 =
    (constant.g / mass) *
    (Math.pow(displacementNext - displacementCurrent, 3) -
      Math.pow(displacementCurrent - displacementPrevious, 3));
  const term3 = (constant.a / mass) * displacementCurrent;
  const term4 = (constant.b / mass) * Math.pow(displacementCurrent, 3);

  const result = term1 + term2 - term3 - term4;
  return result;
}

export function velocityNextDt(
  velocityCurrentDt: number,
  accelerationCurrentDt: number,
  accelerationNextDt: number,
  dt: number
) {
  const term1 = velocityCurrentDt;
  const term2 = (accelerationCurrentDt + accelerationNextDt) * dt * 0.5;
  return term1 + term2;
}

export function displacementNextDt(
  displacementCurrentDt: number,
  velocityCurrentDt: number,
  accelerationCurrentDt: number,
  dt: number
) {
  const term1 = displacementCurrentDt;
  const term2 = velocityCurrentDt * dt;
  const term3 = 0.5 * accelerationCurrentDt * Math.pow(dt, 2);

  return term1 + term2 + term3;
}

export function calculateKineticEnergy(mass: number, velocity: number) {
  const term1 = 0.5 * mass * Math.pow(velocity, 2);
  return term1;
}

export function calculatePotentialEnergy(displacement: { currentParticle: number; nextParticle: number }, constant: ExperimentConstant) {
  const displacementCurrent = displacement.currentParticle;
  const displacementNext = displacement.nextParticle;

  const term1 = 0.5 * constant.k * Math.pow(displacementNext - displacementCurrent, 2);
  const term2 = 0.25 * constant.g * Math.pow(displacementNext - displacementCurrent, 4);
  const term3 = 0.5 * constant.a * Math.pow(displacementCurrent, 2);
  const term4 = 0.25 * constant.b * Math.pow(displacementCurrent, 4);

  const result = term1 + term2 + term3 + term4;
  return result;
}


export function createInitialDisplacement(particleCount: number, perlin: boolean) {
  let initialDisplacement: number[] = [];
  if (perlin) {
    const myNoiseMachine = new noiseGenerator({
      lod: 2,
      falloff: 0.5,
      seed: 'seed'
    })
    initialDisplacement = new Array(particleCount).fill(0).map((e, i) => i).map((e, i) => myNoiseMachine.getPerlinNoise(e))
  } else {
    initialDisplacement = createArrayWithRandomNumbers(particleCount, 0, 1, true);
  }
  return initialDisplacement;
}

export function getVelocityBoundsByIndex(index: number, initialVelocityStart: number, initialVelocityEnd: number, step: number) {
  const velocityStart = initialVelocityStart - step * index;
  const velocityEnd = initialVelocityEnd + step * index;
  return { velocityStart, velocityEnd };
}