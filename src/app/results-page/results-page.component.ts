import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchStateService} from "../search-state.service";

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-page.component.html',
  styleUrl: './results-page.component.scss'
})
export class ResultsPageComponent implements OnInit {
  searchResults: any; // Replace 'any' with your actual data type

  constructor(private searchStateService: SearchStateService) {}

  ngOnInit(): void {
    this.subscribeToSearchResults();
  }

  private subscribeToSearchResults(): void {
    this.searchStateService.searchResults$.subscribe(results => {
      this.searchResults = results;
    });
  }
}
