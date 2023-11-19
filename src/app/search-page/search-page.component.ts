import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchWidgetComponent} from "../shared/search-widget/search-widget.component";
import {FilterModel} from "../shared/search-widget/search-widget.model";
import {Store} from "@ngrx/store";
import {searchWidgetConfigSelector} from "../store/search.feature";
import {searchPageActions} from "../store/search.actions";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, SearchWidgetComponent],
  providers: [],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  searchConfig$ = this.store.select(searchWidgetConfigSelector);

  constructor(private store: Store) {}

  ngOnInit() {

  }

  search(filters: FilterModel) {
    this.store.dispatch(searchPageActions.searchInitiated({filters: filters}))
  }
}
