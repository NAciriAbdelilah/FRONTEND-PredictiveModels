import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {PredictiveModel} from "../model/predictivemodels.model";
import {PredictiveModelService} from "../services/predictive-model.service";
import {FileOutputDetailsModel} from "../model/fileOutputDetails.model";
import {OutputModelService} from "../services/output-model.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-output-models',
  templateUrl: './output-models.component.html',
  styleUrls: ['./output-models.component.css']
})
export class OutputModelsComponent implements OnInit {


  selectedPredictiveModelId!: number;
  selectedDatePushOutput! : string;
  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  file!: File;
  fileOutputDetailsModel!: FileOutputDetailsModel;
  fileToUpload: File | null = null; // Change to a single file, not an array
  uploadOutputFileFormGroup!: FormGroup;

  constructor(private predictiveModelService : PredictiveModelService,
              private outputModelService : OutputModelService,
              private fb : FormBuilder) { }

  ngOnInit(): void {

    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels();

    this.uploadOutputFileFormGroup = this.fb.group({
      predictiveModelId: [null, Validators.required],
      dateOfPushOutputModel: [null, Validators.required],
      fileToUpload: [null, Validators.required],
    });

  }



  uploadFile() {
    const predictiveModelId = this.selectedPredictiveModelId;
    const dateOfPushOutputModel = new Date(this.selectedDatePushOutput); // Convert to Date object

    // Check if predictiveModelId and dateOfPushOutputModel are not empty
    if (!predictiveModelId || !dateOfPushOutputModel) {
      // Display an error message to the user or handle it in your UI as needed
      alert("Please choose a Predictive Model and Date before uploading !");
      return;
    }
    const formData = new FormData();
    formData.append('file', this.file);
  // Convert Date to ISO string
    formData.append('data', new Blob([JSON.stringify({
      "predictiveModelId":  this.selectedPredictiveModelId.toString(),
      "dateOfPushOutputModel": this.selectedDatePushOutput,
    })],  {
      type: "application/json"
    }));

    this.outputModelService.upload(formData).subscribe({
      next: (data) => {
        this.fileOutputDetailsModel = data;
        // Handle the response as needed
        alert("File Uploaded Successfully");
      },
      error: (e) => {
        console.log(e);
        // Handle errors
      }
    });
  }


//-------------------------------------------------------------------------------------------------------

  selectFile(event: any) {
    this.file = event.target.files.item(0);
  }

  onPredictiveModelSelect(event: any) {
    const selectedValue = event.target.value;
    this.selectedPredictiveModelId = parseInt(selectedValue);
    console.log('Selected PM ID:', this.selectedPredictiveModelId);
  }

  onDateSelect(event: any) {
    this.selectedDatePushOutput = event.target.value;
    console.log('Selected DATE:', this.selectedDatePushOutput);
  }


//-------------------------------------------------------------------------------------------------------




}
