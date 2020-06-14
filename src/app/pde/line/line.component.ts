import { stripSummaryForJitFileSuffix } from "@angular/compiler/src/aot/util";
import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { debounceTime, map, mergeMap, tap } from "rxjs/operators";
import { PdeLabService } from "../pde-lab.service";

@Component({
  selector: "app-line",
  templateUrl: "./line.component.html",
  styleUrls: ["./line.component.scss"]
})
export class LineComponent implements OnInit {
  radioValue = "x";
  selectedAxis: any = "x";
  @Input() title: any;
  public graph = {
    layout: {
      autosize: stripSummaryForJitFileSuffix
    },
    data: {}
  };

  data$: Observable<any>;
  constantAxis$$ = new BehaviorSubject<"x" | "y">("x");
  selectedH$$ = new BehaviorSubject<number>(undefined);
  hMaxValue = this.lab.voltageMatrix$.pipe(map(e => e.length));

  constructor(private lab: PdeLabService) { }

  ngOnInit(): void {
    console.log("AXIS", this.lab.axis);

    this.data$ = combineLatest(
      this.lab.axis$,
      this.lab.voltageMatrix$,
      this.constantAxis$$,
      this.selectedH$$
    ).pipe(
      mergeMap(e => [
        { axis: e[0], voltageMatrix: e[1], constantAxis: e[2], selectedH: e[3] }
      ]),
      // filter((e) => !!e.voltageMatrix.length && !!e.voltageMatrix[0].length),
      debounceTime(10),
      tap(({ axis, selectedH }) => {
        if (!selectedH) {
          this.selectH(axis.length / 2);
        }
      }),
      tap(({ axis, constantAxis, selectedH }) => {
        this.graph.layout["yaxis"] = {
          title: `Φ(${selectedH / axis.length}, ${constantAxis})`
        };
        this.graph.layout["xaxis"] = {
          title: `${this.selectedAxis === "x" ? "x" : "y"}`
        };
        this.graph.layout["title"] = {
          text: `Φ(${selectedH /
            axis.length}, ${constantAxis}) - constant axis ${constantAxis}`
        };
        // title: `V(x,y) - constant ${this.selectConstantAxis}`,
      }),
      map(({ axis, voltageMatrix, constantAxis, selectedH }) => {
        console.log(axis, voltageMatrix, constantAxis);
        // this.cX = Math.round(axis.length / 2);
        let y = [];

        // should switch axis?

        for (let i = 0; i < axis.length; i++) {
          // console.log(i)
          if (voltageMatrix[selectedH]) {
            y.push(voltageMatrix[selectedH][i]);
          }
        }

        var trace1 = {
          x: axis,
          y,
          mode: "lines+markers",
          name: `${constantAxis} = ${selectedH}`
        };

        return [trace1];
      })
    );

  }

  selectH(h: number) {
    this.selectedH$$.next(h);
  }
  selectConstantAxis(e: "x" | "y") {
    console.log(e);
    this.selectedAxis = e;
    this.constantAxis$$.next(e);
  }
}
