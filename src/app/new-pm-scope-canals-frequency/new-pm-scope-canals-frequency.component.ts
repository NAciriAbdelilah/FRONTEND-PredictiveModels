import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {Scopes} from "../models/scopes.model";
import {Canals} from "../models/canals.model";
import {Frequences} from "../models/frequences.model";
import {PredictiveModelService} from "../services/predictive-model.service";
import {ScopesService} from "../services/scopes.service";
import {CanalsService} from "../services/canals.service";
import {FrequenceService} from "../services/frequence.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PredictiveModel} from "../models/predictivemodels.model";

@Component({
  selector: 'app-new-pm-scope-canals-frequency',
  templateUrl: './new-pm-scope-canals-frequency.component.html',
  styleUrls: ['./new-pm-scope-canals-frequency.component.css']
})
export class NewPmScopeCanalsFrequencyComponent implements OnInit {

  errorMessage! : string;
  savePMScopeCanalFrequencyFormGroup!: FormGroup;
  selectedPredictiveModelId: number | null = null;

  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  listOfScopes!: Observable<Scopes[]>;
  listOfCanals!: Observable<Canals[]>;
  listOfFrequency!: Observable<Frequences[]>;

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

  fetchPredictiveModelData() {
    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels();
  }

  fetchScopeData() {
    this.listOfScopes = this.scopesService.getAllScopes();
  }

  fetchCanalData() {
    this.listOfCanals = this.canalsService.getAllCanals();
  }

  fetchFrequencyData() {
    this.listOfFrequency = this.frequenceService.getAllFrequence();
  }



  ngOnInit(): void {
    this.fetchPredictiveModelData();
    this.fetchScopeData();
    this.fetchCanalData();
    this.fetchFrequencyData();

    this.savePMScopeCanalFrequencyFormGroup = this.fb.group({
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
      scopeOnItemSelect($event : any) {
        console.log('$event scope is : ', $event);
        let dataScope = $event.scope
      }
      frequencyOnItemSelect($event : any) {
        console.log('$event freq is : ', $event);
      }
      canalOnItemSelect($event : any) {
        console.log('$event canal is : ', $event);
      }


      handleSavePredictiveModelScopesCanalsFrequencies() {
        if (this.selectedPredictiveModelId === null) {
          // Display an error message to the user or handle it in your UI as needed
          alert("Please select a Predictive Model before saving !");
          return;
        }

        let scopeIds = this.savePMScopeCanalFrequencyFormGroup.value.scopes.map((scope: any) => scope.id);

        let canalIds = this.savePMScopeCanalFrequencyFormGroup.value.canals.map((canal: any) => canal.id);

        let frequenceIds = this.savePMScopeCanalFrequencyFormGroup.value.frequency.map((frequency: any) => frequency.id);

        let SavedObject= {
          predictiveModelId:this.selectedPredictiveModelId,
          scopeIds:scopeIds,
          canalIds:canalIds,
          frequenceIds:frequenceIds,
        }

        this.predictiveModelService.SaveNewPredictiveModelScopeCanalFrequency(SavedObject).subscribe({
          next : data =>{
            alert("Scopes & Canals & Frequencies saved successfully!\n" +
              "Now pass to Step3 to Add Features");
            console.log(JSON.stringify(SavedObject));
            this.savePMScopeCanalFrequencyFormGroup.reset();
            this.router.navigateByUrl("/admin/new-pm-features")

          },
          error: err => {
            console.log(this.selectedPredictiveModelId)
            console.error('Error saving Predictive Models Scopes, Canals, and Frequencies:', err);
          }

        })
      }


      onPredictiveModelSelect(event: any) {
        const selectedValue = event.target.value;
        this.selectedPredictiveModelId = parseInt(selectedValue);
        console.log('Selected ID:', this.selectedPredictiveModelId);
      }


      getErrorMessage(fieldName: string, error: ValidationErrors) {
        if (error['required']){
          return fieldName + " is Required";
        } else if (error['minLength']){
          return fieldName + " should have at least "+ error['minLength']['requiredLength'] + " Characters";
        } else return "";

      }











}
