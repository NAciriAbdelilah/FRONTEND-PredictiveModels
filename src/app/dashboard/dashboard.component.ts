import {Component, OnInit} from '@angular/core';
import {PredictiveModelService} from "../services/predictive-model.service";
import {Observable} from "rxjs";
import {PredictiveModel} from "../models/predictivemodels.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  listOfPredictiveModel!: Observable<Array<PredictiveModel>>;
  errorMessage!: string;
  totalProductionCount: number = 0;
  totalPilotCount: number = 0;

  constructor(private predictiveModelService: PredictiveModelService) {
  }

  ngOnInit(): void {

    this.listOfPredictiveModel = this.predictiveModelService.getAllPredictiveModels();
    this.listOfPredictiveModel.subscribe(
      predictiveModels => {
        this.totalProductionCount = predictiveModels.filter(pm => pm.statusPM).length;
        this.totalPilotCount = predictiveModels.filter(pm => !pm.statusPM).length;
      },
      error => {
        console.error("Error fetching Predictive Models:", error);
        this.errorMessage = error.message;
      }
    );

  }


}
