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
                    backgroundColor: [
                      'rgba(255,118,118)', // Starting color
                      'rgb(250,48,47)',
                      'rgba(243,9,9,0.81)',
                      'rgb(210,40,40)',
                      'rgba(204,40,39,0.7)',
                      'rgba(124,14,13,0.81)',
                      'rgba(250,77,76,0.5)',
                      'rgba(134,37,35,0.4)' // Ending colored
                    ],
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

}
