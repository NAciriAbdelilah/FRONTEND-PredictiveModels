import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {map, Observable} from "rxjs";
import {Features} from "../models/features.model";
import {PredictiveModel} from "../models/predictivemodels.model";
import {PredictiveModelService} from "../services/predictive-model.service";
import {FeaturesService} from "../services/features.service";
import {Router} from "@angular/router";
import {SecurityService} from "../services/security.service";
import Swal from "sweetalert2";
import {PageEvent} from "@angular/material/paginator";


@Component({
  selector: 'app-update-pm-features',
  templateUrl: './update-pm-features.component.html',
  styleUrls: ['./update-pm-features.component.css']
})
export class UpdatePmFeaturesComponent implements OnInit {


  searchFormGroup! : FormGroup;
  errorMessage! : string;
  features!: Observable<Array<Features>>;
  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  selectedPredictiveModelId: number | null = null;
  updatePMFeaturesFormGroup!: FormGroup;
  selectedFeatures: Array<Features> = []; // For the second table
  featuresIds: number[] = []; // For updating the old features of a PM in the second table

  // Pagination of ALL the features properties
  page : number = 0; // Current page
  pageSize : number = 10; // Items per page
  totalItems : number = 0; // Total number of items
  featuresByPages: Features[] = [];

  constructor( private predictiveModelService : PredictiveModelService,
               private featureService : FeaturesService,
               private fb : FormBuilder,
               public securityService : SecurityService,
               private router : Router) { }

  ngOnInit(): void {

    this.handleGetAllFeatures();
    this.handleLoadPredictiveModels()

    this.searchFormGroup= this.fb.group({
      keyword : this.fb.control(null)
    });

    this.updatePMFeaturesFormGroup = this.fb.group({
      predictiveModelId: ['', Validators.required],
      features: this.fb.array([]), // Initialize as an empty form array
    });

  }


  //-------------------------------------------------------------------------------------------------------

      // Pagination of All features event handler
      onPageChange(event: PageEvent) {
        this.page = event.pageIndex; // PageIndex is zero-based for that we initialize page = 1
        this.pageSize = event.pageSize;
        this.handleGetAllFeatures();
      }

  //-------------------------------------------------------------------------------------------------------

  //---------------------------------------- Fetch Features Data --------------------------------------------------------

  fetchFilteredFeatureByIDData() {
    if (this.selectedPredictiveModelId !== null) {
      this.featureService.getFeaturesByPredictiveModelById(this.selectedPredictiveModelId).subscribe(
        (filteredFeature) => {
          this.selectedFeatures = filteredFeature;
          console.log("Filtered features :", this.selectedFeatures);
        },
        (error) => {
          console.error("Error fetching filtered features:", error);
        }
      );
    }
  }

//----------------------------------------------------------------------------------------------------------------------

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

  handleLoadPredictiveModels(){
    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels()
  }

  handleSearchFeatures() {

    const keyword = this.searchFormGroup?.value.keyword;
    if (keyword) {
      this.featureService.searchByNameOrDescription(keyword, this.page, this.pageSize).subscribe(
        (page) => {
          console.log('Received page object:', page);
          this.featuresByPages = page.content; // Assign the page.content directly
          this.totalItems = page.totalElements; // Set the total count of features
        },
        (error) => {
          // Handle the error here, e.g., show an error message to the user or log it
          console.error('Error:', error);
          this.errorMessage = 'An error occurred while fetching data.';
        }
      );
    } else {
      // If the keyword is empty, show all features
      this.handleGetAllFeatures();
    }

  }

  onPredictiveModelSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedPredictiveModelId = parseInt(selectedValue);
    console.log('Selected PM ID:', this.selectedPredictiveModelId);

    this.fetchFilteredFeatureByIDData();
  }

//-------------------------------------------------------------------------------------------------------

  copyFeatureToSelected(feature: Features) {
    // Get the form array
    const featuresFormArray = this.updatePMFeaturesFormGroup.get('features') as FormArray;

    // Push the selected feature to the form array
    featuresFormArray.push(this.fb.control(feature));

    // Log the state of selectedFeatures before and after modification
    console.log('Before selectedFeatures:', this.selectedFeatures);

    // Push the feature to selectedFeatures array
    this.selectedFeatures.push(feature);

    console.log('After selectedFeatures:', this.selectedFeatures);


  }

//-------------------------------------------------------------------------------------------------------

  removeSelectedFeature(feature: Features) {
    // Get the form array
    const featuresFormArray = this.updatePMFeaturesFormGroup.get('features') as FormArray;

    // Find the index of the feature to remove
    const index = featuresFormArray.controls.findIndex(formGroup => formGroup.value.id === feature.id);

    if (index !== -1) {
      // Remove the selected feature from the form array
      featuresFormArray.removeAt(index);
    }

    // Add the removed feature back to the first table
    this.featuresByPages.push(feature); // Assuming this is an array

    // Update the selectedFeatures array
    this.selectedFeatures = this.selectedFeatures.filter(f => f.id !== feature.id);

  }

//-------------------------------------------------------------------------------------------------------

  handleUpdatePredictiveModelFeatures() {

    if (this.selectedPredictiveModelId === null) {
      // Display an error message to the user or handle it in your UI as needed
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Veuillez sélectionner un Modèle Prédictif avant de mettre à jour ses Features!',
        showConfirmButton: true,
        confirmButtonColor: '#cb3533',
        timer: 3000
      });
      return;
    }

    // Get the array of selected features
    if (Array.isArray(this.updatePMFeaturesFormGroup.value.features)) {
      this.featuresIds = this.updatePMFeaturesFormGroup.value.features.map((feature: any) => feature.id);
    }

    // If there are existing features, add them to the featuresIds array
    if (this.selectedFeatures.length > 0) {
      this.featuresIds.push(...this.selectedFeatures.map((feature: any) => feature.id));
    }

    let updatedObject= {
      predictiveModelId: this.selectedPredictiveModelId,
      featuresIds: this.featuresIds,
    }

//-------------------------------------------------------------------------------------------------------

    this.predictiveModelService.updatePredictiveModelFeatures(this.selectedPredictiveModelId,updatedObject).subscribe({
      next : data =>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Features du Modéle Prédictif mises à jour avec succès!',
          showConfirmButton: true,
          confirmButtonColor: '#cb3533',
          timer: 3000
        });
        console.log(JSON.stringify(updatedObject));
        this.updatePMFeaturesFormGroup.reset();
        this.router.navigateByUrl("/admin/features")
      },
      error: err => {
        console.log(this.selectedPredictiveModelId)
        console.error('Error updating Predictive Models Features', err);
      }
    })
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
