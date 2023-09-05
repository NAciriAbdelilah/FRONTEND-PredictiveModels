import { Component, OnInit } from '@angular/core';
import {PredictiveModelService} from "../services/predictive-model.service";
import {PredictiveModel} from "../model/predictivemodels.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {catchError, map, Observable, throwError} from "rxjs";
import {SecurityService} from "../services/security.service";


@Component({
  selector: 'app-predictive-models',
  templateUrl: './predictive-models.component.html',
  styleUrls: ['./predictive-models.component.css']
})
export class PredictiveModelsComponent implements OnInit {

  predictiveModel!: Observable<Array<PredictiveModel>>;
  errorMessage! : string;
  searchFormGroup : FormGroup | undefined;

  updatePredictiveModelFormGroup!: FormGroup;
  selectedPredictiveModelToUpdate: PredictiveModel | undefined;
  isEnPilote: boolean = false;


  constructor(private predictiveModelService : PredictiveModelService,
              private fb : FormBuilder,
              public securityService : SecurityService,
              private router : Router) { }

  ngOnInit(): void {

    this.searchFormGroup= this.fb.group({
      keyword : this.fb.control(null)
    });

    this.updatePredictiveModelFormGroup = this.fb.group({
      namePM: ['', Validators.required],
      objectivePM: ['', Validators.required],
      definitionPM: ['', Validators.required],
      versionPM: ['', Validators.required],
      statusPM: [false, Validators.required],
      remarksPM: ['', Validators.required],
      nextStepsPM: ['', Validators.required],
    });
    this.updatePredictiveModelFormGroup.controls['statusPM'].valueChanges.subscribe(
      (isChecked) => {
        this.isEnPilote = isChecked;
      });

      this.handleGetAllPredictiveModels();

  }

    handleGetAllPredictiveModels(){
      this.predictiveModel=this.predictiveModelService.getAllPredictiveModels().pipe(
        catchError(err => {
          this.errorMessage = err.message;
          return  throwError(err)
        })
      )
    }

    handleSearchPredectiveModels() {
      const keyword = this.searchFormGroup?.value.keyword;
      if (keyword) {
        this.predictiveModel = this.predictiveModelService.searchPredictiveModel(keyword).pipe(
          catchError((err) => {
            this.errorMessage = err;
            return throwError(err);
          })
        );
      } else {
        // If the keyword is empty, show all Predictive Models
        this.handleGetAllPredictiveModels();
      }
    }

    handleDeletePredictiveModel(pm: PredictiveModel) {
      let conf = confirm("Are you sure to Delete ?");
      if (!conf) return;

      this.predictiveModelService.deletePredictiveModel(pm.id).subscribe({
        next: () => {
          this.handleGetAllPredictiveModels();
          this.predictiveModel = this.predictiveModel.pipe(
            map(data => data.filter(item => item.id !== pm.id))
          );

        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }


    handleNewPredictiveModel() {
     this.router.navigateByUrl("/admin/new-predictive-model")
    }

    handleDetailsModel(pm: PredictiveModel) {
      this.router.navigateByUrl("/admin/details-model")
    }

    // this methode help you to show Date value correctly from the backend
    convertTimestampToDate(timestamp: string): Date {
      const timestampInMillis = parseInt(timestamp) * 1000;
      return new Date(timestampInMillis);
    }

  // Function to open the update modal and pre-fill the form with existing PM
  handleOpenUpdateModal(pm: PredictiveModel) {
    this.selectedPredictiveModelToUpdate = pm;
    this.updatePredictiveModelFormGroup.patchValue({
      namePM: pm.namePM,
      objectivePM: pm.objectivePM,
      definitionPM: pm.definitionPM,
      versionPM: pm.versionPM,
      statusPM: pm.statusPM,
      remarksPM: pm.remarksPM,
      nextStepsPM: pm.nextStepsPM,
    });
  }

  handleUpdatePredictiveModel() {
    if (this.updatePredictiveModelFormGroup.valid && this.selectedPredictiveModelToUpdate) {
      const updatedPM: PredictiveModel = {
        ...this.selectedPredictiveModelToUpdate,
        ...this.updatePredictiveModelFormGroup.value,
      };
      console.log(updatedPM)
      this.predictiveModelService.updatePredictiveModel(this.selectedPredictiveModelToUpdate.id, updatedPM).subscribe({
        next: () => {
          this.handleGetAllPredictiveModels();
          alert("The Predictive Model changes saved successfully.");
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    } else {
      alert("Please fill out both the fields before saving changes.");
    }
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
