import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Store} from "@ngrx/store";
import {searchResultsSelector} from "../store/search.feature";

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent implements OnInit {
  searchResults$ = this.store.select(searchResultsSelector);

  constructor(private store: Store) {}

  ngOnInit(): void {

  }

}
