import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {SearchWidgetComponent} from "./shared/search-widget/search-widget.component";
import {Store} from "@ngrx/store";
import {mainPageActions} from "./store/search.actions";
import {resultsColumns, searchWidgetConfig, searchWidgetParams} from "./search-widget.data";
import {MatInputModule} from "@angular/material/input";
import {searchErrorSelector, searchInProgressSelector} from "./store/search.feature";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {Subject, takeUntil} from "rxjs";
import {MatToolbarModule} from "@angular/material/toolbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SearchWidgetComponent, MatInputModule, MatProgressBarModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading$ = this.store.select(searchInProgressSelector);

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(mainPageActions.setSearchParams({
      searchParams: {
        config: searchWidgetConfig,
        options: searchWidgetParams,
        columns: resultsColumns,
      }
    }));
  }

}
