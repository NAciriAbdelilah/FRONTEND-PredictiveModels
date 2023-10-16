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
import Swal from "sweetalert2";

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

    // Set default values for predictiveModelId, dateGeneration, and canalName
    const defaultPredictiveModelId = '153'; // Replace with your desired default value
    const defaultDateGeneration = '2023-05'; // Replace with your desired default value
    const defaultCanalName = 'SMS'; // Replace with your desired default value

    this.reportOutputFileFormGroup = this.fb.group({
      predictiveModelId: [defaultPredictiveModelId, Validators.required],
      dateGeneration: [defaultDateGeneration, Validators.required],
      canalName: [defaultCanalName, Validators.required]
    });

    // Load the charts with default values
    this.selectedPredictiveModelId = parseInt(defaultPredictiveModelId);
    this.selectedDate = defaultDateGeneration;
    this.selectedCanalsName = defaultCanalName;
    this.handleReportOutputModelByDR();
    this.handleReportOutputModelBySegment();
    this.handleReportOutputModelByMarche();

  }

  //-------------------------------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------------------------------

  onPredictiveModelSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedPredictiveModelId = parseInt(selectedValue);
    console.log('Selected PM ID:', this.selectedPredictiveModelId);
/*    this.handleReportOutputModelByDR();
    this.handleReportOutputModelBySegment();
    this.handleReportOutputModelByMarche();*/
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
        // Check if the data is empty and display an alert
        if (data && data.length === 0) {
          Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Aucune donnée disponible pour ce modèle prédictif et ce canal.',
            showConfirmButton: true,
            confirmButtonColor: '#cb3533',
            timer: 3000
          });
        } else {
          console.log('Reporting Predictive Model By Direction Regionale:', data);
          this.reportingByDR = of(data);
        }
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
        // Check if the data is empty and display an alert
        if (data && data.length === 0) {
          Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Aucune donnée disponible pour ce modèle prédictif et ce canal.',
            showConfirmButton: true,
            confirmButtonColor: '#cb3533',
            timer: 3000
          });
        } else {
          console.log('Reporting Predictive Model By Marche:', data);
          this.reportingByMarche = of(data);
        }
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
        // Check if the data is empty and display an alert
        if (data && data.length === 0) {
          Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Aucune donnée disponible pour ce modèle prédictif et ce canal.',
            showConfirmButton: true,
            confirmButtonColor: '#cb3533',
            timer: 3000
          });
        } else {
          console.log('Reporting Predictive Model By Segment:', data);
          this.reportingBySegment = of(data);
        }
      }
    );
  }
//-------------------------------------------------------------------------------------------------------


}
