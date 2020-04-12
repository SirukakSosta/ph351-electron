import { Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import {
  createArrayWithRandomNumbers,
  roundDecimal,
} from "../../math-common/method";
import { ExperimentConstant } from "../interface";
import { MdCoreService } from "../md-core.service";
import {
  acceleration,
  displacementNextDt,
  kineticEnergy,
  potentialEnergy,
  velocityNextDt,
} from "../methods";

@Component({
  selector: "app-md-wrapper",
  templateUrl: "./md-wrapper.component.html",
  styleUrls: ["./md-wrapper.component.scss"],
})
export class MdWrapperComponent implements OnInit {
  isCollapsed = false;

  constructor(public service: MdCoreService, public plotly: PlotlyService) {}

  ngOnInit(): void {
    return;
    const constants: ExperimentConstant = { k: 1, g: 4, a: 4, b: 4 };
    const dxStart = 0;
    const dxEnd = 1;

    const particleCount = 40;
    const dt = 1;
    const dtStart = 0;
    const dtEnd = 20;

    const particleArray = new Array(particleCount).fill(0); // mock array used for particle mappings
    const massMatrix = createArrayWithRandomNumbers(particleCount, 1, 1, false); // mass for each particle
    const displacementInitialMatrix = createArrayWithRandomNumbers(
      particleCount,
      dxStart,
      dxEnd,
      true
    ); // initial displacement values for each particle
    const velocityInitialMatrix = createArrayWithRandomNumbers(
      particleCount,
      -0.1,
      0.1,
      true
    ); // initial velocity values for each particle
    // console.table('displacementInitialMatrix', displacementInitialMatrix)
    // console.table('velocityInitialMatrix', velocityInitialMatrix)

    // Map that pairs dt with particles' displacement.
    const displacementTimeline: Map<number, number[]> = new Map();
    displacementTimeline.set(dtStart, displacementInitialMatrix);

    // Map that pairs dt with particles' velocity.
    const velocityTimeline: Map<number, number[]> = new Map();
    velocityTimeline.set(dtStart, velocityInitialMatrix);

    // Map that pairs dt with particles' acceleration.
    const accelerationTimeline: Map<number, number[]> = new Map();
    const dtStartAcceleration = particleArray.map((e, i) => {
      const particleDisplacement = {
        previousParticle:
          displacementInitialMatrix[i - 1] ||
          displacementInitialMatrix[particleCount - 1],
        currentParticle: displacementInitialMatrix[i],
        nextParticle:
          displacementInitialMatrix[i + 1] || displacementInitialMatrix[0],
      };
      return acceleration(particleDisplacement, massMatrix[i], constants);
    });

    accelerationTimeline.set(dtStart, dtStartAcceleration);

    //  Map that pairs dt with particles' kinetic energy.
    const kineticEnergyTimeline: Map<number, number[]> = new Map();
    const dtStartKineticEnergy = particleArray.map((e, i) =>
      kineticEnergy(massMatrix[i], velocityInitialMatrix[i])
    );
    kineticEnergyTimeline.set(dtStart, dtStartKineticEnergy);

    //  Map that pairs dt with particles' potential energy.
    const potentialEnergyTimeline: Map<number, number[]> = new Map();
    const dtStartpotentialEnergy = particleArray.map((e, i) =>
      potentialEnergy(
        {
          currentParticle: displacementInitialMatrix[i],
          nextParticle:
            displacementInitialMatrix[i + 1] || displacementInitialMatrix[0],
        },
        constants
      )
    );
    potentialEnergyTimeline.set(dtStart, dtStartpotentialEnergy);

    // start of timelines' calculation
    for (let t = dtStart; t < dtEnd; t += dt) {
      // javascript decimal addition adds points... normalizing
      t = roundDecimal(t);
      const dtNext = roundDecimal(t + dt);
      ///
      console.log("%c times! ", "background: #222; color: #bada55", t, dtNext);
      // calculate t + dt displacement for all particles
      const _displacementNextDt = particleArray.map((e, i) => {
        const displacementNextDtForParticle_i = displacementNextDt(
          displacementTimeline.get(t)[i],
          velocityTimeline.get(t)[i],
          accelerationTimeline.get(t)[i],
          dt
        );
        return displacementNextDtForParticle_i;
      });

      displacementTimeline.set(dtNext, _displacementNextDt);
      // calculate t + dt acceleration for all particles
      const _accelerationNextDt = particleArray.map((e, i) => {
        const displacementTimelineCurrentDt = displacementTimeline.get(t);
        const particleDisplacement = {
          previousParticle:
            displacementTimelineCurrentDt[i - 1] ||
            displacementTimelineCurrentDt[particleCount - 1],
          currentParticle: displacementTimelineCurrentDt[i],
          nextParticle:
            displacementTimelineCurrentDt[i + 1] ||
            displacementTimelineCurrentDt[0],
        };
        const accelerationNextDtForParticle_i = acceleration(
          particleDisplacement,
          massMatrix[i],
          constants
        );
        return accelerationNextDtForParticle_i;
      });

      accelerationTimeline.set(dtNext, _accelerationNextDt);

      // calculate t + dt velocity for all particles
      const _velocityNextDt = particleArray.map((e, i) => {
        const velocityNextDtForParticle_i = velocityNextDt(
          velocityTimeline.get(t)[i],
          accelerationTimeline.get(t)[i],
          accelerationTimeline.get(dtNext)[i],
          dt
        );
        return velocityNextDtForParticle_i;
      });

      velocityTimeline.set(dtNext, _velocityNextDt);

      // calculate t + dt kinetic energy for all particles
      const _kineticEnergyNextDt = particleArray.map((e, i) => {
        const kineticEnergyNextDtForParticle_i = kineticEnergy(
          massMatrix[i],
          velocityTimeline.get(dtNext)[i]
        );
        return kineticEnergyNextDtForParticle_i;
      });

      kineticEnergyTimeline.set(dtNext, _kineticEnergyNextDt);

      // console.log('displacementTimelineNextDt', displacementTimeline.get(dtNext))
      // calculate t + dt potential energy for all particles
      const _potentialEnergyNextDt = particleArray.map((e, i) => {
        const potentialEnergyNextDtForParticle_i = potentialEnergy(
          {
            currentParticle: displacementTimeline.get(dtNext)[i],
            nextParticle:
              displacementTimeline.get(dtNext)[i + 1] ||
              displacementTimeline.get(dtNext)[0],
          },
          constants
        );
        return potentialEnergyNextDtForParticle_i;
      });

      potentialEnergyTimeline.set(dtNext, _potentialEnergyNextDt);
      console.log(_displacementNextDt);

      console.log(_accelerationNextDt);
      console.log(_velocityNextDt);
    }

    for (let t = dtStart; t < dtEnd; t += dt) {
      t = roundDecimal(t);
      const totalKineticEnergyForDt = kineticEnergyTimeline
        .get(t)
        .reduce((a, b) => a + b);
      const totalPotentialEnergyForDt = potentialEnergyTimeline
        .get(t)
        .reduce((a, b) => a + b);
      // console.log(t, 'kinetic', totalKineticEnergyForDt, 'potential ', totalPotentialEnergyForDt, 'total energy', totalKineticEnergyForDt + totalPotentialEnergyForDt)
      console.log(
        "total energy",
        totalKineticEnergyForDt + totalPotentialEnergyForDt
      );
    }

    console.log(
      "displacementTimeline",
      Array.from(displacementTimeline.values())
    );
    console.log("velocityTimeline", Array.from(velocityTimeline.values()));
    console.log(
      "accelerationTimeline",
      Array.from(accelerationTimeline.values())
    );
    console.log(
      "kineticEnergyTimeline",
      Array.from(kineticEnergyTimeline.values())
    );
    console.log(
      "potentialEnergyTimeline",
      Array.from(potentialEnergyTimeline.values())
    );

    console.log(kineticEnergyTimeline);
  }
}
