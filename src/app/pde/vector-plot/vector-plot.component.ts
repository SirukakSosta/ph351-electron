import { Component, OnInit, OnDestroy } from "@angular/core";
import { Chart, Options } from "highcharts";
import { tap } from "rxjs/operators";
import { PdeLabService } from "../pde-lab.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-vector-plot",
  templateUrl: "./vector-plot.component.html",
  styleUrls: ["./vector-plot.component.css"]
})
export class VectorPlotComponent implements OnInit, OnDestroy {

  public options: Options = {
    chart: {
      height: 600,
      type: "vector",
      spacingBottom: 30
    },
    title: {
      text: "Electric Field"
    },
    legend: {
      layout: "vertical",
      align: "left",
      verticalAlign: "top",
      x: 150,
      y: 100,
      floating: true,
      borderWidth: 1
    },
    xAxis: {
      min: 0,
      max: 1,
      title: {
        text: "x"
        //align: 'center'
      }
    },
    yAxis: {
      min: 0,
      max: 1,
      title: {
        text: "y"
      }
    },
    plotOptions: {
      area: {
        fillOpacity: 0.5
      }
    },
    credits: {
      enabled: false
    },
    series: []
  };
  sub: Subscription;

  constructor(private lab: PdeLabService) { }

  public chart: Chart;
  ngOnInit() {
  }
  public onLoad(evt) {
    this.chart = evt.chart;
    this.chart.series = [];

    this.sub = this.lab.electricField$
      .pipe(
        tap((electricField) => {
          console.log("electricField", electricField);

          if (this.chart.get("series-a")) {
            this.chart.get("series-a").remove();
          }

          this.chart.addSeries({
            id: "series-a",
            type: "vector",
            name: "Electric vector field",
            turboThreshold: 0,
            rotationOrigin: "start",
            color: "red",
            data: electricField
          });
          // this.chart.redraw()
        })
      )
      .subscribe();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
