import {Component, OnInit} from '@angular/core';
import {catchError, Observable, of, throwError} from "rxjs";
import {PredictiveModel} from "../model/predictivemodels.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportModelByDR} from "../model/reportModelByDR";
import {ReportModelByMarche} from "../model/reportModelByMarche";
import {PredictiveModelService} from "../services/predictive-model.service";
import {ReportModelService} from "../services/report-model.service";

@Component({
  selector: 'app-filter-by-name-and-date',
  templateUrl: './filter-by-name-and-date.component.html',
  styleUrls: ['./filter-by-name-and-date.component.css']
})
export class FilterByNameAndDateComponent implements OnInit {

  selectedPredictiveModelId!: number;
  selectedDate!: string;
  listOfPredictiveModel!: Observable<Array<PredictiveModel>>;
  reportOutputFileFormGroup!: FormGroup;
  errorMessage!: string;

  reportingByDR!: Observable<Array<ReportModelByDR>>;
  reportingByMarche!: Observable<Array<ReportModelByMarche>>;


  constructor(private predictiveModelService: PredictiveModelService,
              public reportModelService: ReportModelService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels();

    this.reportOutputFileFormGroup = this.fb.group({
      predictiveModelId: ['', Validators.required],
      dateGeneration: ['', Validators.required],
    });

  }

  //-------------------------------------------------------------------------------------------------------

  createChart() {  };

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

  showChartByMarche() {
    this.handleReportOutputModelByMarche();
  }

//-------------------------------------------------------------------------------------------------------
  showChartByDR() {
    this.handleReportOutputModelByDR();
  }

//-------------------------------------------------------------------------------------------------------

  handleReportOutputModelByDR() {
    const idPredictiveModel = this.selectedPredictiveModelId;
    const yearMonth = this.selectedDate;

    this.reportModelService.getReportingByDR(idPredictiveModel, yearMonth).pipe(
      catchError((err) => {
        this.errorMessage = err.message;
        return throwError(() => new Error(err.message));
      })
    ).subscribe(
      (data) => {
        // Handle the successful response here
        console.log('Reporting Predictive Model By Direction Regionale:', data);
        this.reportingByDR = of(data);

      }
    );
  }

//-------------------------------------------------------------------------------------------------------
  handleReportOutputModelByMarche() {
    const idPredictiveModel = this.selectedPredictiveModelId;
    const yearMonth = this.selectedDate;

    this.reportModelService.getReportingByMarche(idPredictiveModel, yearMonth).pipe(
      catchError((err) => {
        this.errorMessage = err.message;
        return throwError(() => new Error(err.message));
      })
    ).subscribe(
      (data) => {
        // Handle the successful response here
        console.log('Reporting Predictive Model By Marche:', data);
        this.reportingByMarche = of(data);

        /*        // Update chart data
                const labelsMarche: string[] = data.map((item) => item.libelleMarche);
                const dataNumberOfMarche: number[] = data.map((item) => item.numberOfOutput);

                this.chartMarche.labels = labelsMarche;
                this.barChart.datasets[0].data = dataNumberOfMarche;
                // Render the chart after updating data
                this.barCanvas?.nativeElement();

                console.log("-------> Marche :::::::::",labelsMarche)
                console.log("-------> numberOfOutput :::::::::",dataNumberOfMarche)*/

      }
    );
  }


}
