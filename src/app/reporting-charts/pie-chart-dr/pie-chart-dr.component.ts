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

        // Generate gradient colors based on data values
        //const gradientColors = this.generateGradientColors(this.dataPoints);

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
                    //backgroundColor: gradientColors,
                    backgroundColor: [
                      'rgba(220, 20, 60, 1)',
                      'rgba(105, 105, 105, 1)',
                      'rgba(205, 92, 92, 1)',
                      'rgba(25, 25, 112, 1)',
                      'rgba(255, 69, 0, 1)',
                      'rgba(100, 149, 237, 1)',
                      'rgba(0, 128, 128, 1)',
                      'rgba(128, 0, 128, 1)',
                      'rgba(205, 92, 92, 1)',
                      'rgba(211, 211, 211, 1)',
                      'rgba(135, 206, 250, 1)',
                      'rgba(165, 42, 42, 1)',
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
  //----------------------------------------------------------------------------------------------------------------
  // Function to generate gradient colors based on data values
  generateGradientColors(data: number[]): string[] {
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const valueRange = maxValue - minValue;

    return data.map((value) => {
      // Calculate a gradient based on the position relative to the range
      const gradient = (value - minValue + 100) / valueRange;
      // Map the gradient to a shade of red, with a wider range of shades
      const redShade = Math.round(255 * gradient);
      return `rgba(205, 92, 92, ${redShade / 255})`;
    });
  }



  //----------------------------------------------------------------------------------------------------------------


}
