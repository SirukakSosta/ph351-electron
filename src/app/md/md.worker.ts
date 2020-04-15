/// <reference lib="webworker" />

import { calculateAcceleration, calculateKineticEnergy, calculatePotentialEnergy, displacementNextDt, velocityNextDt } from "./methods";

type input = {

  constant: { k: number; g: number; a: number; b: number; }
  dt: number;
  dtStart: number;
  dtEnd: number;
  mass: number[];
  initialDisplacement: number[];
  initialVelocity: number[];
  initialAcceleration: number[];
  initialKineticEnergy: number[];
  initialPotentialEnergy: number[];

}

type output = {
  displacement: number[][];
  velocity: number[][];
  acceleration: number[][];
  kineticEnergy: number[][];
  potentialEnergy: number[][];
  progress: number;
}

addEventListener('message', ({ data }) => {

  const input = JSON.parse(data) as input;

  console.log('worker input', input)

  const particleCount = input.initialDisplacement.length;
  const particleArray = new Array(particleCount).fill(0);

  let displacement = [input.initialDisplacement];
  let velocity = [input.initialVelocity];
  let acceleration = [input.initialAcceleration];
  let kineticEnergy = [input.initialKineticEnergy];
  let potentialEnergy = [input.initialPotentialEnergy];

  let dtIndex = 0;
  for (let t = input.dtStart; t < input.dtEnd; t += input.dt) {

    // next displacement calculation
    const _displacementNextDt = particleArray.map((e, particle) => {
      const displacementNextDtForParticle_i = displacementNextDt(
        displacement[dtIndex][particle],
        velocity[dtIndex][particle],
        acceleration[dtIndex][particle],
        input.dt
      );
      return displacementNextDtForParticle_i;
    });

    displacement.push(_displacementNextDt);

    // next acceleration calculation
    const _accelerationNextDt = particleArray.map((e, particle) => {
      // const displacementTimelineNextDt = displacement[dtIndex + 1];
      const particleDisplacement = {
        previousParticle: _displacementNextDt[particle - 1] || _displacementNextDt[particleCount - 1],
        currentParticle: _displacementNextDt[particle],
        nextParticle: _displacementNextDt[particle + 1] || _displacementNextDt[0],
      };
      const accelerationNextDtForParticle_i = calculateAcceleration(particleDisplacement, input.mass[particle], input.constant);
      return accelerationNextDtForParticle_i;
    });

    acceleration.push(_accelerationNextDt);

    // next velocity calculation
    const _velocityNextDt = particleArray.map((e, particle) => {
      const velocityNextDtForParticle_i = velocityNextDt(
        velocity[dtIndex][particle],
        acceleration[dtIndex][particle],
        _accelerationNextDt[particle],
        input.dt
      );
      return velocityNextDtForParticle_i;
    });

    velocity.push(_velocityNextDt)

    //  next kinetic energy calculation.
    const dtStartKineticEnergy = particleArray.map((e, i) => calculateKineticEnergy(input.mass[i], _velocityNextDt[i]));
    kineticEnergy.push(dtStartKineticEnergy)

    //  next potential energy calculation.
    const _potentialEnergyNextDt = particleArray.map((e, i) => {
      const potentialEnergyNextDtForParticle_i = calculatePotentialEnergy({
        currentParticle: _displacementNextDt[i], nextParticle: _displacementNextDt[i + 1] || _displacementNextDt[0],
      },
        input.constant
      );
      return potentialEnergyNextDtForParticle_i;
    });

    potentialEnergy.push(_potentialEnergyNextDt)


    const progress = ((dtIndex + 1) * 100 / ((input.dtEnd - input.dtStart) / input.dt))
    if (progress % 10 === 0 && progress < 100) {

      const output: output = {
        displacement,
        velocity,
        acceleration,
        kineticEnergy,
        potentialEnergy,
        progress
      }

      postMessage(output)
    }

    dtIndex++;

  }

  const output: output = {
    displacement,
    velocity,
    acceleration,
    kineticEnergy,
    potentialEnergy,
    progress: 100
  }

  postMessage(output);
}) 