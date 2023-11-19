import { Routes } from '@angular/router';
import {SearchPageComponent} from "./search-page/search-page.component";
import {ResultsPageComponent} from "./results-page/results-page.component";

export const routes: Routes = [
  { path: 'search', component: SearchPageComponent },
  { path: 'results', component: ResultsPageComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' }
];
