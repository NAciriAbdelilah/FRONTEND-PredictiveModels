import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {catchError, throwError} from "rxjs";
import {Chart, ChartConfiguration, ChartData, ChartType} from "chart.js";
import DatalabelsPlugin from "chartjs-plugin-datalabels";

@Component({
  selector: 'app-pie-chart-marche',
  templateUrl: './pie-chart-marche.component.html',
  styleUrls: ['./pie-chart-marche.component.css']
})
export class PieChartMarcheComponent implements OnInit, OnChanges {

  @Input() reportingByMarcheData: any; // Define the input property
  @ViewChild('chartCanvasMarche') chartCanvasMarche: ElementRef | undefined; // Reference to the chart canvas

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

      // Create a new chart instance
      this.reportingByMarcheData.pipe(
        catchError((err) => {
          this.errorMessage = err.message;
          return throwError(() => new Error(err.message));
        })
      ).subscribe((data: any) => {
        console.log('ReportingByMarcheData:', data);

        // Update chart data
        this.labels = data.map((item: any) => item.libelleMarche);
        this.dataPoints = data.map((item: any) => item.numberOfOutput);


        // Create a new chart instance
        if (this.chartCanvasMarche) {

          // Destroy the existing chart if it exists
          let chartStatus = Chart.getChart("chartCanvasMarche"); // <canvas> id
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }

          const chartCanvas = this.chartCanvasMarche.nativeElement as HTMLCanvasElement;
          const ctx = chartCanvas.getContext('2d');

          if (ctx) {
            new Chart(ctx, {
              type: 'pie', // Set the chart type to pie|bar....
              data: {
                labels: this.labels,
                datasets: [
                  {
                    data: this.dataPoints,

                    backgroundColor: [
                      'rgb(122,0,18)',
                      'rgb(39,42,66)',
                      'rgb(199,0,0)',
                      'rgb(135,42,66)',
                      'rgb(7,42,66)',
                      'rgb(103,42,66)',
                      'rgb(8,37,69)',
                      'rgb(213,5,5)',
                      'rgb(149,51,65)',
                      'rgb(238,49,35)',
                    ],
                  },
                ],
              },
              options: {
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
                    anchor: 'center',
                    align: 'center',
                  },
                  title: {
                    display: true,
                    text: 'Reporting du Modéle par Marchés',
                    font: {
                      size: 12,
                    },
                  },
                },
                maintainAspectRatio: false,
                aspectRatio: 1,
                animation: {
                  duration: 200,
                },
              },
            });
          }
        }

        console.log("MARCHE :::::::::", this.labels);
        console.log("numberOfOutput :::::::::", this.dataPoints);
      });
    }
  }

}
