  import { Component, OnInit } from '@angular/core';
  import {PredictiveModel} from "../models/predictivemodels.model";
  import {PredictiveModelService} from "../services/predictive-model.service";
  import {FormBuilder} from "@angular/forms";
  import {ActivatedRoute, Router} from "@angular/router";
  import {catchError, throwError} from "rxjs";
  import {FeaturesService} from "../services/features.service";
  import {Features} from "../models/features.model";
  import {Scopes} from "../models/scopes.model";
  import {ScopesService} from "../services/scopes.service";
  import {Canals} from "../models/canals.model";
  import {Frequences} from "../models/frequences.model";
  import {CanalsService} from "../services/canals.service";
  import {FrequenceService} from "../services/frequence.service";
  import {SecurityService} from "../services/security.service";

  @Component({
    selector: 'app-details-model',
    templateUrl: './details-model.component.html',
    styleUrls: ['./details-model.component.css']
  })
  export class DetailsModelComponent implements OnInit {

    predictiveModel!: PredictiveModel;
    // listOfFeatures: Array<Array<Features>> = [];
    listOfScopes: Array<Array<Scopes>> = [];
    listOfCanals: Array<Array<Canals>> = [];
    listOfFrequency: Array<Array<Frequences>> = [];
    errorMessage! : string;
    formattedRemarks: string[] = []; // Array to store formatted remarks
    formattedNextSteps: string[] = []; // Array to store formatted next Steps


    // Pagination properties
    page: number = 0; // Current page
    pageSize: number = 5; // Items per page
    totalItems: number = 0; // Total number of items
    featuresByPages: Features[] = []; // Array to hold the current page of features



      constructor(
        private predictiveModelService : PredictiveModelService,
        public securityService : SecurityService,
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
          this.handleGetScopesByPredictiveModelID(predictiveModelId);
          this.handleGetCanalsByPredictiveModelID(predictiveModelId);
          this.handleGetFrequencyByPredictiveModelID(predictiveModelId);
          // the loadFeaturesPage below is for handling the features by pagination
          this.loadFeaturesPage(this.page, this.pageSize,predictiveModelId);

        });
      }
//-------------------------------------------------------------------------------------------------------

    // this method help to format remarks PM
    formatRemarksAndNextSteps(): void {
      if (this.predictiveModel && this.predictiveModel.remarksPM && this.predictiveModel.nextStepsPM) {
        // Split the remarks & nextSteps based on the minus (-) character and format them
        this.formattedRemarks = this.predictiveModel.remarksPM.split('-').map(remark => remark.trim());
        this.formattedNextSteps = this.predictiveModel.nextStepsPM.split('-').map(nextStep => nextStep.trim());
      }
    }
//-------------------------------------------------------------------------------------------------------

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
//-------------------------------------------------------------------------------------------------------

/*      handleGetFeaturesByPredictiveModelID(predictiveModelId: number): void {
        this.featureService.getFeaturesByPredictiveModelById(predictiveModelId).pipe(
          catchError(err => {
            this.errorMessage = err.message;
            return throwError(err);
          })
        ).subscribe((featuresArray: Array<Features>) => {
          this.listOfFeatures.push(featuresArray);
          console.log("this.listOfFeatures", this.listOfFeatures);
        });
      }*/

//-------------------------------------------------------------------------------------------------------

    handleGetFeaturesByPredictiveModelID(predictiveModelId: number, page: number, size: number): void {
      this.featureService.getAllFeaturesByPagesByID(page, size, predictiveModelId).pipe(
        catchError(err => {
          this.errorMessage = err.message;
          return throwError(err);
        })
      ).subscribe(
        (page) => {
          console.log('Received page object:', page);
          this.featuresByPages = page.content; // Assign the page.content directly
          this.totalItems = page.totalElements; // Set the total count of features
        },
        (error) => {
          console.error('Error fetching features:', error);
          this.errorMessage = error.message;
        }
      );

    }

//-------------------------------------------------------------------------------------------------------


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
//-------------------------------------------------------------------------------------------------------

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
//-------------------------------------------------------------------------------------------------------

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

      // this methode help you to show Date value correctly from the backend
    convertTimestampToDate(timestamp: string | undefined): Date | undefined {
      return timestamp ? new Date(timestamp) : undefined;
    }

//-------------------------------------------------------------------------------------------------------

      // Pagination event handler
      loadFeaturesPage(page: number, size: number,id: number) {
        this.page = page;
        this.pageSize = size;
        this.handleGetFeaturesByPredictiveModelID(id, page, size);
      }

//-------------------------------------------------------------------------------------------------------

  }
