import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {catchError, Observable, of, tap, throwError} from "rxjs";
import {ScopesService} from "../services/scopes.service";
import {Scopes} from "../models/scopes.model";
import {SecurityService} from "../services/security.service";
import Swal from "sweetalert2";

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
              Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Marché du même nom existe déjà. Veuillez choisir un autre nom..',
                showConfirmButton: true,
                confirmButtonColor: '#cb3533',
                timer: 3000
              });
            } else {
              // Add the new Scope since the name is unique
              this.scopeService.addNewScopes(newScope).pipe(
                tap(() => {
                  this.newScopeFormGroup.reset();
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Marché enregistré avec succès!',
                    showConfirmButton: true,
                    confirmButtonColor: '#cb3533',
                    timer: 3000
                  });                })
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
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Votre Marché Mis à jour avec succès!',
              showConfirmButton: true,
              confirmButtonColor: '#cb3533',
              timer: 3000
            });
            this.scopeService.updateScopes(this.selectedScopeToUpdate.id, updatedScope).subscribe({
              next: () => {
                this.handleGetAllScopes();
              },
              error: (err) => {
                this.errorMessage = err;
              }
            });
          } else {
            Swal.fire({
              position: 'center',
              icon: 'info',
              title: 'Veuillez remplir les champs «Intitule du Marché» et «Description du Marché».',
              showConfirmButton: true,
              confirmButtonColor: '#cb3533',
              timer: 3000
            });
          }
        }

//-------------------------------------------------------------------------------------------------------

  handleDeleteScope(scope: Scopes) {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer?",
      text: "Vous ne pourrez pas récupérer ce Marché !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Oui, Supprimer!',
      confirmButtonColor: '#cb3533',
      cancelButtonText: 'No, Annuler',
      cancelButtonColor: 'rgba(16,16,15,0.47)',

    }).then((result) => {
      if (result.isConfirmed) {
        // Specify the response type as text
        this.scopeService.deleteScopes(scope.id, { responseType: 'text' }).subscribe({
          next: (response) => {
            console.log('Scope deleted successfully');
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
              this.handleGetAllScopes();
            });
          },
          error: (err) => {
            console.error('Error deleting Scope:', err);
            this.errorMessage = err;
          }
        });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Votre Marché Mis à jour avec succès!',
          html: 'Votre Marché est en sécurité :)',
          showConfirmButton: true,
          confirmButtonColor: '#cb3533',
          timer: 3000
        });
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
  //-------------------------------------------------------------------------------------------------------

}
