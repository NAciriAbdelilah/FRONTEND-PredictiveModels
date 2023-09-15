import { Component, OnInit } from '@angular/core';
import {catchError, Observable, of, tap, throwError} from "rxjs";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Canals} from "../models/canals.model";
import {CanalsService} from "../services/canals.service";
import {SecurityService} from "../services/security.service";
import Swal from 'sweetalert2'


@Component({
  selector: 'app-canals',
  templateUrl: './canals.component.html',
  styleUrls: ['./canals.component.css']
})
export class CanalsComponent implements OnInit {

  errorMessage! : string;
  canals!: Observable<Array<Canals>>;

  searchCanalFormGroup! : FormGroup;
  newCanalFormGroup! : FormGroup;
  updateCanalFormGroup!: FormGroup;

  selectedCanalToUpdate: Canals | undefined;


  constructor( private canalService : CanalsService,
               private fb : FormBuilder,
               public securityService : SecurityService) { }

  ngOnInit(): void {

    this.searchCanalFormGroup= this.fb.group({
      keyword : this.fb.control(null)
    });

    this.newCanalFormGroup = this.fb.group({
      intituleCanal: ['', Validators.required],
      descriptionCanal: ['', Validators.required],
    });

    this.updateCanalFormGroup = this.fb.group({
      intituleCanal: ['', Validators.required],
      descriptionCanal: ['', Validators.required],
    });

    this.handleGetAllCanals();

  }

  //-------------------------------------------------------------------------------------------------------

  handleGetAllCanals() {
    this.canalService.getAllCanals().subscribe(
      canals => {
        console.log("Received updated canals:", canals);
        this.canals = of(canals);
      },
      error => {
        console.error("Error fetching canals:", error);
        this.errorMessage = error.message;
      }
    );
  }
  //-------------------------------------------------------------------------------------------------------

  handleSearchCanal() {
    const keyword = this.searchCanalFormGroup?.value.keyword;
    console.log(keyword)
    if (keyword) {
      this.canals = this.canalService.searchCanal(keyword).pipe(
        catchError((err) => {
          this.errorMessage = err;
          return throwError(err);
        })
      );
    } else {
      // If the keyword is empty, show all canals
      this.handleGetAllCanals();
    }
  }

  //-------------------------------------------------------------------------------------------------------
  handleNewCanal() {
    if (this.newCanalFormGroup.valid) {
      const newCanal: Canals = this.newCanalFormGroup.value;

      // Check if the canal name already exists
      this.handleCheckCanal(newCanal.intituleCanal).subscribe({
        next: (existingCanal) => {
          if (existingCanal.length > 0) {
            Swal.fire({
              position: 'center',
              icon: 'info',
              title: 'Canal du même nom existe déjà. Veuillez choisir un autre nom..',
              showConfirmButton: true,
              confirmButtonColor: '#cb3533',
              timer: 3000
            });
          } else {
            // Add the new Canal since the name is unique
            this.canalService.addNewCanals(newCanal).pipe(
              tap(() => {
                this.newCanalFormGroup.reset();
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Canal enregistré avec succès!',
                  showConfirmButton: true,
                  confirmButtonColor: '#cb3533',
                  timer: 3000
                });
              })
            ).subscribe({
              next: () => {
                this.handleGetAllCanals(); // Fetch the updated canals list after adding a new canal
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

  // Function to check if a canal with the same name already exists in the database
  handleCheckCanal(keyword: string): Observable<Array<Canals>> {
    return this.canalService.searchCanal(keyword).pipe(
      catchError(err => {
        this.errorMessage = err;
        return throwError(err);
      })
    );
  }

  //-------------------------------------------------------------------------------------------------------

  // Function to open the update modal and pre-fill the form with existing canal details
  handleOpenUpdateModal(canal: Canals) {
    this.selectedCanalToUpdate = canal;
    this.updateCanalFormGroup.patchValue({
      intituleCanal: canal.intituleCanal,
      descriptionCanal: canal.descriptionCanal,
    });
  }

  // Function to update scope
  handleUpdateCanal() {
    if (this.updateCanalFormGroup.valid && this.selectedCanalToUpdate) {
      const updatedCanal: Canals = {
        ...this.selectedCanalToUpdate,
        ...this.updateCanalFormGroup.value,
      };
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Votre Canal Mis à jour avec succès!',
        showConfirmButton: true,
        confirmButtonColor: '#cb3533',
        timer: 3000
      });
      this.canalService.updateCanals(this.selectedCanalToUpdate.id, updatedCanal).subscribe({
        next: () => {
          this.handleGetAllCanals();
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Veuillez remplir les champs «Intitule du canal» et «Description du canal».',
        showConfirmButton: true,
        confirmButtonColor: '#cb3533',
        timer: 3000
      });
    }
  }

//-------------------------------------------------------------------------------------------------------
  handleDeleteCanal(canal: Canals) {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer?",
      text: "Vous ne pourrez pas récupérer ce Canal !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Oui, Supprimer!',
      confirmButtonColor: '#cb3533',
      cancelButtonText: 'No, Annuler',
      cancelButtonColor: 'rgba(16,16,15,0.47)',

    }).then((result) => {
      if (result.isConfirmed) {
        // Specify the response type as text
        this.canalService.deleteCanals(canal.id, { responseType: 'text' }).subscribe({
          next: (response) => {
            console.log('Canal deleted successfully');
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
              // Update the table list after the Canal is deleted
              this.handleGetAllCanals();
            });
          },
          error: (err) => {
            console.error('Error deleting canal:', err);
            this.errorMessage = err;
          }
        });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Annulation Suppression!',
          html: 'Votre Canal  est en sécurité :)',
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


}
