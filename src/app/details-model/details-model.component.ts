  import { Component, OnInit } from '@angular/core';
  import {PredictiveModel} from "../model/predictivemodels.model";
  import {PredictiveModelService} from "../services/predictive-model.service";
  import {FormBuilder} from "@angular/forms";
  import {ActivatedRoute, Router} from "@angular/router";
  import {catchError, Observable, switchMap, throwError} from "rxjs";
  import {FeaturesService} from "../services/features.service";
  import {Features} from "../model/features.model";
  import {Scopes} from "../model/scopes.model";
  import {ScopesService} from "../services/scopes.service";
  import {Canals} from "../model/canals.model";
  import {Frequences} from "../model/frequences.model";
  import {CanalsService} from "../services/canals.service";
  import {FrequenceService} from "../services/frequence.service";
  import {AuthenticationService} from "../services/authentication.service";

  @Component({
    selector: 'app-details-model',
    templateUrl: './details-model.component.html',
    styleUrls: ['./details-model.component.css']
  })
  export class DetailsModelComponent implements OnInit {

    predictiveModel!: PredictiveModel;
    listOfFeatures: Array<Array<Features>> = [];
    listOfScopes: Array<Array<Scopes>> = [];
    listOfCanals: Array<Array<Canals>> = [];
    listOfFrequency: Array<Array<Frequences>> = [];
    errorMessage! : string;
    formattedRemarks: string[] = []; // Array to store formatted remarks
    formattedNextSteps: string[] = []; // Array to store formatted next Steps

      constructor(
        private predictiveModelService : PredictiveModelService,
        public authService : AuthenticationService,
        private featureService : FeaturesService,
        private scopesService : ScopesService,
        private canalsService : CanalsService,
        private frequenceService : FrequenceService,
        private fb : FormBuilder,
        private router : Router,
        private route: ActivatedRoute
      ) { }

      ngOnInit(): void {
        this.route.params.subscribe(params => {
          const predictiveModelId = +params['id'];
          this.handleGetPredictiveModelDetails(predictiveModelId);
          this.handleGetFeaturesByPredictiveModelID(predictiveModelId);
          this.handleGetScopesByPredictiveModelID(predictiveModelId);
          this.handleGetCanalsByPredictiveModelID(predictiveModelId);
          this.handleGetFrequencyByPredictiveModelID(predictiveModelId);
        });
      }

    // this method help to format remarks PM
    formatRemarksAndNextSteps(): void {
      if (this.predictiveModel && this.predictiveModel.remarksPM && this.predictiveModel.nextStepsPM) {
        // Split the remarks & nextSteps based on the minus (-) character and format them
        this.formattedRemarks = this.predictiveModel.remarksPM.split('-').map(remark => remark.trim());
        this.formattedNextSteps = this.predictiveModel.nextStepsPM.split('-').map(nextStep => nextStep.trim());

      }
    }

      handleGetPredictiveModelDetails(predictiveModelId: number): void {
        this.predictiveModelService.getPredictiveModelById(predictiveModelId).pipe(
          catchError(err => {
            this.errorMessage = err.message;
            return throwError(err);
          })
        ).subscribe((pm: PredictiveModel) => {
          console.log("this.predictiveModel", pm);
          this.predictiveModel = pm;
          this.formatRemarksAndNextSteps(); // Call formatRemarksAndNextSteps() after data is received
          console.log(this.formattedRemarks,this.formattedNextSteps)
        });
      }

      handleGetFeaturesByPredictiveModelID(predictiveModelId: number): void {
        this.featureService.getFeaturesByPredictiveModelById(predictiveModelId).pipe(
          catchError(err => {
            this.errorMessage = err.message;
            return throwError(err);
          })
        ).subscribe((featuresArray: Array<Features>) => {
          this.listOfFeatures.push(featuresArray);
          console.log("this.listOfFeatures", this.listOfFeatures);
        });
      }

      handleGetScopesByPredictiveModelID(predictiveModelId: number): void {
        this.scopesService.getScopesByPredictiveModelById(predictiveModelId).pipe(
          catchError(err => {
            this.errorMessage = err.message;
            return throwError(err);
          })
        ).subscribe((scopesArray: Array<Scopes>) => {
          this.listOfScopes.push(scopesArray);
          console.log("this.listOfScopes", this.listOfScopes);
        });
      }

      handleGetCanalsByPredictiveModelID(predictiveModelId: number): void {
        this.canalsService.getCanalsByPredictiveModelById(predictiveModelId).pipe(
          catchError(err => {
            this.errorMessage = err.message;
            return throwError(err);
          })
        ).subscribe((canalsArray: Array<Canals>) => {
          this.listOfCanals.push(canalsArray);
          console.log("this.listOfCanals", this.listOfCanals);
        });
      }

      handleGetFrequencyByPredictiveModelID(predictiveModelId: number): void {
        this.frequenceService.getFrequencyByPredictiveModelById(predictiveModelId).pipe(
          catchError(err => {
            this.errorMessage = err.message;
            return throwError(err);
          })
        ).subscribe((frequencyArray: Array<Frequences>) => {
          this.listOfFrequency.push(frequencyArray);
          console.log("this.listOfFrequency", this.listOfFrequency);
        });
      }

      convertTimestampToDate(timestamp: string): Date {
        const timestampInMillis = parseInt(timestamp) * 1000;
        return new Date(timestampInMillis);
      }
  }
