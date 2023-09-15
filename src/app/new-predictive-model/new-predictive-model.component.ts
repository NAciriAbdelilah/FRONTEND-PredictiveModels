import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {PredictiveModelService} from "../services/predictive-model.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PredictiveModel} from "../models/predictivemodels.model";
import {ScopesService} from "../services/scopes.service";
import {CanalsService} from "../services/canals.service";
import {FrequenceService} from "../services/frequence.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-new-predictive-model',
  templateUrl: './new-predictive-model.component.html',
  styleUrls: ['./new-predictive-model.component.css']
})
export class NewPredictiveModelComponent implements OnInit {

  errorMessage! : string;
  newPredictiveModelsFormGroup! : FormGroup;
  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  isEnPilote: boolean = false;


  constructor( private fb : FormBuilder,
               private predictiveModelService : PredictiveModelService,
               private scopesService : ScopesService,
               private canalsService : CanalsService,
               private frequenceService : FrequenceService,
               private router : Router,
               private route: ActivatedRoute) { }


  ngOnInit(): void {

    this.newPredictiveModelsFormGroup = this.fb.group({
      namePM: ['', Validators.required],
      objectivePM: ['', Validators.required],
      definitionPM: ['', Validators.required],
      versionPM: ['', Validators.required],
      statusPM: [false, Validators.required],
      remarksPM: ['', Validators.required],
      nextStepsPM: ['', Validators.required],
    });
    // S'abonner aux changements de valeur du champ statusPM
    this.newPredictiveModelsFormGroup.controls['statusPM'].valueChanges.subscribe(
      (isChecked) => {
      this.isEnPilote = isChecked;
    });

  }

  handleAddPredictiveModel() {
    // to show the data in the console from the form
    console.log(this.newPredictiveModelsFormGroup.value);

    if (this.newPredictiveModelsFormGroup.valid) {
      let newPM: PredictiveModel = this.newPredictiveModelsFormGroup.value;
      this.predictiveModelService.addNewPredictiveModel(newPM).subscribe({
        next: data => {
          Swal.fire({
            position: 'center',
            title: "Modéle Prédictif enregistré avec succès.",
            text: "Passez maintenant à l'étape 2 pour ajouter les Marchés, Canaux et Fréquences!",
            icon: 'success',
            showConfirmButton: true,
            confirmButtonColor: '#cb3533',
            //timer: 3000
          });
          this.newPredictiveModelsFormGroup.reset();
          this.router.navigateByUrl("/admin/new-pm-scope-canals-frequency");
        },
        error: err => {
          console.error('Error saving Predictive Model', err);
        }
      });
    }
  }

  getErrorMessage(fieldName: string, error: ValidationErrors) {
    if (error['required']){
      return fieldName + " is Required";
    } else if (error['minLength']){
      return fieldName + " should have at least "+ error['minLength']['requiredLength'] + " Characters";
    } else return "";

  }
}
