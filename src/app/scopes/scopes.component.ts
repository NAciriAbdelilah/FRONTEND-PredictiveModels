import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {catchError, Observable, of, tap, throwError} from "rxjs";
import {ScopesService} from "../services/scopes.service";
import {Scopes} from "../model/scopes.model";
import {SecurityService} from "../services/security.service";

@Component({
  selector: 'app-scopes',
  templateUrl: './scopes.component.html',
  styleUrls: ['./scopes.component.css']
})
export class ScopesComponent implements OnInit {

  errorMessage! : string;
  scopes!: Observable<Array<Scopes>>;
  searchScopeFormGroup! : FormGroup;
  newScopeFormGroup! : FormGroup;
  updateScopeFormGroup!: FormGroup;
  selectedScopeToUpdate: Scopes | undefined;


  constructor( private scopeService : ScopesService ,
               private fb : FormBuilder,
               public securityService : SecurityService) { }

  ngOnInit(): void {

    this.searchScopeFormGroup= this.fb.group({
      keyword : this.fb.control(null)
    });

    this.newScopeFormGroup = this.fb.group({
      intituleScope: ['', Validators.required],
      descriptionScope: ['', Validators.required],
    });

    this.updateScopeFormGroup = this.fb.group({
      intituleScope: ['', Validators.required],
      descriptionScope: ['', Validators.required],
    });

    this.handleGetAllScopes();

  }


  //-------------------------------------------------------------------------------------------------------

    handleGetAllScopes() {
      this.scopeService.getAllScopes().subscribe(
        scopes => {
          console.log("Received updated scopes:", scopes);
          this.scopes = of(scopes);
        },
        error => {
          console.error("Error fetching scopes:", error);
          this.errorMessage = error.message;
        }
      );
    }
  //-------------------------------------------------------------------------------------------------------

    handleSearchScope() {
      const keyword = this.searchScopeFormGroup?.value.keyword;
      console.log(keyword)
      if (keyword) {
        this.scopes = this.scopeService.searchScope(keyword).pipe(
          catchError((err) => {
            this.errorMessage = err;
            return throwError(err);
          })
        );
      } else {
        // If the keyword is empty, show all scopes
        this.handleGetAllScopes();
      }
    }

  //-------------------------------------------------------------------------------------------------------
    handleNewScope() {
      if (this.newScopeFormGroup.valid) {
        const newScope: Scopes = this.newScopeFormGroup.value;

        // Check if the scope name already exists
        this.handleCheckScope(newScope.intituleScope).subscribe({
          next: (existingScope) => {
            if (existingScope.length > 0) {
              alert("A Scope with the same name already exists. Please choose a different name.");
            } else {
              // Add the new Scope since the name is unique
              this.scopeService.addNewScopes(newScope).pipe(
                tap(() => {
                  this.newScopeFormGroup.reset();
                  alert("Scope saved successfully!");
                })
              ).subscribe({
                next: () => {
                  this.handleGetAllScopes(); // Fetch the updated scopes list after adding a new scope
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
        alert("Please fill out both the 'Scope Intitule' and 'Description Scope' fields.");
      }
    }
//-------------------------------------------------------------------------------------------------------

  // Function to check if a scope with the same name already exists in the database
    handleCheckScope(keyword: string): Observable<Array<Scopes>> {
      return this.scopeService.searchScope(keyword).pipe(
        catchError(err => {
          this.errorMessage = err;
          return throwError(err);
        })
      );
    }

//-------------------------------------------------------------------------------------------------------

    // Function to open the update modal and pre-fill the form with existing scope details
        handleOpenUpdateModal(scope: Scopes) {
          this.selectedScopeToUpdate = scope;
          this.updateScopeFormGroup.patchValue({
            intituleScope: scope.intituleScope,
            descriptionScope: scope.descriptionScope,
          });
        }

    // Function to update scope
      handleUpdateScope() {
          if (this.updateScopeFormGroup.valid && this.selectedScopeToUpdate) {
            const updatedScope: Scopes = {
              ...this.selectedScopeToUpdate,
              ...this.updateScopeFormGroup.value,
            };

            this.scopeService.updateScopes(this.selectedScopeToUpdate.id, updatedScope).subscribe({
              next: () => {
                this.handleGetAllScopes();
              },
              error: (err) => {
                this.errorMessage = err;
              }
            });
          } else {
            alert("Please fill out both the 'Intitule Scope ' and 'Description Scope' fields.");
          }
        }

//-------------------------------------------------------------------------------------------------------

      handleDeleteScope(scope: Scopes) {
        let conf = confirm("Are you sure to Delete ?");
        if (!conf) return;

        this.scopeService.deleteScopes(scope.id).subscribe({
          next: () => {
            // Update the table list after the scope is deleted
            this.handleGetAllScopes();
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
