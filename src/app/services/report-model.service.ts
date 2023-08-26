import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ReportModel} from "../model/report.model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReportModelService {

  constructor(private http:HttpClient) { }

  public getReportingByDR(idPredictiveModel: number, selectedDate : string): Observable<Array<ReportModel>> {
    return this.http.get<Array<ReportModel>>(environment.backendHost+"/reportsPredictiveModel/"+idPredictiveModel+"/"+selectedDate)
  }


}
