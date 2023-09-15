import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {PredictiveModel} from "../models/predictivemodels.model";
import {Scopes} from "../models/scopes.model";
import {Canals} from "../models/canals.model";
import {Frequences} from "../models/frequences.model";
import {PredictiveModelService} from "../services/predictive-model.service";
import {ScopesService} from "../services/scopes.service";
import {CanalsService} from "../services/canals.service";
import {FrequenceService} from "../services/frequence.service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-update-pm-scope-canals-frequency',
  templateUrl: './update-pm-scope-canals-frequency.component.html',
  styleUrls: ['./update-pm-scope-canals-frequency.component.css']
})
export class UpdatePmScopeCanalsFrequencyComponent implements OnInit {

  errorMessage! : string;
  updatePMScopeCanalFrequencyFormGroup!: FormGroup;
  selectedPredictiveModelId: number | null = null;

  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  listOfScopes!: Observable<Scopes[]>;
  listOfCanals!: Observable<Canals[]>;
  listOfFrequency!: Observable<Frequences[]>;

  filteredListOfScopes!: Array<Scopes>;
  filteredListOfCanals!: Array<Canals>;
  filteredListOfFrequences!: Array<Frequences>;



  scopeDropdownList!: any[];
  scopeDropdownSettings = {};

  canalDropdownList!: any[];
  canalDropdownSettings = {};

  frequencyDropdownList!: any[];
  frequencyDropdownSettings = {};



  constructor( private fb : FormBuilder,
               private predictiveModelService : PredictiveModelService,
               private scopesService : ScopesService,
               private canalsService : CanalsService,
               private frequenceService : FrequenceService,
               private router : Router,
               private route: ActivatedRoute) { }


 //------------------------------------- Fetch Predictive Model Data ---------------------------------------------------

  fetchPredictiveModelData() {
    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels();
  }

//---------------------------------------- Fetch Scope Data -----------------------------------------------------------

  fetchScopeData() {
    this.listOfScopes = this.scopesService.getAllScopes();
  }

  fetchFilteredScopeByIDData() {
    if (this.selectedPredictiveModelId !== null) {
      this.scopesService.getScopesByPredictiveModelById(this.selectedPredictiveModelId).subscribe(
        (filteredScopes) => {
          this.filteredListOfScopes = filteredScopes;
          console.log("Filtered scopes :", this.filteredListOfScopes);
        },
        (error) => {
          console.error("Error fetching filtered scopes !", error);
        }
      );
    }
  }

//---------------------------------------- Fetch Canal Data -----------------------------------------------------------

  fetchCanalData() {
    this.listOfCanals = this.canalsService.getAllCanals();
  }

  fetchFilteredCanalByIDData() {
    if (this.selectedPredictiveModelId !== null) {
      this.canalsService.getCanalsByPredictiveModelById(this.selectedPredictiveModelId).subscribe(
        (filteredCanals) => {
          this.filteredListOfCanals = filteredCanals;
          console.log("Filtered canals :", this.filteredListOfCanals);
        },
        (error) => {
          console.error("Error fetching filtered canals !", error);
        }
      );
    }
  }

//---------------------------------------- Fetch Frequency Data --------------------------------------------------------

  fetchFrequencyData() {
    this.listOfFrequency = this.frequenceService.getAllFrequence();
  }

  fetchFilteredFrequencyByIDData() {
    if (this.selectedPredictiveModelId !== null) {
      this.frequenceService.getFrequencyByPredictiveModelById(this.selectedPredictiveModelId).subscribe(
        (filteredFrequences) => {
          this.filteredListOfFrequences = filteredFrequences;
          console.log("Filtered frequencies :", this.filteredListOfFrequences);
        },
        (error) => {
          console.error("Error fetching filtered frequencies:", error);
        }
      );
    }
  }

//----------------------------------------------------------------------------------------------------------------------

  ngOnInit(): void {

    this.fetchPredictiveModelData();
    this.fetchScopeData();
    this.fetchCanalData();
    this.fetchFrequencyData();

    this.updatePMScopeCanalFrequencyFormGroup = this.fb.group({
      predictiveModelId: ['', Validators.required],
      scopes: ['', Validators.required],
      canals: ['', Validators.required],
      frequency: ['', Validators.required],
    });


    this.listOfScopes.subscribe(data => {
      this.scopeDropdownList = data;
    });

    this.listOfCanals.subscribe(data => {
      this.canalDropdownList = data;
    });

    this.listOfFrequency.subscribe(data => {
      this.frequencyDropdownList = data;
    });


    // Update the scopeDropdownSettings here
    this.scopeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'intituleScope',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All'
    };

    // Update the canalDropdownSettings here
    this.canalDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'intituleCanal',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All'
    };

    // Update the frequencyDropdownSettings here
    this.frequencyDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'intitulefrequence',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All'
    };

  }

//-------------------------------------------------------------------------------------------------------

  onPredictiveModelSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedPredictiveModelId = parseInt(selectedValue);
    console.log('Selected ID:', this.selectedPredictiveModelId);

    this.fetchFilteredScopeByIDData();
    this.fetchFilteredCanalByIDData();
    this.fetchFilteredFrequencyByIDData();

  }

  scopeOnItemSelect($event : any) {
    console.log('$event scope is : ', $event);
  }
  frequencyOnItemSelect($event : any) {
    console.log('$event freq is : ', $event);
  }
  canalOnItemSelect($event : any) {
    console.log('$event canal is : ', $event);
  }

//-------------------------------------------------------------------------------------------------------

  handleUpdatePredictiveModelScopesCanalsFrequencies() {

    if (this.selectedPredictiveModelId === null) {
      // Display an error message to the user or handle it in your UI as needed
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Veuillez sélectionner un Modèle Prédictif avant de mettre à jour ses Paramétres!',
        showConfirmButton: true,
        confirmButtonColor: '#cb3533',
        timer: 3000
      });
      return;
    }

    let scopeIds = [];
    if (Array.isArray(this.updatePMScopeCanalFrequencyFormGroup.value.scopes)) {
      scopeIds = this.updatePMScopeCanalFrequencyFormGroup.value.scopes.map((scope: any) => scope.id);
    }

    let canalIds = [];
    if (Array.isArray(this.updatePMScopeCanalFrequencyFormGroup.value.canals)) {
      canalIds = this.updatePMScopeCanalFrequencyFormGroup.value.canals.map((canal: any) => canal.id);
    }

    let frequenceIds = [];
    if (Array.isArray(this.updatePMScopeCanalFrequencyFormGroup.value.frequency)) {
      frequenceIds = this.updatePMScopeCanalFrequencyFormGroup.value.frequency.map((frequency: any) => frequency.id);
    }

    let updatedObject= {
      predictiveModelId: this.selectedPredictiveModelId,
      scopeIds: scopeIds,
      canalIds: canalIds,
      frequenceIds: frequenceIds,
    }

    this.predictiveModelService.updatePredictiveModelScopeCanalFrequency(this.selectedPredictiveModelId, updatedObject).subscribe({
      next : data =>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Marchés, Canaux et Frequences mises à jour avec succès!',
          showConfirmButton: true,
          confirmButtonColor: '#cb3533',
          timer: 3000
        });
        console.log(JSON.stringify(updatedObject));
        this.updatePMScopeCanalFrequencyFormGroup.reset();
        this.router.navigateByUrl("/admin/predictive-models")

      },
      error: err => {
        console.log(this.selectedPredictiveModelId)
        console.error('Error Updating Predictive Models Scopes, Canals, and Frequencies:', err);
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
