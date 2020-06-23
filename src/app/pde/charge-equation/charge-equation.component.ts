import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { PdeLabService } from "../pde-lab.service";
import { randomInteger } from "../../math-common/method";

@Component({
  selector: "app-charge-equation",
  templateUrl: "./charge-equation.component.html",
  styleUrls: ["./charge-equation.component.css"]
})
export class ChargeEquationComponent implements OnInit, OnDestroy {

  @Input() title: string;
  voltageSubscription: Subscription;
  axisSubscription: Subscription;

  public graph = {
    data: [
      {
        z: [],
        x: [],
        y: [],
        type: "surface",
        name: `Φxy`,
        contours: {
          z: {
            show: true,
            usecolormap: true,
            highlightcolor: "#42f462",
            project: { z: true }
          }
        }
      }
    ],
    layout: {
      autosize: true,
      // width: 1200,
      height: 900,
      title: this.title,
      scene: {
        xaxis: { title: "X - Distance unit" },
        yaxis: { title: "Y - Distance unit" },
        zaxis: { title: "Charge Equation - P(x,y)" }
      }
    }
  };
  constructor(private lab: PdeLabService) { }

  ngOnInit(): void {
    console.log(this)
    console.log(this.lab.chargeEquationStr)


    this.createChargeEq()

    this.graph.layout.title = this.title;
  }
  ngOnDestroy() {
    // this.voltageSubscription.unsubscribe();
    // this.axisSubscription.unsubscribe();
  }

  createChargeEq() {

this.lab.axis$.subscribe(() =>{



    // const diasthma = this.lab.xEnd - this.lab.xStart;
    // let step = diasthma / (this.lab.axis.length - 1);

    // let chartAxis = [];
    let chartZ = new Array(this.lab.axis.length ).fill(0).map(() => new Array(this.lab.axis.length ).fill(0));

    console.log('chartZ', chartZ)

    const xAxis = this.lab.axis;
    const yAxis = this.lab.axis;

    xAxis.forEach((x, indexX) => {

      yAxis.forEach((y, indexY) => {

        // console.log(indexX, indexY )

        const chargeEquation = eval(this.lab.chargeEquationStr);
        chartZ[indexX][indexY] = chargeEquation

      })


    })
 

    // console.log(chartZ)


    this.graph.data[0].x = xAxis
    this.graph.data[0].y = yAxis
    this.graph.data[0].z = chartZ
  })
    // console.log(this.graph)
    // const x = i;
    // const y = j;

    // const potential = eval(potentialFunction)

    // return potential;
    // x = transform i to real x
  }
}
