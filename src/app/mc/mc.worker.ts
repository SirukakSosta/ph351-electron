/// <reference lib="webworker" />

import { magnetizationTheoriticalFormula, singleTempratureCalculation } from "./method";

type input = {
   K: number;
   B: number;
   J: number;
   GRID_SIZE: number;
   ITERATIONS: number;
   T0: number;
   T_MAX: number;
   T_STEP: number;
   spinChangesPerIteration: number;
}

type output = {
   GRID_SIZE: number;
   magnetizations: number[];
   tempratures: number[];
   theoritical: number[];
   energies: number[];
   eidikesThermotites: number[];
}

addEventListener('message', ({ data }) => {

   const { GRID_SIZE, ITERATIONS, T0, T_MAX, T_STEP, B, J, K, spinChangesPerIteration } = JSON.parse(data) as input;

   let magAvg = 0;
   let energy = 0;
   let energySquared = 0;
   let magnetizations = [];
   let tempratures = [];
   let theoritical = [];
   let energies = [];
   let eidikesThermotites = [];
   let LATTICE = new Array(GRID_SIZE)
      .fill(1)
      .map(() => new Array(GRID_SIZE).fill(-1));

   for (let temprature = T0; temprature < T_MAX; temprature += T_STEP) {
      // console.log(LATTICE);
      // console.log("tempra", temprature.toFixed(1));
      const {
         mag,
         lattice,
         energy,
         eidikiTheromotita,
      } = singleTempratureCalculation(LATTICE, temprature, B, J, K, ITERATIONS, GRID_SIZE, spinChangesPerIteration);
      /** Αφου γίνουν ολα τα iterations βρίσκουμε. Μεση μαγνητηση, ενεργεια και τετραγωνο ενεργειας */
      magnetizations.push(mag / GRID_SIZE);
      energies.push(energy);
      eidikesThermotites.push(eidikiTheromotita);
      tempratures.push(temprature.toFixed(1));
      LATTICE = lattice;
      theoritical.push(magnetizationTheoriticalFormula(temprature, K));
      // magnetization = this.sum2d(LATTICE) / GRID_SIZE;
      // averageMagentization = averageMagentization + magnetization / GRID_SIZE;
      // E = E + calculateEnergy(LATTICE, B, J);
      // E_sq = E_sq + Math.pow(E, 2);


      const progress = Math.ceil((temprature + 1) * 100 / (T_MAX - T0));
      // console.log('progress', progress, progress % 20 === 0)
      if (progress % 10 === 0) {
         const output: output = { eidikesThermotites, energies, GRID_SIZE, magnetizations, tempratures, theoritical };
         postMessage(output);
      }

   }

   const output: output = { eidikesThermotites, energies, GRID_SIZE, magnetizations, tempratures, theoritical };
   postMessage(output);
}) 