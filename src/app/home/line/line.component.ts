import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-line",
  templateUrl: "./line.component.html",
  styleUrls: ["./line.component.css"]
})
export class LineComponent implements OnInit {
  @Input() potentialMatrix: any;
  @Input() axis: any;
  @Input() title: any;
  @Input() type: any;
  cX = 0;
  public graph = {
    layout: {
      width: 1200,
      height: 800,
      title: "hi",
      xaxis: {
        title: "Y - Distance units"
      }
    }
  };
  constructor() {}

  ngOnInit(): void {
    console.log("AXIS", this.axis);
    this.cX = this.axis.length / 2;
    let y = [];
    if (this.type === "ENERGY") {
      for (let i = 0; i < this.axis.length; i++) {
        y.push(
          Math.round((this.potentialMatrix[i] + Number.EPSILON) * 100) / 100
        );
      }
      console.log("DEr", y);
    } else {
      for (let i = 0; i < this.axis.length; i++) {
        y.push(this.potentialMatrix[this.cX][i]);
      }
    }
    var trace1 = {
      x: this.axis,
      y,
      mode: "lines+markers",
      name: `x = ${this.cX}`
    };

    var data = [trace1];
    this.graph["data"] = data;
    this.graph.layout["yaxis"] = {
      title: `Potential - Φ(${this.cX / this.axis.length}, y)`
    };
  }
}
