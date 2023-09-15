import { Injectable } from '@angular/core';
import {forkJoin, map, Observable} from "rxjs";
import {PredictiveModel} from "../models/predictivemodels.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PredictiveModelService {

  constructor(private http:HttpClient) {}

  public getAllPredictiveModels() : Observable<Array<PredictiveModel>>{
    return this.http.get<Array<PredictiveModel>>( environment.backendHost+"/predectiveModels")
  }

  public getPredictiveModelById(id: number) : Observable<PredictiveModel>{
    return this.http.get<PredictiveModel>( environment.backendHost+"/predectiveModels/"+id)
  }

  public searchPredictiveModel(keyword : string) : Observable<Array<PredictiveModel>>{
    return this.http.get<Array<PredictiveModel>>(environment.backendHost+"/predectiveModels/search?keyword="+keyword)
  }

  public addNewPredictiveModel(predictiveModel : PredictiveModel) : Observable<PredictiveModel>{
    return this.http.post<PredictiveModel>( environment.backendHost+"/predectiveModels",predictiveModel)
  }

  public updatePredictiveModel(id: number , predictiveModel : PredictiveModel) : Observable<PredictiveModel>{
    return this.http.put<PredictiveModel>(environment.backendHost+"/predectiveModels/"+id,predictiveModel)
  }

  public SaveNewPredictiveModelScopeCanalFrequency(predictiveModel : any) : Observable<PredictiveModel>{
    return this.http.post<PredictiveModel>( environment.backendHost+"/predectiveModels/savePM_Scopes_Canals_Frequencies",predictiveModel)
  }

  public SaveNewPredictiveModelFeatures(predictiveModel : any) : Observable<PredictiveModel>{
    return this.http.post<PredictiveModel>( environment.backendHost+"/predectiveModels/savePM_Features",predictiveModel)
  }

  public updatePredictiveModelScopeCanalFrequency(id: number, predictiveModel : any) : Observable<PredictiveModel>{
    return this.http.put<PredictiveModel>( environment.backendHost+"/predectiveModels/updatePMScopesCanalsFrequencies/"+id,predictiveModel)
  }

  public updatePredictiveModelFeatures(id: number, predictiveModel : any) : Observable<PredictiveModel>{
    return this.http.put<PredictiveModel>( environment.backendHost+"/predectiveModels/updatePMFeatures/"+id,predictiveModel)
  }

  public deletePredictiveModel(id :number, p: { responseType: string }): Observable<string>{
    return this.http.delete( environment.backendHost+"/predectiveModels/"+id  , { responseType: 'text'})
  }


}
