import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private searchResultsSource = new BehaviorSubject<any>(null); // Replace 'any' with your actual data type

  searchResults$ = this.searchResultsSource.asObservable();

  setSearchResults(results: any): void { // Replace 'any' with your actual data type
    this.searchResultsSource.next(results);
  }

  clearSearchResults(): void {
    this.searchResultsSource.next(null);
  }
}
