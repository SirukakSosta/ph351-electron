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
      text: "Fruit consumption *"
    },
    subtitle: {
      text: "* Jane's banana consumption is unknown",
      floating: true,
      align: "right",
      verticalAlign: "bottom",
      y: 15
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
    // xAxis: {
    //   categories: [
    //     "Apples",
    //     "Pears",
    //     "Oranges",
    //     "Bananas",
    //     "Grapes",
    //     "Plums",
    //     "Strawberries",
    //     "Raspberries"
    //   ]
    // },
    // yAxis: {
    //   title: {
    //     text: "Y-Axis"
    //   },
    //   labels: {
    //     formatter: function() {
    //       return this.value.toString();
    //     }
    //   }
    // },
    tooltip: {
      formatter: function () {
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
  ngOnInit() {

  }
  public onLoad(evt) {
    this.chart = evt.chart;
    this.chart.addSeries({
      type: "vector",
      name: "Sample vector field",
      data: this.vectorData
    });
    // this.chart.addSeries({
    //   type: "vector",
    //   name: "Sample vector field",
    //   data: [
    //     [5, 5, 190, 18],
    //     [5, 10, 185, 27],
    //     [5, 15, 180, 36],
    //     [5, 20, 175, 45],
    //     [5, 25, 170, 54],
    //     [5, 30, 165, 63],
    //     [5, 35, 160, 72],
    //     [5, 40, 155, 81],
    //     [5, 45, 150, 90],
    //     [5, 50, 145, 99],
    //     [5, 55, 140, 108],
    //     [5, 60, 135, 117],
    //     [5, 65, 130, 126],
    //     [5, 70, 125, 135],
    //     [5, 75, 120, 144],
    //     [5, 80, 115, 153],
    //     [5, 85, 110, 162],
    //     [5, 90, 105, 171],
    //     [5, 95, 100, 180],
    //     [10, 5, 185, 27],
    //     [10, 10, 180, 36],
    //     [10, 15, 175, 45],
    //     [10, 20, 170, 54],
    //     [10, 25, 165, 63],
    //     [10, 30, 160, 72],
    //     [10, 35, 155, 81],
    //     [10, 40, 150, 90],
    //     [10, 45, 145, 99],
    //     [10, 50, 140, 108],
    //     [10, 55, 135, 117],
    //     [10, 60, 130, 126],
    //     [10, 65, 125, 135],
    //     [10, 70, 120, 144],
    //     [10, 75, 115, 153],
    //     [10, 80, 110, 162],
    //     [10, 85, 105, 171],
    //     [10, 90, 100, 180],
    //     [10, 95, 95, 189],
    //     [15, 5, 180, 36],
    //     [15, 10, 175, 45],
    //     [15, 15, 170, 54],
    //     [15, 20, 165, 63],
    //     [15, 25, 160, 72],
    //     [15, 30, 155, 81],
    //     [15, 35, 150, 90],
    //     [15, 40, 145, 99],
    //     [15, 45, 140, 108],
    //     [15, 50, 135, 117],
    //     [15, 55, 130, 126],
    //     [15, 60, 125, 135],
    //     [15, 65, 120, 144],
    //     [15, 70, 115, 153],
    //     [15, 75, 110, 162],
    //     [15, 80, 105, 171],
    //     [15, 85, 100, 180],
    //     [15, 90, 95, 189],
    //     [15, 95, 90, 198],
    //     [20, 5, 175, 45],
    //     [20, 10, 170, 54],
    //     [20, 15, 165, 63],
    //     [20, 20, 160, 72],
    //     [20, 25, 155, 81],
    //     [20, 30, 150, 90],
    //     [20, 35, 145, 99],
    //     [20, 40, 140, 108],
    //     [20, 45, 135, 117],
    //     [20, 50, 130, 126],
    //     [20, 55, 125, 135],
    //     [20, 60, 120, 144],
    //     [20, 65, 115, 153],
    //     [20, 70, 110, 162],
    //     [20, 75, 105, 171],
    //     [20, 80, 100, 180],
    //     [20, 85, 95, 189],
    //     [20, 90, 90, 198],
    //     [20, 95, 85, 207],
    //     [25, 5, 170, 54],
    //     [25, 10, 165, 63],
    //     [25, 15, 160, 72],
    //     [25, 20, 155, 81],
    //     [25, 25, 150, 90],
    //     [25, 30, 145, 99],
    //     [25, 35, 140, 108],
    //     [25, 40, 135, 117],
    //     [25, 45, 130, 126],
    //     [25, 50, 125, 135],
    //     [25, 55, 120, 144],
    //     [25, 60, 115, 153],
    //     [25, 65, 110, 162],
    //     [25, 70, 105, 171],
    //     [25, 75, 100, 180],
    //     [25, 80, 95, 189],
    //     [25, 85, 90, 198],
    //     [25, 90, 85, 207],
    //     [25, 95, 80, 216],
    //     [30, 5, 165, 63],
    //     [30, 10, 160, 72],
    //     [30, 15, 155, 81],
    //     [30, 20, 150, 90],
    //     [30, 25, 145, 99],
    //     [30, 30, 140, 108],
    //     [30, 35, 135, 117],
    //     [30, 40, 130, 126],
    //     [30, 45, 125, 135],
    //     [30, 50, 120, 144],
    //     [30, 55, 115, 153],
    //     [30, 60, 110, 162],
    //     [30, 65, 105, 171],
    //     [30, 70, 100, 180],
    //     [30, 75, 95, 189],
    //     [30, 80, 90, 198],
    //     [30, 85, 85, 207],
    //     [30, 90, 80, 216],
    //     [30, 95, 75, 225],
    //     [35, 5, 160, 72],
    //     [35, 10, 155, 81],
    //     [35, 15, 150, 90],
    //     [35, 20, 145, 99],
    //     [35, 25, 140, 108],
    //     [35, 30, 135, 117],
    //     [35, 35, 130, 126],
    //     [35, 40, 125, 135],
    //     [35, 45, 120, 144],
    //     [35, 50, 115, 153],
    //     [35, 55, 110, 162],
    //     [35, 60, 105, 171],
    //     [35, 65, 100, 180],
    //     [35, 70, 95, 189],
    //     [35, 75, 90, 198],
    //     [35, 80, 85, 207],
    //     [35, 85, 80, 216],
    //     [35, 90, 75, 225],
    //     [35, 95, 70, 234],
    //     [40, 5, 155, 81],
    //     [40, 10, 150, 90],
    //     [40, 15, 145, 99],
    //     [40, 20, 140, 108],
    //     [40, 25, 135, 117],
    //     [40, 30, 130, 126],
    //     [40, 35, 125, 135],
    //     [40, 40, 120, 144],
    //     [40, 45, 115, 153],
    //     [40, 50, 110, 162],
    //     [40, 55, 105, 171],
    //     [40, 60, 100, 180],
    //     [40, 65, 95, 189],
    //     [40, 70, 90, 198],
    //     [40, 75, 85, 207],
    //     [40, 80, 80, 216],
    //     [40, 85, 75, 225],
    //     [40, 90, 70, 234],
    //     [40, 95, 65, 243],
    //     [45, 5, 150, 90],
    //     [45, 10, 145, 99],
    //     [45, 15, 140, 108],
    //     [45, 20, 135, 117],
    //     [45, 25, 130, 126],
    //     [45, 30, 125, 135],
    //     [45, 35, 120, 144],
    //     [45, 40, 115, 153],
    //     [45, 45, 110, 162],
    //     [45, 50, 105, 171],
    //     [45, 55, 100, 180],
    //     [45, 60, 95, 189],
    //     [45, 65, 90, 198],
    //     [45, 70, 85, 207],
    //     [45, 75, 80, 216],
    //     [45, 80, 75, 225],
    //     [45, 85, 70, 234],
    //     [45, 90, 65, 243],
    //     [45, 95, 60, 252],
    //     [50, 5, 145, 99],
    //     [50, 10, 140, 108],
    //     [50, 15, 135, 117],
    //     [50, 20, 130, 126],
    //     [50, 25, 125, 135],
    //     [50, 30, 120, 144],
    //     [50, 35, 115, 153],
    //     [50, 40, 110, 162],
    //     [50, 45, 105, 171],
    //     [50, 50, 100, 180],
    //     [50, 55, 95, 189],
    //     [50, 60, 90, 198],
    //     [50, 65, 85, 207],
    //     [50, 70, 80, 216],
    //     [50, 75, 75, 225],
    //     [50, 80, 70, 234],
    //     [50, 85, 65, 243],
    //     [50, 90, 60, 252],
    //     [50, 95, 55, 261],
    //     [55, 5, 140, 108],
    //     [55, 10, 135, 117],
    //     [55, 15, 130, 126],
    //     [55, 20, 125, 135],
    //     [55, 25, 120, 144],
    //     [55, 30, 115, 153],
    //     [55, 35, 110, 162],
    //     [55, 40, 105, 171],
    //     [55, 45, 100, 180],
    //     [55, 50, 95, 189],
    //     [55, 55, 90, 198],
    //     [55, 60, 85, 207],
    //     [55, 65, 80, 216],
    //     [55, 70, 75, 225],
    //     [55, 75, 70, 234],
    //     [55, 80, 65, 243],
    //     [55, 85, 60, 252],
    //     [55, 90, 55, 261],
    //     [55, 95, 50, 270],
    //     [60, 5, 135, 117],
    //     [60, 10, 130, 126],
    //     [60, 15, 125, 135],
    //     [60, 20, 120, 144],
    //     [60, 25, 115, 153],
    //     [60, 30, 110, 162],
    //     [60, 35, 105, 171],
    //     [60, 40, 100, 180],
    //     [60, 45, 95, 189],
    //     [60, 50, 90, 198],
    //     [60, 55, 85, 207],
    //     [60, 60, 80, 216],
    //     [60, 65, 75, 225],
    //     [60, 70, 70, 234],
    //     [60, 75, 65, 243],
    //     [60, 80, 60, 252],
    //     [60, 85, 55, 261],
    //     [60, 90, 50, 270],
    //     [60, 95, 45, 279],
    //     [65, 5, 130, 126],
    //     [65, 10, 125, 135],
    //     [65, 15, 120, 144],
    //     [65, 20, 115, 153],
    //     [65, 25, 110, 162],
    //     [65, 30, 105, 171],
    //     [65, 35, 100, 180],
    //     [65, 40, 95, 189],
    //     [65, 45, 90, 198],
    //     [65, 50, 85, 207],
    //     [65, 55, 80, 216],
    //     [65, 60, 75, 225],
    //     [65, 65, 70, 234],
    //     [65, 70, 65, 243],
    //     [65, 75, 60, 252],
    //     [65, 80, 55, 261],
    //     [65, 85, 50, 270],
    //     [65, 90, 45, 279],
    //     [65, 95, 40, 288],
    //     [70, 5, 125, 135],
    //     [70, 10, 120, 144],
    //     [70, 15, 115, 153],
    //     [70, 20, 110, 162],
    //     [70, 25, 105, 171],
    //     [70, 30, 100, 180],
    //     [70, 35, 95, 189],
    //     [70, 40, 90, 198],
    //     [70, 45, 85, 207],
    //     [70, 50, 80, 216],
    //     [70, 55, 75, 225],
    //     [70, 60, 70, 234],
    //     [70, 65, 65, 243],
    //     [70, 70, 60, 252],
    //     [70, 75, 55, 261],
    //     [70, 80, 50, 270],
    //     [70, 85, 45, 279],
    //     [70, 90, 40, 288],
    //     [70, 95, 35, 297],
    //     [75, 5, 120, 144],
    //     [75, 10, 115, 153],
    //     [75, 15, 110, 162],
    //     [75, 20, 105, 171],
    //     [75, 25, 100, 180],
    //     [75, 30, 95, 189],
    //     [75, 35, 90, 198],
    //     [75, 40, 85, 207],
    //     [75, 45, 80, 216],
    //     [75, 50, 75, 225],
    //     [75, 55, 70, 234],
    //     [75, 60, 65, 243],
    //     [75, 65, 60, 252],
    //     [75, 70, 55, 261],
    //     [75, 75, 50, 270],
    //     [75, 80, 45, 279],
    //     [75, 85, 40, 288],
    //     [75, 90, 35, 297],
    //     [75, 95, 30, 306],
    //     [80, 5, 115, 153],
    //     [80, 10, 110, 162],
    //     [80, 15, 105, 171],
    //     [80, 20, 100, 180],
    //     [80, 25, 95, 189],
    //     [80, 30, 90, 198],
    //     [80, 35, 85, 207],
    //     [80, 40, 80, 216],
    //     [80, 45, 75, 225],
    //     [80, 50, 70, 234],
    //     [80, 55, 65, 243],
    //     [80, 60, 60, 252],
    //     [80, 65, 55, 261],
    //     [80, 70, 50, 270],
    //     [80, 75, 45, 279],
    //     [80, 80, 40, 288],
    //     [80, 85, 35, 297],
    //     [80, 90, 30, 306],
    //     [80, 95, 25, 315],
    //     [85, 5, 110, 162],
    //     [85, 10, 105, 171],
    //     [85, 15, 100, 180],
    //     [85, 20, 95, 189],
    //     [85, 25, 90, 198],
    //     [85, 30, 85, 207],
    //     [85, 35, 80, 216],
    //     [85, 40, 75, 225],
    //     [85, 45, 70, 234],
    //     [85, 50, 65, 243],
    //     [85, 55, 60, 252],
    //     [85, 60, 55, 261],
    //     [85, 65, 50, 270],
    //     [85, 70, 45, 279],
    //     [85, 75, 40, 288],
    //     [85, 80, 35, 297],
    //     [85, 85, 30, 306],
    //     [85, 90, 25, 315],
    //     [85, 95, 20, 324],
    //     [90, 5, 105, 171],
    //     [90, 10, 100, 180],
    //     [90, 15, 95, 189],
    //     [90, 20, 90, 198],
    //     [90, 25, 85, 207],
    //     [90, 30, 80, 216],
    //     [90, 35, 75, 225],
    //     [90, 40, 70, 234],
    //     [90, 45, 65, 243],
    //     [90, 50, 60, 252],
    //     [90, 55, 55, 261],
    //     [90, 60, 50, 270],
    //     [90, 65, 45, 279],
    //     [90, 70, 40, 288],
    //     [90, 75, 35, 297],
    //     [90, 80, 30, 306],
    //     [90, 85, 25, 315],
    //     [90, 90, 20, 324],
    //     [90, 95, 15, 333],
    //     [95, 5, 100, 180],
    //     [95, 10, 95, 189],
    //     [95, 15, 90, 198],
    //     [95, 20, 85, 207],
    //     [95, 25, 80, 216],
    //     [95, 30, 75, 225],
    //     [95, 35, 70, 234],
    //     [95, 40, 65, 243],
    //     [95, 45, 60, 252],
    //     [95, 50, 55, 261],
    //     [95, 55, 50, 270],
    //     [95, 60, 45, 279],
    //     [95, 65, 40, 288],
    //     [95, 70, 35, 297],
    //     [95, 75, 30, 306],
    //     [95, 80, 25, 315],
    //     [95, 85, 20, 324],
    //     [95, 90, 15, 333],
    //     [95, 95, 10, 342]
    //   ]
    // });
  }
}
