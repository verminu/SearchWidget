import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Store} from "@ngrx/store";
import {searchResultsColumns, searchResultsSelector} from "../store/search.feature";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {BookModel} from "../search.service";
import {ResultsColumn} from "../shared/search-widget/search-widget.model";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent implements OnInit, OnDestroy, AfterViewInit {
  searchResults$ = this.store.select(searchResultsSelector);
  displayedColumns$ = this.store.select(searchResultsColumns);

  tableDataSource!: MatTableDataSource<any>;
  displayedColumns!: {
    key: string,
    label: string
  }[];
  columnNames!: string[];

  unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private store: Store) {}

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.searchResults$.pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.tableDataSource = new MatTableDataSource<any>(results);
    })

    this.displayedColumns$.pipe(takeUntil(this.unsubscribe$)).subscribe(columns => {
      this.displayedColumns = Array.from(columns.entries())
        .map(entry => ({key: entry[0], label: entry[1]}));

      this.columnNames = Array.from(columns.keys());
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getColumnValue(value: any) {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }

    return value;
  }

}
