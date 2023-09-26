import { Injectable } from '@angular/core';
import {Features} from "../models/features.model";
import {catchError, Observable, of, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {PagesFeatures} from "../models/pagesFeatures";

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  constructor(private http:HttpClient) {}

  public getAllFeatures() : Observable<Array<Features>>{
    return this.http.get<Array<Features>>(environment.backendHost+"/features");
  }

  public getAllFeaturesByPages(page: number = 0, size: number = 0): Observable<PagesFeatures> {
    return this.http.get<PagesFeatures>(
      `${environment.backendHost}/features/getAllFeaturesByPages?page=${page}&size=${size}`);
  }


  public searchByNameOrDescription(keyword : string, page: number = 0, size: number = 0 ) : Observable<PagesFeatures>{
    return this.http.get<PagesFeatures>(`${environment.backendHost}/features/searchByNameOrDescription?keyword=${keyword}&page=${page}&size=${size}`);
  }


  public getAllFeaturesByPagesByID(page: number, size: number, predictiveModelId: number): Observable<PagesFeatures> {
    return this.http.get<PagesFeatures>(
      `${environment.backendHost}/features/getFeaturesByPagesAndByPMId/${predictiveModelId}/page?page=${page}&size=${size}`).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }

  public getFeaturesByPredictiveModelById(id: number) : Observable<Array<Features>>{
    return this.http.get<Array<Features>>( environment.backendHost+"/features/"+id);
  }

  public searchFeatures(keyword : string) : Observable<Array<Features>>{
    return this.http.get<Array<Features>>(environment.backendHost+"/features/search?keyword="+keyword);
  }

  public getFeaturesByPredictiveModelName(modelName: string): Observable<Array<Features>> {
    return this.http.get<Array<Features>>(environment.backendHost+"/features/searchByModelName?modelName="+modelName);
  }

  public addNewFeature(features : Features) : Observable<Features>{
    return this.http.post<Features>(environment.backendHost+"/features",features);
  }

  public updateFeature(id: number , features : Features) : Observable<Features>{
      return this.http.put<Features>(environment.backendHost+"/features/"+id,features);
  }

  public deleteFeature(id :number, p: { responseType: string }): Observable<string>{
    return this.http.delete(environment.backendHost+"/features/"+id, { responseType: 'text'});
  }


}
