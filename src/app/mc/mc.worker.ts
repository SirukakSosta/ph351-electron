/// <reference lib="webworker" />

import { singleTempratureCalculation } from "./method";

type input = {
  K: number;
  B: number[];
  J: number;
  GRID_SIZE: number;
  ITERATIONS: number;
  T0: number;
  T_MAX: number;
  T_STEP: number;
  spinChangesPerIteration: number;
};

type output = {
  GRID_SIZE: number;
  magnetizations: number[][];
  tempratures: number[];
  // theoritical: number[];
  // energies: number[];
  // eidikesThermotites: number[];
  // magSusceptibilities: number[]
};

addEventListener("message", ({ data }) => {
  const {
    GRID_SIZE,
    ITERATIONS,
    T0,
    T_MAX,
    T_STEP,
    B,
    J,
    K,
    spinChangesPerIteration,
  } = JSON.parse(data) as input;

  let magnetizations: number[][] = [];
  let tempratures = [];
  let theoritical = [];
  let energies = [];
  let eidikesThermotites = [];
  let magSusceptibilities = [];
  let LATTICE = new Array(GRID_SIZE)
    .fill(1)
    .map(() => new Array(GRID_SIZE).fill(1));

  for (let temprature = T0; temprature < T_MAX; temprature += T_STEP) {
    // console.log(LATTICE);
    // console.log("tempra", temprature.toFixed(1));

    B.forEach((b, i) => {
      const { mag, lattice, energy, eidikiTheromotita, magSusceptibility } = singleTempratureCalculation(LATTICE, temprature, b,
        J, K, ITERATIONS, GRID_SIZE, spinChangesPerIteration);

        if (! magnetizations[i]){
          magnetizations[i] = []
        }
      magnetizations[i].push(mag / GRID_SIZE);

    })

    // const { mag, lattice, energy, eidikiTheromotita, magSusceptibility } = singleTempratureCalculation(LATTICE, temprature, B,
    //   J, K, ITERATIONS, GRID_SIZE, spinChangesPerIteration);
    // /** Αφου γίνουν ολα τα iterations βρίσκουμε. Μεση μαγνητηση, ενεργεια και τετραγωνο ενεργειας */
    // magnetizations.push(mag / GRID_SIZE);

    // energies.push(energy);
    // eidikesThermotites.push(eidikiTheromotita);
    tempratures.push(temprature.toFixed(1));
    // LATTICE = lattice;
    // theoritical.push(magnetizationTheoriticalFormula(temprature, K));
    // magSusceptibilities.push(magSusceptibility)

    // const progress = Math.ceil(((temprature + 1) * 100) / (T_MAX - T0));
    // // console.log('progress', progress, progress % 20 === 0)
    // if (progress % 10 === 0) {
    //   const output: output = {
    //     eidikesThermotites,
    //     energies,
    //     GRID_SIZE,
    //     magnetizations,
    //     tempratures,
    //     theoritical,
    //     magSusceptibilities
    //   };
    //   postMessage(output);
    // }

console.log(temprature)

  }

  const output: output = {
    // eidikesThermotites,
    // energies,
    GRID_SIZE,
    magnetizations,
    tempratures,
    // theoritical,
    // magSusceptibilities
  };
  postMessage(output);
});
