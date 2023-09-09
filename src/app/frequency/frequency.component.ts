import { Component, OnInit } from '@angular/core';
import {catchError, Observable, of, tap, throwError} from "rxjs";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Frequences} from "../models/frequences.model";
import {FrequenceService} from "../services/frequence.service";
import {SecurityService} from "../services/security.service";

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {

  errorMessage! : string;
  frequences!: Observable<Array<Frequences>>;

  searchFrequenceFormGroup! : FormGroup;
  newFrequenceFormGroup! : FormGroup;
  updateFrequenceFormGroup!: FormGroup;

  selectedFrequenceToUpdate: Frequences | undefined;


  constructor( private frequenceService : FrequenceService ,
               private fb : FormBuilder,
               public securityService : SecurityService) { }

  ngOnInit(): void {

    this.searchFrequenceFormGroup= this.fb.group({
      keyword : this.fb.control(null)
    });

    this.newFrequenceFormGroup = this.fb.group({
      codeFrequence: ['', Validators.required],
      intitulefrequence: ['', Validators.required],
    });

    this.updateFrequenceFormGroup = this.fb.group({
      codeFrequence: ['', Validators.required],
      intitulefrequence: ['', Validators.required],
    });

    this.handleGetAllFrequences();

  }

  //-------------------------------------------------------------------------------------------------------

  handleGetAllFrequences() {
    this.frequenceService.getAllFrequence().subscribe(
      frequences => {
        console.log("Received updated frequences:", frequences);
        this.frequences = of(frequences);
      },
      error => {
        console.error("Error fetching frequences:", error);
        this.errorMessage = error.message;
      }
    );
  }
  //-------------------------------------------------------------------------------------------------------

  handleSearchFrequence() {
    const keyword = this.searchFrequenceFormGroup?.value.keyword;
    console.log(keyword)
    if (keyword) {
      this.frequences = this.frequenceService.searchFrequence(keyword).pipe(
        catchError((err) => {
          this.errorMessage = err;
          return throwError(err);
        })
      );
    } else {
      // If the keyword is empty, show all frequences
      this.handleGetAllFrequences();
    }
  }

  //-------------------------------------------------------------------------------------------------------
  handleNewFrequence() {
    if (this.newFrequenceFormGroup.valid) {
      const newFrequence: Frequences = this.newFrequenceFormGroup.value;

      // Check if the Frequency name already exists
      this.handleCheckFrequence(newFrequence.intitulefrequence).subscribe({
        next: (existingFrequence) => {
          if (existingFrequence.length > 0) {
            alert("A Frequency with the same name already exists. Please choose a different name.");
          } else {
            // Add the new Frequency since the name is unique
            this.frequenceService.addNewFrequence(newFrequence).pipe(
              tap(() => {
                this.newFrequenceFormGroup.reset();
                alert("Frequency saved successfully!");
              })
            ).subscribe({
              next: () => {
                this.handleGetAllFrequences();
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
      alert("Please fill out both the 'Frequency Code' and 'Intitule Frequency' fields.");
    }
  }

  // Function to check if a canal with the same name already exists in the database
  handleCheckFrequence(keyword: string): Observable<Array<Frequences>> {
    return this.frequenceService.searchFrequence(keyword).pipe(
      catchError(err => {
        this.errorMessage = err;
        return throwError(err);
      })
    );
  }

//-------------------------------------------------------------------------------------------------------

  // Function to open the update modal and pre-fill the form with existing canal details
  handleOpenUpdateModal(frequences: Frequences) {
    this.selectedFrequenceToUpdate = frequences;
    this.updateFrequenceFormGroup.patchValue({
      codeFrequence: frequences.codeFrequence,
      intitulefrequence: frequences.intitulefrequence,
    });
  }

  // Function to update scope
  handleUpdateFrequence() {
    if (this.updateFrequenceFormGroup.valid && this.selectedFrequenceToUpdate) {
      const updatedFrequence: Frequences = {
        ...this.selectedFrequenceToUpdate,
        ...this.updateFrequenceFormGroup.value,
      };

      this.frequenceService.updateFrequence(this.selectedFrequenceToUpdate.id, updatedFrequence).subscribe({
        next: () => {
          this.handleGetAllFrequences();
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    } else {
      alert("Please fill out both the 'Code Frequency' and 'Intitule Frequency' fields.");
    }
  }

//-------------------------------------------------------------------------------------------------------

  handleDeleteFrequence(frequences: Frequences) {
    let conf = confirm("Are you sure to Delete ?");
    if (!conf) return;

    this.frequenceService.deleteFrequence(frequences.id).subscribe({
      next: () => {
        // Update the table list after the Frequency is deleted
        this.handleGetAllFrequences();
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
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
