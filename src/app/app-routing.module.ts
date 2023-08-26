import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PredictiveModelsComponent} from "./predictive-models/predictive-models.component";
import {FeaturesComponent} from "./features/features.component";
import {LoginComponent} from "./login/login.component";
import {AdminTemplateComponent} from "./admin-template/admin-template.component";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {NewPredictiveModelComponent} from "./new-predictive-model/new-predictive-model.component";
import {DetailsModelComponent} from "./details-model/details-model.component";
import {ScopesComponent} from "./scopes/scopes.component";
import {CanalsComponent} from "./canals/canals.component";
import {FrequencyComponent} from "./frequency/frequency.component";
import {OutputModelsComponent} from "./output-models/output-models.component";
import {NewPmScopeCanalsFrequencyComponent} from "./new-pm-scope-canals-frequency/new-pm-scope-canals-frequency.component";
import {NewPmFeaturesComponent} from "./new-pm-features/new-pm-features.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UpdatePmScopeCanalsFrequencyComponent} from "./update-pm-scope-canals-frequency/update-pm-scope-canals-frequency.component";
import {UpdatePmFeaturesComponent} from "./update-pm-features/update-pm-features.component";

const routes: Routes = [
  { path: "login", component: LoginComponent},
  { path: "", component: LoginComponent},
  { path: "admin", component: AdminTemplateComponent,

    canActivate : [AuthenticationGuard], // pour tester le guard qu'on a activé
    children : [  // children >>>> pour rendre les  routes (predictive-models et features) des enfants de ADMIN template
      { path: "predictive-models", component: PredictiveModelsComponent},
      { path: "features", component: FeaturesComponent},
      { path: "new-predictive-model", component: NewPredictiveModelComponent},
      { path: "new-predictive-model:id", component: NewPredictiveModelComponent},
      { path: "details-model", component: DetailsModelComponent},
      { path: "details-model/:id", component: DetailsModelComponent},
      { path: "scopes", component: ScopesComponent},
      { path: "canals", component: CanalsComponent},
      { path: "frequency", component: FrequencyComponent},
      { path: "output-models", component: OutputModelsComponent},
      { path: "new-pm-scope-canals-frequency", component: NewPmScopeCanalsFrequencyComponent},
      { path: "update-pm-scope-canals-frequency", component: UpdatePmScopeCanalsFrequencyComponent},
      { path: "new-pm-features", component: NewPmFeaturesComponent},
      { path: "update-pm-features", component: UpdatePmFeaturesComponent},
      { path: "dashboard", component: DashboardComponent}
    ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
