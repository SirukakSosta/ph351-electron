import { deepCopy } from "../math-common/method";

export function calculateEnergy(spins: number[][], B: number, J: number) {
  const N = spins.length - 1;
  let energyAtBoundaries = 0;

  for (let i = 1; i < N; i++) {
    const term1 =
      -J *
      (spins[i][0] *
        (spins[i - 1][0] + spins[i][1] + spins[i + 1][0] + spins[i + 1][N]) +
        spins[i][N] *
        (spins[i - 1][N] + spins[i][1] + spins[1][N] + spins[i][N]));

    const term2 =
      spins[1][i] *
      (spins[1][i + 1] + spins[1][i - 1] + spins[2][i] + spins[N][i]) +
      spins[N][i] *
      (spins[N][i + 1] + spins[N][i - 1] + spins[N - 1][i] + spins[1][i]);

    const term3 =
      B * spins[i][1] - B * spins[i][N] - B * spins[1][i] - B * spins[N][i];

    energyAtBoundaries += term1 + term2 + term3;
  }

  let interiorEnergy = 0;
  for (let i = 1; i < N; i++) {
    for (let j = 1; j < N; j++) {
      const term1 =
        -J *
        (spins[i][j] *
          (spins[i + 1][j] +
            spins[i - 1][j] +
            spins[i][j + 1] +
            spins[i][j - 1]));
      const term2 = -B * spins[i][j];
      interiorEnergy += term1 + term2;
    }
  }

  const energy = energyAtBoundaries + interiorEnergy;
  return energy;
}


export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomReal(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function sum2d(tmp: any): number {
  let sum = 0;
  for (let i = 0; i < tmp.length; i++) {
    for (let j = 0; j < tmp.length; j++) {
      sum += tmp[i][j];
    }
  }
  return sum;
}


export function magnetizationTheoriticalFormula(temprature: number, K: number): number {
  let sinHPart = Math.sinh((2 * K) / temprature);
  let mag = Math.pow(sinHPart, -4);
  mag = Math.pow(1 - mag, 1 / 8);
  if (isNaN(mag)) return 0;
  return mag;
}

export function equillibriumForSingleTemprature(J: number, B: number, K: number, GRID_SIZE: number, ITERATIONS: number, T0: number, T_MAX: number, T_STEP: number,
  spinChangesPerIteration: number): {
    magnetizations: number[];
    tempratures: number[];
    theoritical: number[];
    energies: number[];
    eidikesThermotites: number[];
  } {
  let LATTICE = new Array(GRID_SIZE)
    .fill(1)
    .map(() => new Array(GRID_SIZE).fill(1));
  console.log('LATTICE', LATTICE)
  let magnetizations = [];
  let tempratures = [];
  let theoritical = [];
  let energies = [];
  let eidikesThermotites = [];
  // let averageMagentization = 0;
  // let E = 0;
  // let E_sq = 0;

  for (let temprature = T0; temprature < T_MAX; temprature += T_STEP) {
    // console.log(LATTICE);
    console.log("tempra", temprature.toFixed(1));
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
  }
  return {
    magnetizations,
    tempratures,
    theoritical,
    energies,
    eidikesThermotites,
  };
}

export function singleTempratureCalculation(LATTICE: number[][], temprature: number, B: number, J: number, K: number, ITERATIONS: number, GRID_SIZE: number, spinChangesPerIteration: number) {

  let magAvg = 0;
  let energy = 0;
  let energySquared = 0;
  for (let i = 0; i < ITERATIONS; i++) {

    /** Ενεργεια πριν απο αλλαγη σπιν */
    const energyBefore = calculateEnergy(LATTICE, B, J);

    /** Δημιουργουμε ενα προσωρινο πλεγμα */
    let tmpLattice = deepCopy(LATTICE);

    for (let j = 0; j < spinChangesPerIteration; j++) {
      /** Επιλέγουμε 2 τυχαιους ακέραιους για να εναλάξουμε 2 τυχαια σπιν στο συστημα μας */
      const random1 = getRandomInt(1, GRID_SIZE - 1); /** Εδω για κα΄ποιο λογο στη ματλαμπ βαζω απο 2 εως Ν-1 */
      const random2 = getRandomInt(1, GRID_SIZE - 1);
      /** ΕΝΑΛΛΑΓΗ ΣΠΙΝ- για να τσκεάρορυμε αργοτερα αν αξίζει ενεργειακα να γινει αυτη η μετάβαση */
      tmpLattice[random1][random2] = -tmpLattice[random1][random2];
    }

    /** Ενεργεια Μετα απο αλλαγη σπιν */
    const energyAfter = calculateEnergy(tmpLattice, B, J);
    const deltaEnergy = energyAfter - energyBefore;
    /** Αν η διαφορα ενεργειας ειναι μεγαλυτερη του 0 παω για MC */
    const propability = Math.exp(-deltaEnergy / (K * temprature));


    const revertChange =
      /** Υπολογισμος πιθανότητας μετάβασης */
      propability < 1 &&
      /** Βρίσκους τυχαιο ακεραιο μεταξυ 0-1 για να τον συκγρινουμε με τη πιθανοτητα */
      propability < getRandomReal(0, 1);

    /** Εαν η αλλαγη σπιν περναει απο τις πιθανοτητες, το πλεγμα περνει την τιμη του προσωρινου(νεου) πλεγματος*/
    if (!revertChange) {
      LATTICE = tmpLattice;
      // const rProb = getRandomReal(0, 1);
      // if (propability < rProb) {
      // LATTICE[random1][random2] = -LATTICE[random1][random2];
      // }
    }

    /** Απο το ISING MATLAB */
    // if (deltaEnergy > 0) {
    //   /** Υπολογισμος πιθανότητας μετάβασης */
    //   const propability = Math.exp(-deltaEnergy / (K * temprature));
    //   /** Βρίσκους τυχαιο ακεραιο μεταξυ 0-1 για να τον συκγρινουμε με τη πιθανοτητα */
    //   const rProb = this.getRandomReal(0, 1);
    //   if (propability >= rProb) {
    //     /** Αφηνω αλλαγμενο το συστημα αφου εχω αλλαξει ηδη το σπιν*/
    //   } else {
    //     /** Επαναφέρω το συστημα όπως ηταν. (Εχω αλλαξει το σπιν πανω) */
    //     LATTICE[random1][random2] = -LATTICE[random1][random2];
    //   }
    // }
    magAvg += sum2d(LATTICE) / GRID_SIZE;
    energy += calculateEnergy(LATTICE, B, J);
    energySquared += Math.pow(energy, 2);
  }
  /** Αφου γίνουν ολα τα iterations βρίσκουμε. Μεση μαγνητηση, ενεργεια και τετραγωνο ενεργειας */
  return {
    mag: magAvg / ITERATIONS,
    lattice: LATTICE,
    energy: energy / ITERATIONS,
    energySquared: energySquared / ITERATIONS,
    eidikiTheromotita:
      (1 / (K * temprature)) * (energySquared - Math.pow(energy, 2)),
  };
  // magnetization = this.sum2d(LATTICE) / GRID_SIZE;
  // averageMagentization = averageMagentization + magnetization / GRID_SIZE;
  // E = E + calculateEnergy(LATTICE, B, J);
  // E_sq = E_sq + Math.pow(E, 2);
}
