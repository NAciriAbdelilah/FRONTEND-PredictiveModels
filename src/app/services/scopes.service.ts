import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Scopes} from "../model/scopes.model";
import {Features} from "../model/features.model";

@Injectable({
  providedIn: 'root'
})
export class ScopesService {

  constructor(private http:HttpClient) {}

  public getAllScopes() : Observable<Array<Scopes>>{
    return this.http.get<Array<Scopes>>(environment.backendHost+"/scopes")
  }

  public getScopesByPredictiveModelById(id: number) : Observable<Array<Scopes>>{
    return this.http.get<Array<Scopes>>( environment.backendHost+"/scopes/"+id)
  }

  public searchScope(keyword : string) : Observable<Array<Scopes>>{
    return this.http.get<Array<Scopes>>(environment.backendHost+"/scopes/search?keyword="+keyword)
  }

  public addNewScopes(scopes : Scopes) : Observable<Scopes>{
    return this.http.post<Scopes>(environment.backendHost+"/scopes",scopes)
  }

  public updateScopes(id: number , scopes : Scopes) : Observable<Scopes>{
    return this.http.put<Scopes>(environment.backendHost+"/scopes/"+id,scopes)
  }

  public deleteScopes(id :number): Observable<void>{
    return this.http.delete<void>(environment.backendHost+"/scopes/"+id)
  }



}
