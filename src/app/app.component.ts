import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {SearchWidgetComponent} from "./shared/search-widget/search-widget.component";
import {Store} from "@ngrx/store";
import {mainPageActions} from "./store/search.actions";
import {searchWidgetConfig, searchWidgetParams} from "./search-widget.data";
import {MatInputModule} from "@angular/material/input";
import {searchErrorSelector, searchInProgressSelector} from "./store/search.feature";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SearchWidgetComponent, MatInputModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  error$ = this.store.select(searchErrorSelector);
  loading$ = this.store.select(searchInProgressSelector);

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(mainPageActions.setWidgetConfig({
      config: searchWidgetConfig,
      options: searchWidgetParams
    }));
  }

}
