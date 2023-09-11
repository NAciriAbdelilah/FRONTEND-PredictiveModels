import {Component, OnInit} from '@angular/core';
import {catchError, Observable, of, throwError} from "rxjs";
import {PredictiveModel} from "../models/predictivemodels.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportModelByDR} from "../models/reportModelByDR";
import {ReportModelByMarche} from "../models/reportModelByMarche";
import {PredictiveModelService} from "../services/predictive-model.service";
import {ReportModelService} from "../services/report-model.service";
import {ReportModelBySegment} from "../models/reportModelBySegment";

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
  reportingBySegment!: Observable<Array<ReportModelBySegment>>;


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
  showChartByDR() {
    this.handleReportOutputModelByDR();
  }
//-------------------------------------------------------------------------------------------------------
  showChartByMarche() {
    this.handleReportOutputModelByMarche();
  }
//-------------------------------------------------------------------------------------------------------
  showChartBySegment() {
    this.handleReportOutputModelBySegment();
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

      }
    );
  }
//-------------------------------------------------------------------------------------------------------
  handleReportOutputModelBySegment() {
    const idPredictiveModel = this.selectedPredictiveModelId;
    const yearMonth = this.selectedDate;

    this.reportModelService.getReportingBySegment(idPredictiveModel, yearMonth).pipe(
      catchError((err) => {
        this.errorMessage = err.message;
        return throwError(() => new Error(err.message));
      })
    ).subscribe(
      (data) => {
        // Handle the successful response here
        console.log('Reporting Predictive Model By Segment:', data);
        this.reportingBySegment = of(data);

      }
    );
  }
//-------------------------------------------------------------------------------------------------------


}
