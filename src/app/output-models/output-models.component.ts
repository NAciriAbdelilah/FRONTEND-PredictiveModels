import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {PredictiveModel} from "../models/predictivemodels.model";
import {PredictiveModelService} from "../services/predictive-model.service";
import {FileOutputDetailsModel} from "../models/fileOutputDetails.model";
import {OutputModelService} from "../services/output-model.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-output-models',
  templateUrl: './output-models.component.html',
  styleUrls: ['./output-models.component.css']
})
export class OutputModelsComponent implements OnInit {


  selectedPredictiveModelId!: number;
  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  fileOutputDetailsModel!: FileOutputDetailsModel;
  fileToUpload: File | null = null;
  uploadOutputFileFormGroup!: FormGroup;

  constructor(private predictiveModelService : PredictiveModelService,
              private outputModelService : OutputModelService,
              private fb : FormBuilder) { }

  ngOnInit(): void {

    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels();

    this.uploadOutputFileFormGroup = this.fb.group({
      predictiveModelId: ['', Validators.required],
      dateOfPushOutputModel: [null, Validators.required],
      fileToUpload: [null, Validators.required],
    });

  }

//-------------------------------------------------------------------------------------------------------

  uploadFile() {

    console.log('File to upload:', this.fileToUpload);

    const predictiveModelId = this.selectedPredictiveModelId;

    // Check if predictiveModelID is not empty
    if (!predictiveModelId) {
      alert('Please choose a Predictive Model before uploading the Output!');
      return;
    }

    // Check if a file is selected
    if (!this.fileToUpload) {
      alert('Please choose a file before uploading!');
      return;
    }

    // Read the first few lines of the file to check the header
    const reader = new FileReader();

    reader.onload = (e) => {
      // Ensure that e.target.result is not null or undefined
      if (e.target && e.target.result) {
        const content = e.target.result as string;
        const lines = content.split('\n');
        const header = lines[0].trim();

        // Define the expected header
        const expectedHeader =
          'Code_Client,DR,DRPP,UC,Age_Client,Anciennete_Client,Code_Marche,Libelle_Marche,' +
          'Code_Gestionnaire,Libelle_Segment,Canal,Mois_Cible,Annee_Cible,Code_Agence,Nom_Model';

        // Check if the header matches the expected header
        if (header !== expectedHeader) {
          alert('Invalid CSV file header. Please make sure the header matches the expected format.');
          return;
        }

        // If the file header is valid, proceed with uploading
        const formData = new FormData();
        // @ts-ignore
        formData.append('file', this.fileToUpload);

        // Convert Date to ISO string
        formData.append(
          'data',
          new Blob([JSON.stringify({ predictiveModelId: this.selectedPredictiveModelId.toString() })], {
            type: 'application/json',
          })
        );

        this.outputModelService.upload(formData).subscribe({
          next: (data) => {
            // Handle the response as needed
            console.log(data);
            alert('File Uploaded Successfully');
          },
          error: (e) => {
            console.log(e);
            // Handle errors
          },
        });
      } else {
        console.error('e.target.result is null or undefined');
      }
    };

    reader.readAsText(this.fileToUpload);
  }


//-------------------------------------------------------------------------------------------------------

  selectFile(event: any) {
    this.fileToUpload  = event.target.files.item(0);
    console.log(this.fileToUpload )

  }

  onPredictiveModelSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedPredictiveModelId = parseInt(selectedValue);
    console.log('Selected PM ID:', this.selectedPredictiveModelId);
  }

//-------------------------------------------------------------------------------------------------------




}
