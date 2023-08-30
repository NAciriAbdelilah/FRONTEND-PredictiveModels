import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {catchError, throwError} from "rxjs";
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import DatalabelsPlugin from "chartjs-plugin-datalabels";

@Component({
  selector: 'app-pie-chart-marche',
  templateUrl: './pie-chart-marche.component.html',
  styleUrls: ['./pie-chart-marche.component.css']
})
export class PieChartMarcheComponent implements OnInit, OnChanges {

  @Input() reportingByMarcheData: any; // Define the input property
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  labels: string[] = []; // Initialize labels as an empty array
  dataPoints: number[] = []; // Initialize dataPoints as an empty array
  errorMessage: any;


  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.reportingByMarcheData)
    if (this.reportingByMarcheData) {
      this.createChart();
    }
  }

  //-------------------------------------------------------------------------------------------------------

  createChart() {

    if (this.reportingByMarcheData) {
      this.reportingByMarcheData.pipe(
        catchError((err) => {
          this.errorMessage = err.message;
          return throwError(() => new Error(err.message));
        })
      ).subscribe((data: any) => {
        console.log('Reporting reportingByMarcheData:', data);

        // Update chart data
        this.labels = data.map((item: any) => item.libelleMarche);
        this.dataPoints = data.map((item: any) => item.numberOfOutput);

        // Ensure chart is initialized before trying to update it
        if (this.chart) {
          // Update chart data
          this.chart.labels = this.labels;
          // Check if datasets[0] and data exist
          if (this.chart.datasets && this.chart.datasets.length > 0 && this.chart.datasets[0].data) {
            this.chart.datasets[0].data = this.dataPoints;
          }
          // Render the chart after updating data
          this.chart?.ngOnChanges({});
        }

        console.log("MARCHE :::::::::", this.labels);
        console.log("numberOfOutput :::::::::", this.dataPoints);
      });
    }
  }


  //-------------------------------------------------------------------------------------------------------

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
        anchor: 'center', // Horizontal alignment
        align: 'center',  // Vertical alignment
      },
      title: {
        display: true,
        text: 'Reporting du Modéle par Marchés', // Set your desired title here
        font: {
          size: 12, // Set the font size for the title
        },
      },
    },
    maintainAspectRatio: false, // Add this line to allow custom sizing
    aspectRatio: 1, // Adjust the aspect ratio as needed (1 is a square chart)
    animation: {
      duration: 200, // Set the animation duration here
    },
  };


  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.labels,
    datasets: [
      {
        data: this.dataPoints,
        backgroundColor: [
          'rgb(231,72,70)',
        ],
      },
    ],
  };

  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];


  changeLegendPosition(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.position =
        this.pieChartOptions.plugins.legend.position === 'left'
          ? 'top'
          : 'left';
    }

    this.chart?.render();
  }


}
