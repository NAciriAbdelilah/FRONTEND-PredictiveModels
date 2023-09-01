import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PredictiveModelsComponent } from './predictive-models/predictive-models.component';
import { FeaturesComponent } from './features/features.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { NewPredictiveModelComponent } from './new-predictive-model/new-predictive-model.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from "@angular/material/list";
import { DetailsModelComponent } from './details-model/details-model.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import { ScopesComponent } from './scopes/scopes.component';
import { CanalsComponent } from './canals/canals.component';
import { FrequencyComponent } from './frequency/frequency.component';
import { OutputModelsComponent } from './output-models/output-models.component';
import { NewPmScopeCanalsFrequencyComponent } from './new-pm-scope-canals-frequency/new-pm-scope-canals-frequency.component';
import { NewPmFeaturesComponent } from './new-pm-features/new-pm-features.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UpdatePmScopeCanalsFrequencyComponent } from './update-pm-scope-canals-frequency/update-pm-scope-canals-frequency.component';
import { UpdatePmFeaturesComponent } from './update-pm-features/update-pm-features.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {NgChartsModule} from "ng2-charts";
import { BarChartComponent } from './reporting-charts/bar-chart/bar-chart.component';
import { FilterByNameAndDateComponent } from './filter-by-name-and-date/filter-by-name-and-date.component';
import { PieChartMarcheComponent } from './reporting-charts/pie-chart-marche/pie-chart-marche.component';
import { PieChartDrComponent } from "./reporting-charts/pie-chart-dr/pie-chart-dr.component";
import { PieChartSegmentComponent } from './reporting-charts/pie-chart-segment/pie-chart-segment.component';

@NgModule({
    declarations: [
        AppComponent,
        PredictiveModelsComponent,
        FeaturesComponent,
        LoginComponent,
        AdminTemplateComponent,
        NewPredictiveModelComponent,
        DetailsModelComponent,
        ScopesComponent,
        CanalsComponent,
        FrequencyComponent,
        OutputModelsComponent,
        NewPmScopeCanalsFrequencyComponent,
        NewPmFeaturesComponent,
        DashboardComponent,
        UpdatePmScopeCanalsFrequencyComponent,
        UpdatePmFeaturesComponent,
        PieChartDrComponent,
        BarChartComponent,
        FilterByNameAndDateComponent,
        PieChartMarcheComponent,
        PieChartDrComponent,
        PieChartSegmentComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatListModule,
        NgMultiSelectDropDownModule,
        FormsModule,
        HttpClientModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        NgChartsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
