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
  listOfPredictiveModel! : Observable<Array<PredictiveModel>>;
  file!: File;
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

    const predictiveModelId = this.selectedPredictiveModelId;

    // Check if predictiveModelID is not empty
    if (!predictiveModelId) {
      alert("Please choose a Predictive Model before uploading the Output !");
      return;
    }
    const formData = new FormData();
    formData.append('file', this.file);
  // Convert Date to ISO string
    formData.append('data', new Blob([JSON.stringify({
      "predictiveModelId":  this.selectedPredictiveModelId.toString(),
    })],  {
      type: "application/json"
    }));

    this.outputModelService.upload(formData).subscribe({
      next: (data) => {
        this.fileOutputDetailsModel = data;
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

//-------------------------------------------------------------------------------------------------------




}
