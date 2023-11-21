import {Injectable} from '@angular/core';
import {resultsPageActions} from "../store/search.actions";
import {Store} from "@ngrx/store";
import {combineLatest, map, Observable} from "rxjs";
import {
  searchFiltersSelector,
  searchResultsColumns,
  searchResultsSelector
} from "../store/search.feature";
import {FilterModel} from "../shared/search-widget/search-widget.model";

export type FilterChip = { label: string, value: any }
export type TableColumn = {
  key: string,
  label: string
}

/**
 * Service to manage and provide data for the results page.
 * This service acts as a bridge between the NgRx store and the ResultsPageComponent,
 * abstracting away the logic for selecting and transforming state data.
 */
@Injectable({
  providedIn: 'root'
})
export class ResultsPageService {

  searchResults$ = this.store.select(searchResultsSelector).pipe(
    map(results => results || [])
  );

  displayedColumns$ = this.store.select(searchResultsColumns).pipe(
    map(columns => Array.from(columns.entries()).map(entry => ({key: entry[0], label: entry[1]})))
  );

  columnNames$ = this.displayedColumns$.pipe(
    map(columns => columns.map(column => column.key))
  );

  filterChips$ = combineLatest([
    this.store.select(searchFiltersSelector),
    this.displayedColumns$
  ]).pipe(
    map(([filters, displayedColumns]) => this.prepareFilterChips(filters, displayedColumns))
  );

  constructor(private store: Store) {
  }

  init() {
    setTimeout(() => {
      this.store.dispatch(resultsPageActions.pageLoaded());
    });
  }

  /**
   * Transforms a given value into a displayable string format.
   * This is used to format the values shown in the results table.
   */
  getDisplayValue(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  }

  /**
   * Prepares filter chips based on the current filter model.
   * This method transforms the filter model into an array of FilterChips for display in the results page component.
   */
  private prepareFilterChips(filters: FilterModel, displayedColumns: TableColumn[]): FilterChip[] {
    const chips: FilterChip[] = [];

    if (!filters) {
      return chips;
    }

    if (filters.searchTerm) {
      chips.push({label: 'Search', value: filters.searchTerm});
    }

    Object.entries(filters.selections || {}).forEach(([key, value]) => {
      const columnLabel = displayedColumns.find(c => c.key === key)?.label || key;
      let displayValue = 'N/A';

      if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No';
      } else if (Array.isArray(value)) {
        displayValue = value.join(', ');
      }

      chips.push({label: columnLabel, value: displayValue});
    });

    return chips;
  }

}
