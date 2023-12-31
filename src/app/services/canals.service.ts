import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Canals} from "../models/canals.model";

@Injectable({
  providedIn: 'root'
})
export class CanalsService {

  constructor(private http:HttpClient) {}

  public getAllCanals() : Observable<Array<Canals>>{
    return this.http.get<Array<Canals>>(environment.backendHost+"/canals")
  }

  public getCanalsByPredictiveModelById(id: number) : Observable<Array<Canals>>{
    return this.http.get<Array<Canals>>( environment.backendHost+"/canals/"+id)
  }

  public searchCanal(keyword : string) : Observable<Array<Canals>>{
    return this.http.get<Array<Canals>>(environment.backendHost+"/canals/search?keyword="+keyword)
  }

  public addNewCanals(canals : Canals) : Observable<Canals>{
    return this.http.post<Canals>(environment.backendHost+"/canals",canals)
  }

  public updateCanals(id: number , canals : Canals) : Observable<Canals>{
    return this.http.put<Canals>(environment.backendHost+"/canals/"+id,canals)
  }

  public deleteCanals(id: number, p: { responseType: string }): Observable<string> {
    return this.http.delete(environment.backendHost + "/canals/" + id, { responseType: 'text'});
  }



}
