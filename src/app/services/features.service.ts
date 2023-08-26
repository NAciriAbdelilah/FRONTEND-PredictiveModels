import { Injectable } from '@angular/core';
import {Features} from "../model/features.model";
import {Observable, of, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  constructor(private http:HttpClient) {}

  public getAllFeatures() : Observable<Array<Features>>{
    return this.http.get<Array<Features>>(environment.backendHost+"/features")
  }

  public getFeaturesByPredictiveModelById(id: number) : Observable<Array<Features>>{
    return this.http.get<Array<Features>>( environment.backendHost+"/features/"+id)
  }

  public searchFeatures(keyword : string) : Observable<Array<Features>>{
    return this.http.get<Array<Features>>(environment.backendHost+"/features/search?keyword="+keyword)
  }

  public searchByNameOrDescription(keyword : string) : Observable<Array<Features>>{
    return this.http.get<Array<Features>>(environment.backendHost+"/features/searchByNameOrDescription?keyword="+keyword)
  }


  public getFeaturesByPredictiveModelName(modelName: string): Observable<Array<Features>> {
    return this.http.get<Array<Features>>(environment.backendHost+"/features/searchByModelName?modelName="+modelName);
  }

  public addNewFeature(features : Features) : Observable<Features>{
    return this.http.post<Features>(environment.backendHost+"/features",features)
  }

  public updateFeature(id: number , features : Features) : Observable<Features>{
      return this.http.put<Features>(environment.backendHost+"/features/"+id,features)
  }

  public deleteFeature(id :number): Observable<void>{
    return this.http.delete<void>(environment.backendHost+"/features/"+id)
  }


}
