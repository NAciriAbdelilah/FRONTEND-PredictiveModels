import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {

  }

  /*

      @ViewChild('chartMarche') chartMarche : ElementRef | undefined;

      // Bar
      public pieChartMarcheOptions: ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          datalabels: {
            formatter: (value: any, barchart: any) => {
              if (barchart.chartMarche.data.labels) {
                return barchart.chartMarche.data.labels[barchart.dataIndex];
              }
            },
            anchor: 'center', // Horizontal alignment
            align: 'center',  // Vertical alignment
          },
          title: {
            display: true,
            text: 'Reporting du Modéle par Marché', // Set your desired title here
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


      public pieChartMarcheData: ChartData<'bar', number[], string | string[]> = {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      };
      public pieChartMarcheType: ChartType = 'bar';
      public pieChartMarchePlugins = [DatalabelsPlugin];
  */


//-------------------------------------------------------------------------------------------------------


}
