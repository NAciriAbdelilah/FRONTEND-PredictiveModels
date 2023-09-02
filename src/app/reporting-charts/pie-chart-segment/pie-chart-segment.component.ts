import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {catchError, throwError} from "rxjs";
import {Chart} from "chart.js";

@Component({
  selector: 'app-pie-chart-segment',
  templateUrl: './pie-chart-segment.component.html',
  styleUrls: ['./pie-chart-segment.component.css']
})
export class PieChartSegmentComponent implements OnInit {


  @Input() reportingBySegmentData: any; // Define the input property
  @ViewChild('chartCanvasSegment') chartCanvasSegment: ElementRef | undefined; // Reference to the chart canvas

  labels: string[] = []; // Initialize labels as an empty array
  dataPoints: number[] = []; // Initialize dataPoints as an empty array
  errorMessage: any;


  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.reportingBySegmentData)
    if (this.reportingBySegmentData) {
      this.createChart();
    }
  }

  //-------------------------------------------------------------------------------------------------------
  createChart() {

    if (this.reportingBySegmentData) {

      // Create a new chart instance
      this.reportingBySegmentData.pipe(
        catchError((err) => {
          this.errorMessage = err.message;
          return throwError(() => new Error(err.message));
        })
      ).subscribe((data: any) => {
        console.log('ReportingBySegmentData:', data);

        // Update chart data
        this.labels = data.map((item: any) => item.libelleSegment);
        this.dataPoints = data.map((item: any) => item.numberOfOutput);

        // Generate gradient colors based on data values
        const gradientColors = this.generateGradientColors(this.dataPoints);

        // Create a new chart instance
        if (this.chartCanvasSegment) {

          // Destroy the existing chart if it exists
          let chartStatus = Chart.getChart("chartCanvasSegment"); // <canvas> id
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }

          const chartCanvas = this.chartCanvasSegment.nativeElement as HTMLCanvasElement;
          const ctx = chartCanvas.getContext('2d');

          if (ctx) {
            new Chart(ctx, {
              type: 'bar', // Set the chart type to pie|bar....
              data: {
                labels: this.labels,
                datasets: [
                  {
                    data: this.dataPoints,
                    backgroundColor: gradientColors,

                  },
                ]
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
                    text: 'Reporting du Modéle par Segments',
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

        console.log("SEGMENT :::::::::", this.labels);
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
