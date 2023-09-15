import {Component, OnInit} from '@angular/core';
import {catchError, Observable, of, throwError} from "rxjs";
import {PredictiveModel} from "../models/predictivemodels.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportModelByDR} from "../models/reportModelByDR";
import {ReportModelByMarche} from "../models/reportModelByMarche";
import {PredictiveModelService} from "../services/predictive-model.service";
import {ReportModelService} from "../services/report-model.service";
import {ReportModelBySegment} from "../models/reportModelBySegment";
import {Canals} from "../models/canals.model";
import {CanalsService} from "../services/canals.service";

@Component({
  selector: 'app-filter-by-name-and-date',
  templateUrl: './filter-by-name-and-date.component.html',
  styleUrls: ['./filter-by-name-and-date.component.css']
})
export class FilterByNameAndDateComponent implements OnInit {

  selectedPredictiveModelId!: number;
  selectedDate!: string;
  selectedCanalsName!: string;

  listOfPredictiveModel!: Observable<Array<PredictiveModel>>;
  listOfCanals! : Observable<Array<Canals>>;
  reportOutputFileFormGroup!: FormGroup;
  errorMessage!: string;

  reportingByDR!: Observable<Array<ReportModelByDR>>;
  reportingBySegment!: Observable<Array<ReportModelBySegment>>;
  reportingByMarche!: Observable<Array<ReportModelByMarche>>;


  constructor(private predictiveModelService: PredictiveModelService,
              private canalService : CanalsService,
              public reportModelService: ReportModelService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels();

    this.listOfCanals = this.canalService.getAllCanals();

    this.reportOutputFileFormGroup = this.fb.group({
      predictiveModelId: ['', Validators.required],
      dateGeneration: ['', Validators.required],
      canalName: ['', Validators.required],

    });

  }

  //-------------------------------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------------------------------

  onPredictiveModelSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedPredictiveModelId = parseInt(selectedValue);
    console.log('Selected PM ID:', this.selectedPredictiveModelId);
    this.handleReportOutputModelByDR();
    this.handleReportOutputModelBySegment();
    this.handleReportOutputModelByMarche();
  }

  onDateSelect(event: any) {
    this.selectedDate = event.target.value;
    console.log('Selected DATE:', this.selectedDate);
    this.handleReportOutputModelByDR();
    this.handleReportOutputModelBySegment();
    this.handleReportOutputModelByMarche();
  }

  onCanalSelect(event: any) {
    this.selectedCanalsName = event.target.value;
    console.log('Selected CANAL NAME:', this.selectedCanalsName);
    this.handleReportOutputModelByDR();
    this.handleReportOutputModelBySegment();
    this.handleReportOutputModelByMarche();
  }

//-------------------------------------------------------------------------------------------------------
/*  showChartByDR() {
    this.handleReportOutputModelByDR();
  }
//-------------------------------------------------------------------------------------------------------
  showChartBySegment() {
    this.handleReportOutputModelBySegment();
  }
//-------------------------------------------------------------------------------------------------------
  showChartByMarche() {
    this.handleReportOutputModelByMarche();
  }*/
//-------------------------------------------------------------------------------------------------------
  handleReportOutputModelByDR() {
    const idPredictiveModel = this.selectedPredictiveModelId;
    const yearMonth = this.selectedDate;
    const canalName = this.selectedCanalsName;

    this.reportModelService.getReportingByDR(idPredictiveModel, yearMonth, canalName).pipe(
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
    const canalName = this.selectedCanalsName;


    this.reportModelService.getReportingByMarche(idPredictiveModel, yearMonth, canalName).pipe(
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
    const canalName = this.selectedCanalsName;

    this.reportModelService.getReportingBySegment(idPredictiveModel, yearMonth, canalName).pipe(
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
