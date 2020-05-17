import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { calculateEnergy } from "./method";

/** CONSTANTS */
const J = 1;
const B = 1;
const K = 1;
const GRID_SIZE = 40;
const ITERATIONS = 2000;
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
  } {
    let LATTICE = new Array(GRID_SIZE)
      .fill(1)
      .map(() => new Array(GRID_SIZE).fill(1));
    let magnetizations = [];
    let tempratures = [];
    // let averageMagentization = 0;
    // let E = 0;
    // let E_sq = 0;

    for (let temprature = T0; temprature < T_MAX; temprature += T_STEP) {
      console.log("tempra", temprature);
      const { mag, lattice } = this.singleTempratureCalculation(
        LATTICE,
        temprature
      );
      /** Αφου γίνουν ολα τα iterations βρίσκουμε. Μεση μαγνητηση, ενεργεια και τετραγωνο ενεργειας */
      magnetizations.push(mag / GRID_SIZE);
      tempratures.push(temprature);
      LATTICE = lattice;
      // magnetization = this.sum2d(LATTICE) / GRID_SIZE;
      // averageMagentization = averageMagentization + magnetization / GRID_SIZE;
      // E = E + calculateEnergy(LATTICE, B, J);
      // E_sq = E_sq + Math.pow(E, 2);
    }
    return {
      magnetizations,
      tempratures,
    };
  }

  singleTempratureCalculation(LATTICE: any, temprature: number) {
    for (let i = 0; i < ITERATIONS; i++) {
      /** Επιλέγουμε 2 τυχαιους ακέραιους για να εναλάξουμε 2 τυχαια σπιν στο συστημα μας */
      const random1 = this.getRandomInt(0, GRID_SIZE - 1);
      const random2 = this.getRandomInt(0, GRID_SIZE - 1);
      /** Ενεργεια πριν απο αλλαγη σπιν */
      const energyBefore = calculateEnergy(LATTICE, B, J);
      /** ΕΝΑΛΛΑΓΗ ΣΠΙΝ- για να τσκεάρορυμε αργοτερα αν αξίζει ενεργειακα να γινει αυτη η μετάβαση */
      LATTICE[random1][random2] = -LATTICE[random1][random2];
      /** Ενεργεια Μετα απο αλλαγη σπιν */
      const energyAfter = calculateEnergy(LATTICE, B, J);
      const deltaEnergy = energyAfter - energyBefore;
      /** Υπολογισμος πιθανότητας μετάβασης */
      const propability = Math.exp(-deltaEnergy / (K * temprature));
      /** Βρίσκους τυχαιο ακεραιο μεταξυ 0-1 για να τον συκγρινουμε με τη πιθανοτητα */
      const rProb = this.getRandomInt(0, 1);
      if (propability >= rProb) {
        /** Αφηνω αλλαγμενο το συστημα αφου εχω αλλαξει ηδη το σπιν*/
      } else {
        /** Επαναφέρω το συστημα όπως ηταν. (Εχω αλλαξει το σπιν πανω) */
        LATTICE[random1][random2] = -LATTICE[random1][random2];
      }
    }

    /** Αφου γίνουν ολα τα iterations βρίσκουμε. Μεση μαγνητηση, ενεργεια και τετραγωνο ενεργειας */
    return {
      mag: this.sum2d(LATTICE),
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
  sum2d(tmp: any): number {
    let sum = 0;
    for (let i = 0; i < tmp.length; i++) {
      for (let j = 0; j < tmp.length; j++) {
        sum += tmp[i][j];
      }
    }
    return sum;
  }
}
