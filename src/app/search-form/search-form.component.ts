import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FacetConfig, FilterModel} from "./search-form.model";

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent {
  @Input() facets: FacetConfig[] = [];
  @Output() search = new EventEmitter<FilterModel>();
}
