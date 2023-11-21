import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Store} from "@ngrx/store";
import {searchInProgressSelector} from "../store/search.feature";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {Subject, takeUntil} from "rxjs";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {routeActions} from "../store/search.actions";
import {FilterChip, ResultsPageService, TableColumn} from "./results-page.service";
import {BookModel} from "../search.service";


@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatChipsModule, MatButtonModule, MatIconModule],
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsPageComponent implements OnInit, OnDestroy, AfterViewInit {

  tableDataSource!: MatTableDataSource<BookModel>;

  displayedColumns!: TableColumn[];

  columnNames!: string[];

  filterChips: FilterChip[] = [];

  loading$ = this.store.select(searchInProgressSelector);

  unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store,
    private resultsService: ResultsPageService
  ) {
    this.tableDataSource = new MatTableDataSource<BookModel>([]);
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.resultsService.init();

    this.resultsService.searchResults$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(results => {
        this.tableDataSource.data = results;
      })

    this.resultsService.displayedColumns$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(columns => {
        this.displayedColumns = columns

        if (!this.displayedColumns.length) {
          console.warn('Your table has no columns defined.');
        }
      })

    this.resultsService.columnNames$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(columnNames => {
        this.columnNames = columnNames;
      })

    this.resultsService.filterChips$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(filterChips => {
        this.filterChips = filterChips
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  navigateToSearchPage(): void {
    this.store.dispatch(routeActions.navigateToSearchPage());
  }

  getDisplayValue(value: any) {
    return this.resultsService.getDisplayValue(value);
  }

}
