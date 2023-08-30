import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {catchError, of, throwError} from "rxjs";
import DatalabelsPlugin from "chartjs-plugin-datalabels";
import {BaseChartDirective} from "ng2-charts";

@Component({
  selector: 'app-pie-chart-dr',
  templateUrl: './pie-chart-dr.component.html',
  styleUrls: ['./pie-chart-dr.component.css']
})

export class PieChartDrComponent implements OnInit, OnChanges {
  @Input() reportingByDRData: any; // Define the input property
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  //chart: any;
  labels: string[] = []; // Initialize labels as an empty array
  dataPoints: number[] = []; // Initialize dataPoints as an empty array
  errorMessage: any;


  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.reportingByDRData)
    this.createChart();
  }

  //-------------------------------------------------------------------------------------------------------

  createChart() {

    if (this.reportingByDRData) {
      this.reportingByDRData.pipe(
        catchError((err) => {
          this.errorMessage = err.message;
          return throwError(() => new Error(err.message));
        })
      ).subscribe((data: any) => {
        console.log('Reporting reportingByDRData:', data);

        // Update chart data
        this.labels = data.map((item: any) => item.directionRegionale);
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

        console.log("DR :::::::::", this.labels);
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
        text: 'Reporting du Modéle par Direction Régionale', // Set your desired title here
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
          'rgba(255, 99, 132, 0.7)',
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

//-------------------------------------------------------------------------------------------------------

