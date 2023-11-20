import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Store} from "@ngrx/store";
import {
  searchFiltersSelector,
  searchInProgressSelector,
  searchResultsColumns,
  searchResultsSelector
} from "../store/search.feature";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {BehaviorSubject, combineLatest, Subject, takeUntil} from "rxjs";
import {MatChipsModule} from "@angular/material/chips";
import {FilterModel} from "../shared/search-widget/search-widget.model";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {resultsPageActions, routeActions} from "../store/search.actions";

type FilterChip = { label: string, value: any }

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatChipsModule, MatButtonModule, MatIconModule],
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent implements OnInit, OnDestroy, AfterViewInit {
  searchResults$ = this.store.select(searchResultsSelector);
  displayedColumns$ = this.store.select(searchResultsColumns);
  searchFilters$ = this.store.select(searchFiltersSelector);
  loading$ = this.store.select(searchInProgressSelector);

  tableDataSource!: MatTableDataSource<any>;
  displayedColumns!: {
    key: string,
    label: string
  }[];
  columnNames!: string[];

  filterChips: FilterChip[] = [];

  unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store,
  ) {
    this.tableDataSource = new MatTableDataSource<any>([]);
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(resultsPageActions.pageLoaded());
    });

    this.searchResults$.pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.tableDataSource.data = results || [];
    })

    this.displayedColumns$.pipe(takeUntil(this.unsubscribe$)).subscribe(columns => {
      this.displayedColumns = Array.from(columns.entries())
        .map(entry => ({key: entry[0], label: entry[1]}));

      this.columnNames = Array.from(columns.keys());
    })

    this.searchFilters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      this.filterChips = this.prepareFilterChips(filters);
    });


  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  navigateToSearchPage(): void {
    this.store.dispatch(routeActions.navigateToSearchPage());
  }

  getColumnValue(value: any) {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }

    return value;
  }

  private prepareFilterChips(filters: FilterModel): FilterChip[] {
    const chips: FilterChip[] = [];

    if (!filters) {
      return chips;
    }

    // Add search term chip
    if (filters.searchTerm) {
      chips.push({ label: "Search", value: filters.searchTerm });
    }

    // Add chips for each active filters
    this.columnNames.forEach(column => {
      if (filters.selections && filters.selections[column] !== undefined) {
        const columnLabel = this.displayedColumns.find(c => c.key === column)?.label || column;
        const filterValue = filters.selections[column];
        let value: string = 'N/A';

        if (typeof filterValue === 'boolean') {
          value = filterValue ? 'Yes' : 'No';
        }
        else if (Array.isArray(filterValue)) {
          value = filterValue.join(', ');
        }

        chips.push({ label: columnLabel, value: value });
      }
    });

    return chips;
  }
}
