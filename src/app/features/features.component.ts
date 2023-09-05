import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {FeaturesService} from "../services/features.service";
import {Features} from "../model/features.model";
import {catchError, Observable, of, tap, throwError} from "rxjs";
import {PredictiveModel} from "../model/predictivemodels.model";
import {PredictiveModelService} from "../services/predictive-model.service";
import {Router} from "@angular/router";
import {SecurityService} from "../services/security.service";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  searchFormGroup! : FormGroup;
  errorMessage! : string;
  features!: Observable<Array<Features>>; // Variable pour stocker la liste complète de toutes les features
  filteredFeatures!: Observable<Array<Features>>; // Variable pour stocker que les features filtrées par Nom du modèle
  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  selectedPredictiveModelId: number | null = null;
  newFeatureFormGroup! : FormGroup;
  updateFeatureFormGroup!: FormGroup;
  selectedFeatureToUpdate: Features | undefined;



  constructor( private predictiveModelService : PredictiveModelService,
               private featureService : FeaturesService,
               private fb : FormBuilder,
               public securityService : SecurityService,
               private router : Router) { }

  ngOnInit(): void {

    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels();

    this.searchFormGroup= this.fb.group({
      keyword : this.fb.control(null)
    });

    this.newFeatureFormGroup = this.fb.group({
      namefeature: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.updateFeatureFormGroup = this.fb.group({
      namefeature: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.handleGetAllFeatures();
  }

//-------------------------------------------------------------------------------------------------------

      onPredictiveModelSelect(event: any) {
        const selectedValue = event.target.value;
        this.selectedPredictiveModelId = parseInt(selectedValue);
        console.log('Selected PM ID:', this.selectedPredictiveModelId);

        this.handleSearchFeaturesByPredictiveModelName();
      }
//-------------------------------------------------------------------------------------------------------

    handleGetAllFeatures() {
      this.featureService.getAllFeatures().subscribe(
        features => {
          console.log("Received updated features:", features);
          this.features = of(features);
        },
        error => {
          console.error("Error fetching features:", error);
          this.errorMessage = error.message;
        }
      );
    }
//-------------------------------------------------------------------------------------------------------

    handleSearchFeatures() {
      const keyword = this.searchFormGroup?.value.keyword;
      if (keyword) {
        this.features = this.featureService.searchByNameOrDescription(keyword).pipe(
          catchError((err) => {
            this.errorMessage = err;
            return throwError(err);
          })
        );
      } else {
        // If the keyword is empty, show all features
        this.handleGetAllFeatures();
      }
    }

//-------------------------------------------------------------------------------------------------------

    handleSearchFeaturesByPredictiveModelName() {
      if (this.selectedPredictiveModelId) {
        this.filteredFeatures = this.featureService.getFeaturesByPredictiveModelById(this.selectedPredictiveModelId).pipe(
          catchError(err => {
            this.errorMessage = err;
            return throwError(err);
          })
        );
      }
    }

//-------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------
    handleNewFeature() {
      if (this.newFeatureFormGroup.valid) {
        const newFeature: Features = this.newFeatureFormGroup.value;

        // Check if the feature name already exists
        this.handleCheckFeatures(newFeature.namefeature).subscribe({
          next: (existingFeatures) => {
            if (existingFeatures.length > 0) {
              alert("A feature with the same name already exists. Please choose a different name.");
            } else {
              // Add the new feature since the name is unique
              this.featureService.addNewFeature(newFeature).pipe(
                tap(() => {
                  this.newFeatureFormGroup.reset();
                  alert("Feature saved successfully!");
                })
              ).subscribe({
                next: () => {
                  this.handleGetAllFeatures(); // Fetch the updated features list after adding a new feature
                },
                error: (err) => {
                  console.log(err);
                }
              });
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      } else {
        alert("Please fill out both the 'Feature name' and 'Description Feature' fields.");
      }
    }

// Function to check if a feature with the same name already exists in the database
    handleCheckFeatures(keyword: string): Observable<Array<Features>> {
      return this.featureService.searchFeatures(keyword).pipe(
        catchError(err => {
          this.errorMessage = err;
          return throwError(err);
        })
      );
    }

//-------------------------------------------------------------------------------------------------------

  // Function to open the update modal and pre-fill the form with existing feature details
    handleOpenUpdateModal(feature: Features) {
      this.selectedFeatureToUpdate = feature;
      this.updateFeatureFormGroup.patchValue({
        namefeature: feature.namefeature,
        description: feature.description,
      });
    }

  // Function to update feature
    handleUpdateFeature() {
      if (this.updateFeatureFormGroup.valid && this.selectedFeatureToUpdate) {
        const updatedFeature: Features = {
          ...this.selectedFeatureToUpdate,
          ...this.updateFeatureFormGroup.value,
        };

        this.featureService.updateFeature(this.selectedFeatureToUpdate.id, updatedFeature).subscribe({
            next: () => {
              this.handleGetAllFeatures();
            },
            error: (err) => {
              this.errorMessage = err;
            }
          });
      } else {
        alert("Please fill out both the 'Feature name' and 'Description Feature' fields.");
      }
    }

//-------------------------------------------------------------------------------------------------------

    handleDeleteFeature(feature: Features) {
      let conf = confirm("Are you sure to Delete ?");
      if (!conf) return;

      this.featureService.deleteFeature(feature.id).subscribe({
        next: () => {
          // Update the table list after the feature is deleted
          this.handleGetAllFeatures();
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }

  //-------------------------------------------------------------------------------------------------------

    // this methode help you to show Date value correctly from the backend
    convertTimestampToDate(timestamp: string): Date {
      const timestampInMillis = parseInt(timestamp) * 1000;
      return new Date(timestampInMillis);
    }

  //-------------------------------------------------------------------------------------------------------

    getErrorMessage(fieldName: string, error: ValidationErrors) {
      if (error['required']){
        return fieldName + " is Required";
      } else if (error['minLength']){
        return fieldName + " should have at least "+ error['minLength']['requiredLength'] + " Characters";
      } else return "";
    }


}
