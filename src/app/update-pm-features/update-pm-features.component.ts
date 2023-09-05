import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {map, Observable} from "rxjs";
import {Features} from "../model/features.model";
import {PredictiveModel} from "../model/predictivemodels.model";
import {PredictiveModelService} from "../services/predictive-model.service";
import {FeaturesService} from "../services/features.service";
import {Router} from "@angular/router";
import {SecurityService} from "../services/security.service";


@Component({
  selector: 'app-update-pm-features',
  templateUrl: './update-pm-features.component.html',
  styleUrls: ['./update-pm-features.component.css']
})
export class UpdatePmFeaturesComponent implements OnInit {


  searchFormGroup! : FormGroup;
  features!: Observable<Array<Features>>;
  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  selectedPredictiveModelId: number | null = null;
  updatePMFeaturesFormGroup!: FormGroup;
  allFeatures!: Observable<Array<Features>>; // For the first table
  selectedFeatures: Array<Features> = []; // For the second table
  featuresIds: number[] = []; // For updating the old features of a PM in the second table

  constructor( private predictiveModelService : PredictiveModelService,
               private featureService : FeaturesService,
               private fb : FormBuilder,
               public securityService : SecurityService,
               private router : Router) { }

  ngOnInit(): void {

    this.handleLoadFeatures();
    this.handleLoadPredictiveModels()

    this.searchFormGroup= this.fb.group({
      keyword : this.fb.control(null)
    });

    this.updatePMFeaturesFormGroup = this.fb.group({
      predictiveModelId: ['', Validators.required],
      features: this.fb.array([]), // Initialize as an empty form array
    });

  }

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

  handleLoadFeatures() {
    this.allFeatures = this.featureService.getAllFeatures();
  }

  handleLoadPredictiveModels(){
    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels()
  }

  handleSearchFeatures() {
    const keyword = this.searchFormGroup?.value.keyword;
    this.allFeatures = this.featureService.searchFeatures(keyword);
  }

  onPredictiveModelSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedPredictiveModelId = parseInt(selectedValue);
    console.log('Selected PM ID:', this.selectedPredictiveModelId);

    this.fetchFilteredFeatureByIDData();
  }

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

    // Remove the selected feature from the first table
    this.allFeatures = this.allFeatures.pipe(
      map(features => features.filter(f => f.id !== feature.id))
    );

  }



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
    this.allFeatures = this.allFeatures.pipe(map(features => [...features, feature]));

    // Update the selectedFeatures array
    this.selectedFeatures = this.selectedFeatures.filter(f => f.id !== feature.id);

  }


  handleUpdatePredictiveModelFeatures() {

    if (this.selectedPredictiveModelId === null) {
      // Display an error message to the user or handle it in your UI as needed
      alert("Please select a Predictive Model before updating features.");
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

    this.predictiveModelService.updatePredictiveModelFeatures(this.selectedPredictiveModelId,updatedObject).subscribe({
      next : data =>{
        alert("Features updated successfully!");
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

  getErrorMessage(fieldName: string, error: ValidationErrors) {
    if (error['required']){
      return fieldName + " is Required";
    } else if (error['minLength']){
      return fieldName + " should have at least "+ error['minLength']['requiredLength'] + " Characters";
    } else return "";

  }


}
