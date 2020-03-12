import { Component, Input, OnInit } from "@angular/core";
import { Chart, Options } from "highcharts";

@Component({
  selector: "app-vector-plot",
  templateUrl: "./vector-plot.component.html",
  styleUrls: ["./vector-plot.component.css"]
})
export class VectorPlotComponent implements OnInit {
  @Input() vectorData: any;
  public options: Options = {
    chart: {
      height: 600,
      type: "vector",
      spacingBottom: 30
    },
    title: {
      text: "Electric Field"
    },
    // subtitle: {
    //   text: "* Jane's banana consumption is unknown",
    //   floating: true,
    //   align: "right",
    //   verticalAlign: "bottom",
    //   y: 15
    // },
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
        //align: 'center'
      }
    },
    // tooltip: {
    //   formatter: function() {
    //     return "<b>" + this.series.name + "</b><br/>" + this.x + ": " + this.y;
    //   }
    // },
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

  public chart: Chart;
  ngOnInit() {
    console.log("data to plot");
  }
  public onLoad(evt) {
    this.chart = evt.chart;
    this.chart.addSeries({
      type: "vector",
      name: "Electric vector field",
      turboThreshold: 0,
      color: "red",
      data: this.vectorData
    });
    // function generateData() {
    //   var data = [],
    //     x,
    //     y,
    //     length,
    //     direction;

    //   for (x = 5; x < 100; x += 5) {
    //     for (y = 5; y < 100; y += 5) {
    //       length = Math.round(200 - (x + y));
    //       direction = Math.round(((x + y) / 200) * 360);
    //       data.push([x, y, length, direction].join(", "));
    //     }
    //   }
    //   console.log("[\n    [" + data.join("],\n    [") + "]\n]");
    // }
    // generateData();
    console.log("data to plot", this.chart);
  }
}
