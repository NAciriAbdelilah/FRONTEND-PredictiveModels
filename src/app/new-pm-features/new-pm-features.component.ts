import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {FeaturesService} from "../services/features.service";
import {PredictiveModelService} from "../services/predictive-model.service";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {map, Observable, of} from "rxjs";
import {Features} from "../model/features.model";
import {PredictiveModel} from "../model/predictivemodels.model";

@Component({
  selector: 'app-new-pm-features',
  templateUrl: './new-pm-features.component.html',
  styleUrls: ['./new-pm-features.component.css']
})
export class NewPmFeaturesComponent implements OnInit {

  searchFormGroup! : FormGroup;
  features!: Observable<Array<Features>>;
  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  selectedPredictiveModelId: number | null = null;
  savePMFeaturesFormGroup!: FormGroup;
  allFeatures!: Observable<Array<Features>>; // For the first table
  selectedFeatures: Array<Features> = []; // For the second table

  constructor( private predictiveModelService : PredictiveModelService,
               private featureService : FeaturesService,
               private fb : FormBuilder,
               public authService : AuthenticationService,
               private router : Router) { }

  ngOnInit(): void {

    this.handleLoadFeatures();
    this.handleLoadPredictiveModels()

    this.searchFormGroup= this.fb.group({
      keyword : this.fb.control(null)
    });

    this.savePMFeaturesFormGroup = this.fb.group({
      predictiveModelId: ['', Validators.required],
      features: this.fb.array([]), // Initialize as an empty form array
    });

  }

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
  }

  copyFeatureToSelected(feature: Features) {
    // Get the form array
    const featuresFormArray = this.savePMFeaturesFormGroup.get('features') as FormArray;

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
    const featuresFormArray = this.savePMFeaturesFormGroup.get('features') as FormArray;

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



  handleSavePredictiveModelFeatures() {

    if (this.selectedPredictiveModelId === null) {
      // Display an error message to the user or handle it in your UI as needed
      alert("Please select a Predictive Model before saving features.");
      return;
    }
      // Get the features form array
      const featuresFormArray = this.savePMFeaturesFormGroup.get('features') as FormArray;

      // Get the array of selected features
      let featuresIds = featuresFormArray.value.map((f: any) => f.id);

      let SavedObject= {
        predictiveModelId:this.selectedPredictiveModelId,
        featuresIds:featuresIds,
      }

      this.predictiveModelService.SaveNewPredictiveModelFeatures(SavedObject).subscribe({
        next : data =>{
          alert("Features saved successfully!");
          console.log(JSON.stringify(SavedObject));
          this.savePMFeaturesFormGroup.reset();
          this.router.navigateByUrl("/admin/predictive-models")

        },
        error: err => {
          console.log(this.selectedPredictiveModelId)
          console.error('Error saving Predictive Models Features', err);
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