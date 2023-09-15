import { Component, OnInit } from '@angular/core';
import {catchError, Observable, of, tap, throwError} from "rxjs";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Frequences} from "../models/frequences.model";
import {FrequenceService} from "../services/frequence.service";
import {SecurityService} from "../services/security.service";
import Swal from "sweetalert2";
import {Canals} from "../models/canals.model";

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
            Swal.fire({
              position: 'center',
              icon: 'info',
              title: 'Frequence du même nom existe déjà. Veuillez choisir un autre nom..',
              showConfirmButton: true,
              confirmButtonColor: '#cb3533',
              timer: 3000
            });
          } else {
            // Add the new Frequency since the name is unique
            this.frequenceService.addNewFrequence(newFrequence).pipe(
              tap(() => {
                this.newFrequenceFormGroup.reset();
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Frequence enregistré avec succès!',
                  showConfirmButton: true,
                  confirmButtonColor: '#cb3533',
                  timer: 3000
                });
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
    }
  }

//-------------------------------------------------------------------------------------------------------

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
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Votre Frequence Mis à jour avec succès!',
        showConfirmButton: true,
        confirmButtonColor: '#cb3533',
        timer: 3000
      });
      this.frequenceService.updateFrequence(this.selectedFrequenceToUpdate.id, updatedFrequence).subscribe({
        next: () => {
          this.handleGetAllFrequences();
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Veuillez remplir les champs «Code du Frequence» et «Intitule du Frequence».',
        showConfirmButton: true,
        confirmButtonColor: '#cb3533',
        timer: 3000
      });
    }
  }

//-------------------------------------------------------------------------------------------------------

  handleDeleteFrequence(frequences: Frequences) {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer?",
      text: "Vous ne pourrez pas récupérer ce Frequence !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Oui, Supprimer!',
      confirmButtonColor: '#cb3533',
      cancelButtonText: 'No, Annuler',
      cancelButtonColor: 'rgba(16,16,15,0.47)',

    }).then((result) => {
      if (result.isConfirmed) {
        // Specify the response type as text
        this.frequenceService.deleteFrequence(frequences.id, { responseType: 'text' }).subscribe({
          next: (response) => {
            console.log('Frequence deleted successfully');
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
              this.handleGetAllFrequences();
            });
          },
          error: (err) => {
            console.error('Error deleting Frequence:', err);
            this.errorMessage = err;
          }
        });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Annulation Suppression!',
          html: 'Votre Frequence  est en sécurité :)',
          showConfirmButton: true,
          confirmButtonColor: '#cb3533',
          timer: 3000
        });
      }
    });
  }

  //-------------------------------------------------------------------------------------------------------

  //-------------------------------------------------------------------------------------------------------

  getErrorMessage(fieldName: string, error: ValidationErrors) {
    if (error['required']){
      return fieldName + " is Required";
    } else if (error['minLength']){
      return fieldName + " should have at least "+ error['minLength']['requiredLength'] + " Characters";
    } else return "";
  }

}
