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
    layout: { width: 1200, height: 800, title: "hi" }
  };
  constructor() {}

  ngOnInit(): void {
    console.log("AXIS", this.axis);
    this.cX = this.axis.length / 2;
    let y = [];
    for (let i = 0; i < this.axis.length; i++) {
      y.push(this.potentialMatrix[this.cX][i]);
    }
    var trace1 = {
      x: this.axis,
      y,
      mode: "lines+markers",
      name: `x = ${this.cX}`
    };

    var data = [trace1];
    this.graph["data"] = data;
  }
}
