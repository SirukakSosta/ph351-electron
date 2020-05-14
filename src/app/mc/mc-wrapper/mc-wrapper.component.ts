import { Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import { randomInteger } from "../../math-common/method";
import { McCoreService } from "../mc-core.service";
import { calculateEnergy } from "../method";
import { B, J } from "../variable";

@Component({
  selector: "app-mc-wrapper",
  templateUrl: "./mc-wrapper.component.html",
  styleUrls: ["./mc-wrapper.component.scss"],
})
export class McWrapperComponent implements OnInit {

  isCollapsed = false;
  constructor(public service: McCoreService, public plotly: PlotlyService) { }

  ngOnInit() {

    const thermodynamicEquilibriumSteps = 2000;
    const latticeLength = 20;

    // initialize lattice
    let lattice = [[]] as number[][];
    for (let i = 0; i < latticeLength; i++) {
      lattice[i] = new Array(latticeLength).fill(1);
    }

    console.log(lattice)

    const _energy = calculateEnergy(lattice, B, J);
    console.log(_energy)

    // iterate for each thermodynamic equilibrium step
    for (let i = 0; i < thermodynamicEquilibriumSteps; i++) {

      // calculate energy before spin reverse
      const initialEnergy = calculateEnergy(lattice, B, J);

      // pick two random numbers
      const randomElement1 = randomInteger(0, latticeLength - 1);
      const randomElement2 = randomInteger(0, latticeLength - 1);

      // reverse spin
      lattice[randomElement1][randomElement2] *= -1;

      // calculate energy after spin reverse
      const finalEnergy = calculateEnergy(lattice, B, J);

      // calculate difference
      const diff = finalEnergy - initialEnergy;
      console.log(`iteration ${i} `, initialEnergy, finalEnergy, diff);

      if (diff > 0) {

      } else {

      }


    }



  }

}
