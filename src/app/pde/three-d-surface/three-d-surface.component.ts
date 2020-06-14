import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { PdeLabService } from "../pde-lab.service";

@Component({
  selector: "app-three-d-surface",
  templateUrl: "./three-d-surface.component.html",
  styleUrls: ["./three-d-surface.component.css"]
})
export class ThreeDSurfaceComponent implements OnInit, OnDestroy {

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
      width: 1200,
      height: 600,
      title: this.title,
      scene: {
        xaxis: { title: "X - Distance unit" },
        yaxis: { title: "Y - Distance unit" },
        zaxis: { title: "Potential - Φ(x,y)" }
      }
    }
  };
  constructor(private lab: PdeLabService) { }

  ngOnInit(): void {

    this.voltageSubscription = this.lab.voltageMatrix$.pipe(
      tap(e => this.graph.data[0].z = e)
    ).subscribe()

    this.axisSubscription = this.lab.axis$.pipe(
      tap(axis => {
        this.graph.data[0].x = axis;
        this.graph.data[0].y = axis;
      })
    ).subscribe()

    this.graph.layout.title = this.title;
  }
  ngOnDestroy() {
    this.voltageSubscription.unsubscribe();
    this.axisSubscription.unsubscribe();
  }
}
