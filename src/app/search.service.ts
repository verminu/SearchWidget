import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterModel} from "./shared/search-widget/search-widget.model";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  constructor() { }

  search(criteria: FilterModel): Observable<any> {
    // Replace with actual backend request
    // return this.http.get('/api/search', {params: criteria });
    // TODO format the criteria to be sent as params
    // return this.http.get('/api/search');
    return of(criteria);
  }
}
