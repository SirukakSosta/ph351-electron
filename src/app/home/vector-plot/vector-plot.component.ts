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
      title: {
        text: "y"
        //align: 'center'
      }
    },
    yAxis: {
      title: {
        text: "x"
        //align: 'center'
      }
    },
    tooltip: {
      formatter: function() {
        return "<b>" + this.series.name + "</b><br/>" + this.x + ": " + this.y;
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

  public chart: Chart;
  ngOnInit() {}
  public onLoad(evt) {
    this.chart = evt.chart;
    this.chart.addSeries({
      type: "vector",
      name: "Electric vector field",
      data: this.vectorData
    });
  }
}
