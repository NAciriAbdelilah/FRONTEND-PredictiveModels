import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {FileOutputDetailsModel} from "../models/fileOutputDetails.model";

@Injectable({
  providedIn: 'root'
})
export class OutputModelService {


  constructor(private http:HttpClient) {}

  public upload(formData: FormData): Observable<FileOutputDetailsModel> {
    return this.http.post<FileOutputDetailsModel>(environment.backendHost+"/outputModel/upload_Output_File",formData);
  }



}
