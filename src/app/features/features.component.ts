import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {FeaturesService} from "../services/features.service";
import {Features} from "../models/features.model";
import {catchError, Observable, of, tap, throwError} from "rxjs";
import {PredictiveModel} from "../models/predictivemodels.model";
import {PredictiveModelService} from "../services/predictive-model.service";
import {Router} from "@angular/router";
import {SecurityService} from "../services/security.service";
import {PageEvent} from '@angular/material/paginator';
import Swal from "sweetalert2";

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

  // Pagination of ALL the features properties
  page : number = 1; // Current page
  pageSize : number = 5; // Items per page
  totalItems : number = 0; // Total number of items
  featuresByPages: Features[] = [];

  // Pagination Bis of Selected feature By PM properties
  pageBis : number = 1; // Current page
  pageSizeBis : number = 5; // Items per page
  totalItemsBis : number = 0; // Total number of items
  featuresByPagesBis: Features[] = [];


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
    this.page = 0;
    this.pageSize = 5;
    this.handleGetAllFeatures();
  }

//-------------------------------------------------------------------------------------------------------

    onPredictiveModelSelect(event: any) {
      const selectedValue = event.target.value;
      this.selectedPredictiveModelId = parseInt(selectedValue);
      console.log('Selected PM ID:', this.selectedPredictiveModelId);
      this.loadFeaturesPage(this.pageBis, this.pageSizeBis,this.selectedPredictiveModelId);
    }

  //-------------------------------------------------------------------------------------------------------

    // Pagination event handler
    loadFeaturesPage(page: number, size: number,id: number) {
      this.pageBis = page;
      this.pageSizeBis = size;
      this.handleGetFeaturesByPredictiveModelID(id, page, size);
    }

//-------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------

      // Pagination of All features event handler
      onPageChange(event: PageEvent) {
        this.page = event.pageIndex; // PageIndex is zero-based for that we initialize page = 1
        this.pageSize = event.pageSize;
        this.handleGetAllFeatures();
      }

//-------------------------------------------------------------------------------------------------------

    handleGetAllFeatures() {
      this.featureService.getAllFeaturesByPages(this.page, this.pageSize).subscribe(
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

  handleGetFeaturesByPredictiveModelID(predictiveModelId: number, page: number, size: number): void {
    this.featureService.getAllFeaturesByPagesByID(page, size, predictiveModelId).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    ).subscribe(
      (page) => {
        console.log('Received page object:', page);
        this.featuresByPagesBis = page.content; // Assign the page.content directly
        this.totalItemsBis = page.totalElements; // Set the total count of features
      },
      (error) => {
        console.error('Error fetching features:', error);
        this.errorMessage = error.message;
      }
    );

  }

//-------------------------------------------------------------------------------------------------------

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
    handleNewFeature() {
      if (this.newFeatureFormGroup.valid) {
        const newFeature: Features = this.newFeatureFormGroup.value;

        // Check if the feature name already exists
        this.handleCheckFeatures(newFeature.namefeature).subscribe({
          next: (existingFeatures) => {
            if (existingFeatures.length > 0) {
              Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Feature du même nom existe déjà. Veuillez choisir un autre nom..',
                showConfirmButton: true,
                confirmButtonColor: '#cb3533',
                timer: 2000
              });
            } else {
              // Add the new feature since the name is unique
              this.featureService.addNewFeature(newFeature).pipe(
                tap(() => {
                  this.newFeatureFormGroup.reset();
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Feature enregistré avec succès!',
                    showConfirmButton: true,
                    confirmButtonColor: '#cb3533',
                    timer: 3000
                  });
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
      }
    }
  //-------------------------------------------------------------------------------------------------------

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
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Votre Feature Mis à jour avec succès!',
          showConfirmButton: true,
          confirmButtonColor: '#cb3533',
          timer: 3000
        });
        this.featureService.updateFeature(this.selectedFeatureToUpdate.id, updatedFeature).subscribe({
            next: () => {
              this.handleGetAllFeatures();
            },
            error: (err) => {
              this.errorMessage = err;
            }
          });
      } else {
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: 'Veuillez remplir les champs «Feature name» et «Description Feature».',
          showConfirmButton: true,
          confirmButtonColor: '#cb3533',
          timer: 3000
        });
      }
    }

//-------------------------------------------------------------------------------------------------------

  handleDeleteFeature(feature: Features) {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer?",
      text: "Vous ne pourrez pas récupérer ce Feature !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Oui, Supprimer!',
      confirmButtonColor: '#cb3533',
      cancelButtonText: 'No, Annuler',
      cancelButtonColor: 'rgba(16,16,15,0.47)',

    }).then((result) => {
      if (result.isConfirmed) {
        // Specify the response type as text
        this.featureService.deleteFeature(feature.id, { responseType: 'text' }).subscribe({
          next: (response) => {
            console.log('Feature deleted successfully');
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Suppression!',
              html: response,
              showConfirmButton: true,
              confirmButtonColor: '#cb3533',
              timer: 3000
            }).then(() => {
              console.log('Success message displayed');
              this.handleGetAllFeatures();
            });
          },
          error: (err) => {
            console.error('Error deleting feature:', err);
            this.errorMessage = err;
          }
        });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Annulation Suppression!',
          html: 'Votre Feature  est en sécurité :)',
          showConfirmButton: true,
          confirmButtonColor: '#cb3533',
          timer: 3000
        });
      }
    });
  }



  //-------------------------------------------------------------------------------------------------------

    // this methode help you to show Date value correctly from the backend
    convertTimestampToDate(timestamp: string): Date {
      return new Date(timestamp); // Assuming 'timestamp' is in milliseconds
    }

  //-------------------------------------------------------------------------------------------------------

    getErrorMessage(fieldName: string, error: ValidationErrors) {
      if (error['required']){
        return fieldName + " is Required";
      } else if (error['minLength']){
        return fieldName + " should have at least "+ error['minLength']['requiredLength'] + " Characters";
      } else return "";
    }

  //-------------------------------------------------------------------------------------------------------


}
