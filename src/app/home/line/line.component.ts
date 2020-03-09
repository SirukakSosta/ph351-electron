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
    this.cX = Math.floor(this.axis.length / 2);
    const y = [];

    for (let i = 0; i < this.axis.length; i++) {
      y.push(this.potentialMatrix[this.cX][i].toString());
    }

    const trace1 = {
      x: this.axis.map(val => val.toString()),
      y,
      mode: "lines+markers",
      name: `x = ${this.cX}`
    };

    const data = [trace1];
    this.graph["data"] = data;
    this.graph.layout["yaxis"] = {
      title: `Potential - Φ(${this.cX / this.axis.length}, y)`
    };
  }
}
