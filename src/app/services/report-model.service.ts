import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ReportModelByDR} from "../model/reportModelByDR";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ReportModelByMarche} from "../model/reportModelByMarche";

@Injectable({
  providedIn: 'root'
})
export class ReportModelService {

  constructor(private http:HttpClient) { }

  public getReportingByDR(idPredictiveModel: number, selectedDate : string): Observable<Array<ReportModelByDR>> {
    return this.http.get<Array<ReportModelByDR>>(environment.backendHost+"/reportsPredictiveModel/directionRegionale/"+idPredictiveModel+"/"+selectedDate)
  }

  public getReportingByMarche(idPredictiveModel: number, selectedDate : string): Observable<Array<ReportModelByMarche>> {
    return this.http.get<Array<ReportModelByMarche>>(environment.backendHost+"/reportsPredictiveModel/marche/"+idPredictiveModel+"/"+selectedDate)
  }

}
