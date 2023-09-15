import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Frequences} from "../models/frequences.model";

@Injectable({
  providedIn: 'root'
})
export class FrequenceService {

  constructor(private http:HttpClient) {}

  public getAllFrequence() : Observable<Array<Frequences>>{
    return this.http.get<Array<Frequences>>(environment.backendHost+"/frequences")
  }

  public getFrequencyByPredictiveModelById(id: number) : Observable<Array<Frequences>>{
    return this.http.get<Array<Frequences>>( environment.backendHost+"/frequences/"+id)
  }

  public searchFrequence(keyword : string) : Observable<Array<Frequences>>{
    return this.http.get<Array<Frequences>>(environment.backendHost+"/frequences/search?keyword="+keyword)
  }

  public addNewFrequence(frequences : Frequences) : Observable<Frequences>{
    return this.http.post<Frequences>(environment.backendHost+"/frequences",frequences)
  }

  public updateFrequence(id: number , frequences : Frequences) : Observable<Frequences>{
    return this.http.put<Frequences>(environment.backendHost+"/frequences/"+id,frequences)
  }

  public deleteFrequence(id :number, p: { responseType: string }): Observable<string>{
    return this.http.delete(environment.backendHost+"/frequences/"+id, { responseType: 'text'})
  }

}
