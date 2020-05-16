import { AfterViewInit, Component, OnInit } from "@angular/core";
import { PlotlyService } from "angular-plotly.js";
import { randomDecimal, randomInteger } from "../../math-common/method";
import { McCoreService } from "../mc-core.service";
import { calculateEnergy } from "../method";
import { B, J, K } from "../variable";

@Component({
  selector: "app-mc-wrapper",
  templateUrl: "./mc-wrapper.component.html",
  styleUrls: ["./mc-wrapper.component.scss"],
})
export class McWrapperComponent implements OnInit, AfterViewInit {

  isCollapsed = false;
  heatMapData = [
    {
      z: [],
      type: 'heatmap'
    }
  ];
  constructor(public service: McCoreService, public plotly: PlotlyService) { }

  ngOnInit() {



  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calculate();
    })

  }

  calculate() {

    const thermodynamicEquilibriumSteps = 100000;
    const latticeLength = 40;

    // initialize lattice
    let lattice = [[]] as number[][];
    for (let i = 0; i < latticeLength; i++) {
      lattice[i] = new Array(latticeLength).fill(1);
    }

    console.log(lattice)

    const _energy = calculateEnergy(lattice, B, J);
    console.log(_energy)

    let temperature = 1;


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
      const energyDiff = finalEnergy - initialEnergy;
      // console.log(`iteration ${i} `, initialEnergy, finalEnergy, energyDiff);

      if (energyDiff > 0) {

        const propability = Math.exp((-1) * energyDiff / (K * temperature));
        // console.log('propability', propability)

        const random = randomDecimal(0, 1)
        // console.log('random', random);

        const keepChange = propability > random;
        if (!keepChange) {
          lattice[randomElement1][randomElement2] *= -1;
        }

      } else {

      }

      setTimeout(() => this.heatMapData = [
        {
          z: lattice,
          type: 'heatmap'
        }
      ])
      // console.table(lattice)

    }

  }
}
