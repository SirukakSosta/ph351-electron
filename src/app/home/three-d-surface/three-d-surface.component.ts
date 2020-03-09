import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-three-d-surface",
  templateUrl: "./three-d-surface.component.html",
  styleUrls: ["./three-d-surface.component.css"]
})
export class ThreeDSurfaceComponent implements OnInit {
  @Input() potentialMatrix: any;
  @Input() axis: any;
  @Input() title: any;

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
      width: 1200,
      height: 800,
      title: this.title,
      scene: {
        xaxis: { title: "X - Distance unit" },
        yaxis: { title: "Y - Distance unit" },
        zaxis: { title: "Potential - Φ(x,y)" }
      }
    }
  };
  constructor() {}

  ngOnInit(): void {
    this.graph.data[0].z = this.potentialMatrix.map(arr =>
      arr.map(val => val.toString())
    );
    this.graph.data[0].x = this.axis.map(val => val.toString());
    this.graph.data[0].y = this.axis.map(val => val.toString());
    this.graph.layout.title = this.title;
  }
}
