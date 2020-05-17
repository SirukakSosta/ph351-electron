import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { calculateEnergy } from "./method";

/** CONSTANTS */
const J = 1;
const B = 1;
const K = 1;
const GRID_SIZE = 40;
const ITERATIONS = 5000;
const T0 = 0;
const T_MAX = 20;
const T_STEP = 0.1;
@Injectable({
  providedIn: "root",
})
export class McCoreService {
  private destroyExp$: Subject<number>;

  constructor() {
    console.log("starting");
    // this.start();
    // console.log("lattice");
  }

  equillibriumForSingleTemprature(): {
    magnetizations: number[];
    tempratures: number[];
    theoritical: number[];
  } {
    let LATTICE = new Array(GRID_SIZE)
      .fill(1)
      .map(() => new Array(GRID_SIZE).fill(1));
    let magnetizations = [];
    let tempratures = [];
    let theoritical = [];
    // let averageMagentization = 0;
    // let E = 0;
    // let E_sq = 0;

    for (let temprature = T0; temprature < T_MAX; temprature += T_STEP) {
      // console.log(LATTICE);
      console.log("tempra", temprature);
      const { mag, lattice } = this.singleTempratureCalculation(
        LATTICE,
        temprature
      );
      /** Αφου γίνουν ολα τα iterations βρίσκουμε. Μεση μαγνητηση, ενεργεια και τετραγωνο ενεργειας */
      magnetizations.push(mag / GRID_SIZE);
      tempratures.push(temprature.toFixed(1));
      LATTICE = lattice;
      theoritical.push(this.magnetizationTheoriticalFormula(temprature));
      // magnetization = this.sum2d(LATTICE) / GRID_SIZE;
      // averageMagentization = averageMagentization + magnetization / GRID_SIZE;
      // E = E + calculateEnergy(LATTICE, B, J);
      // E_sq = E_sq + Math.pow(E, 2);
    }
    return {
      magnetizations,
      tempratures,
      theoritical,
    };
  }

  singleTempratureCalculation(LATTICE: any, temprature: number) {
    let magAvg = 0;
    for (let i = 0; i < ITERATIONS; i++) {
      /** Επιλέγουμε 2 τυχαιους ακέραιους για να εναλάξουμε 2 τυχαια σπιν στο συστημα μας */
      const random1 = this.getRandomInt(
        1,
        GRID_SIZE - 1
      ); /** Εδω για κα΄ποιο λογο στη ματλαμπ βαζω απο 2 εως Ν-1 */
      const random2 = this.getRandomInt(1, GRID_SIZE - 1);
      /** Ενεργεια πριν απο αλλαγη σπιν */
      const energyBefore = calculateEnergy(LATTICE, B, J);
      /** ΕΝΑΛΛΑΓΗ ΣΠΙΝ- για να τσκεάρορυμε αργοτερα αν αξίζει ενεργειακα να γινει αυτη η μετάβαση */
      LATTICE[random1][random2] = -LATTICE[random1][random2];
      /** Ενεργεια Μετα απο αλλαγη σπιν */
      const energyAfter = calculateEnergy(LATTICE, B, J);
      const deltaEnergy = energyAfter - energyBefore;
      /** Αν η διοαφορα ενεργειας ειναι μεγαλυτερη του 0 παω για MC */
      const propability = Math.exp(-deltaEnergy / (K * temprature));

      /** ΣΗΜΕΙΩΣΕΙΣ ΖΩΤΟΥ */
      if (propability < 1) {
        const rProb = this.getRandomReal(0, 1);
        if (propability < rProb) {
          LATTICE[random1][random2] = -LATTICE[random1][random2];
        }
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
      magAvg += this.sum2d(LATTICE) / GRID_SIZE;
    }

    /** Αφου γίνουν ολα τα iterations βρίσκουμε. Μεση μαγνητηση, ενεργεια και τετραγωνο ενεργειας */
    return {
      mag: magAvg / ITERATIONS,
      lattice: LATTICE,
    };
    // magnetization = this.sum2d(LATTICE) / GRID_SIZE;
    // averageMagentization = averageMagentization + magnetization / GRID_SIZE;
    // E = E + calculateEnergy(LATTICE, B, J);
    // E_sq = E_sq + Math.pow(E, 2);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  getRandomReal(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  sum2d(tmp: any): number {
    let sum = 0;
    for (let i = 0; i < tmp.length; i++) {
      for (let j = 0; j < tmp.length; j++) {
        sum += tmp[i][j];
      }
    }
    return sum;
  }
  magnetizationTheoriticalFormula(temprature: number): number {
    let sinHPart = Math.sinh((2 * K) / temprature);
    let mag = Math.pow(sinHPart, -4);
    mag = Math.pow(1 - mag, 1 / 8);
    if (isNaN(mag)) return 0;
    return mag;
  }
}
