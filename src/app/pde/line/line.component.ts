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
  // @Input() potentialMatrix: any;
  // @Input() axis: any;
  @Input() title: any;
  // @Input() type: any;
  // cX = 0;
  public graph = {
    layout: {
      // width: 1200,
      // height: 800,
      autosize :stripSummaryForJitFileSuffix,
      title: "hi",
      xaxis: {
        title: "Y - Distance units"
      }
    },
    data: {}
  };

  data$: Observable<any>
  constantAxis$$ = new BehaviorSubject<'x' | 'y'>('x') ;
  selectedH$$ = new BehaviorSubject<number>(undefined);
  hMaxValue = this.lab.voltageMatrix$.pipe(map(e => e.length));

  constructor(private lab: PdeLabService) { }

  ngOnInit(): void {
    console.log("AXIS", this.lab.axis);

    this.data$ = combineLatest(this.lab.axis$, this.lab.voltageMatrix$, this.constantAxis$$, this.selectedH$$).pipe(
      mergeMap(e => [{ axis: e[0], voltageMatrix: e[1], constantAxis: e[2], selectedH: e[3] }]),
      // filter((e) => !!e.voltageMatrix.length && !!e.voltageMatrix[0].length),
      debounceTime(10),
      tap(({  axis, selectedH }) => {

        if (!selectedH) {
          this.selectH (axis.length / 2);
        }
       
      }),
      tap(({ axis, constantAxis, selectedH }) => {

     
        this.graph.layout["yaxis"] = {
          title: `${this.title} - Φ(${selectedH / axis.length}, ${constantAxis})`
        };
      }),
      map(({ axis, voltageMatrix, constantAxis, selectedH }) => {

        console.log(axis, voltageMatrix, constantAxis)
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
    )

    // this.cX = this.lab.axis.length / 2;
    // let y = [];
    // if (this.type === "ENERGY") {
    //   for (let i = 0; i < this.lab.axis.length; i++) {
    //     y.push(
    //       Math.round((this.lab.voltageMatrix[this.cX] [i] + Number.EPSILON) * 100) / 100
    //     );
    //   }
    //   console.log("DEr", y);
    // } else {
    // for (let i = 0; i < this.lab.axis.length; i++) {
    //   y.push(this.lab.voltageMatrix[this.cX][i]);
    // }
    // // }
    // var trace1 = {
    //   x: this.lab.axis,
    //   y,
    //   mode: "lines+markers",
    //   name: `x = ${this.cX}`
    // };

    // this.lab.voltageMatrix$.pipe(
    //   tap(e => trace1.y = e)
    // ).subscribe()

    // var data = [trace1];
    // this.graph["data"] = data;
    // this.graph.layout["yaxis"] = {
    //   title: `${this.title} - Φ(${this.cX / this.lab.axis.length}, y)`
    // };
  }


  selectH(h: number) {
    this.selectedH$$.next(h)
  }
  selectConstantAxis(e: 'x' | 'y') {
    console.log(e)
    this.constantAxis$$.next(e)
  }
}
