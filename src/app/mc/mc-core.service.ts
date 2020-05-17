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
let LATTICE = [[]] as number[][];
for (let i = 0; i < GRID_SIZE; i++) {
  LATTICE[i] = new Array(GRID_SIZE).fill(1);
}
@Injectable({
  providedIn: "root",
})
export class McCoreService {
  private destroyExp$: Subject<number>;

  constructor() {
    console.log("starting");
    // this.start();
    console.log("lattice");
    console.log(LATTICE);
  }

  equillibriumForSingleTemprature() {
    let temprature = 2;
    let averageMagentization = 0;
    let averageEnergy = 0;
    let averageEnergySquared = 0;
    for (let i = 0; i < ITERATIONS; i++) {
      /** Επιλέγουμε 2 τυχαιους ακέραιους για να εναλάξουμε 2 τυχαια σπιν στο συστημα μας */
      const random1 = this.getRandomInt(0, GRID_SIZE);
      const random2 = this.getRandomInt(0, GRID_SIZE);
      /** Ενεργεια πριν απο αλλαγη σπιν */
      const energyBefore = calculateEnergy(LATTICE, B, J);
      /** ΕΝΑΛΛΑΓΗ ΣΠΙΝ- για να τσκεάρορυμε αργοτερα αν αξίζει ενεργειακα να γινει αυτη η μετάβαση */
      GRID_SIZE[random1][random2] = -GRID_SIZE[random1][random2];
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
        GRID_SIZE[random1][random2] = -GRID_SIZE[random1][random2];
      }
    }
    /** Αφου γίνουν ολα τα iterations βρίσκουμε. Μεση μαγνητηση, ενεργεια και τετραγωνο ενεργειας */
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
