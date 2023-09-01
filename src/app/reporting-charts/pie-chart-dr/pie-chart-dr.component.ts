import { Component, Input, OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, Chart } from 'chart.js'; // Import Chart class
import { catchError, throwError } from 'rxjs';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-pie-chart-dr',
  templateUrl: './pie-chart-dr.component.html',
  styleUrls: ['./pie-chart-dr.component.css']
})
export class PieChartDrComponent implements OnInit, OnChanges {
  @Input() reportingByDRData: any;
  @ViewChild('chartCanvasDr') chartCanvasDr: ElementRef | undefined; // Reference to the chart canvas

  labels: string[] = [];
  dataPoints: number[] = [];
  errorMessage: any;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.reportingByDRData);
    if (this.reportingByDRData) {
      this.createChart();
    }
  }

  createChart() {

    if (this.reportingByDRData) {

      // Create a new chart instance
      this.reportingByDRData.pipe(
        catchError((err) => {
          this.errorMessage = err.message;
          return throwError(() => new Error(err.message));
        })
      ).subscribe((data: any) => {
        console.log('ReportingByDRData:', data);

        // Update chart data
        this.labels = data.map((item: any) => item.directionRegionale);
        this.dataPoints = data.map((item: any) => item.numberOfOutput);

        // Create a new chart instance
        if (this.chartCanvasDr) {

          // Destroy the existing chart if it exists
          let chartStatus = Chart.getChart("chartCanvasDr"); // <canvas> id
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }

          const chartCanvas = this.chartCanvasDr.nativeElement as HTMLCanvasElement;
          const ctx = chartCanvas.getContext('2d');

          if (ctx) {
            new Chart(ctx, {
              type: 'bar', // Set the chart type to pie
              data: {
                labels: this.labels,
                datasets: [
                  {
                    data: this.dataPoints,
                    backgroundColor: [
                      'rgba(231, 72, 70, 1.6)', // Starting color
                      'rgb(231, 72, 70,1)',
                      'rgb(231, 72, 70,0.9)',
                      'rgba(231, 72, 70,0.7)',
                      'rgba(231, 72, 70, 0.3)' // Ending colored
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
                    text: 'Reporting du Modéle par Direction Régionale',
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

        console.log("DR :::::::::", this.labels);
        console.log("numberOfOutput :::::::::", this.dataPoints);
      });
    }
  }

}
