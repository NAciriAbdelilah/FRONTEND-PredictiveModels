import {Component, OnInit, ViewChild} from '@angular/core';
import {catchError, Observable, of, throwError} from "rxjs";
import {PredictiveModel} from "../model/predictivemodels.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PredictiveModelService} from "../services/predictive-model.service";
import {ReportModelService} from "../services/report-model.service";
import {Canals} from "../model/canals.model";
import {ReportModel} from "../model/report.model";
import {BaseChartDirective,Lab  el} from "ng2-charts";
import {ChartConfiguration, ChartData, ChartEvent, ChartType} from "chart.js";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  selectedPredictiveModelId!: number;
  selectedDate! : string;
  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  reportOutputFileFormGroup!: FormGroup;
  errorMessage! : string;
  reportingByDR!: Observable<Array<ReportModel>>;
  defaultChartData: number[] = []; // Initialize with empty values



  constructor(private predictiveModelService : PredictiveModelService,
              private reportModelService: ReportModelService,
              private fb : FormBuilder) {}

  ngOnInit(): void {

    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels();

    this.reportOutputFileFormGroup = this.fb.group({
      predictiveModelId: ['', Validators.required],
      dateGeneration: ['', Validators.required],
    });

  }

  //-------------------------------------------------------------------------------------------------------

  onPredictiveModelSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedPredictiveModelId = parseInt(selectedValue);
    console.log('Selected PM ID:', this.selectedPredictiveModelId);
  }

  onDateSelect(event: any) {
    this.selectedDate = event.target.value;
    console.log('Selected DATE:', this.selectedDate);
  }

//-------------------------------------------------------------------------------------------------------

  handleReportOutputModelByDR() {
    const idPredictiveModel = this.selectedPredictiveModelId;
    const yearMonth = this.selectedDate;

    this.reportModelService.getReportingByDR(idPredictiveModel, yearMonth).pipe(
      catchError((err) => {
        this.errorMessage = err.message;
        return throwError(() => new Error(err.message)); // Use a factory function
      })
    ).subscribe(
      (data) => {
        // Handle the successful response here
        console.log('Reporting Predictive Model By Direction Regionale:', data);
        this.reportingByDR = of(data);

        // Update chart data
        const labels: Label[] = data.map((item) => item.directionRegional);
        const dataPoints: number[] = data.map((item) => item.numberOfOutput);

        this.barChartData.labels = labels;
        this.barChartData.datasets[0].data = dataPoints;

      }
    );
  }
//-------------------------------------------------------------------------------------------------------
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];

  public barChartData: ChartData<'bar'> = {
    labels: this.defaultChartData,
    datasets: [
      { data: this.defaultChartData, label: 'DR' },
    ],
  };

  // events
  public chartClicked({
                        event,
                        active,
                      }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
                        event,
                        active,
                      }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }



}

