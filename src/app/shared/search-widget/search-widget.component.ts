import {
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FacetConfig,
  FacetType,
  FilterModel,
} from "./search-widget.model";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormOptions, FormService} from "./form.service";
import {DataMappingService} from "./data-mapping.service";

@Component({
  selector: 'app-search-widget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatSelectModule, MatCheckboxModule, MatInputModule, MatButtonModule, MatIconModule],
  providers: [FormService, DataMappingService],
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent implements OnInit, OnChanges {

  // Facets configuration for the search widget.
  @Input() facets: FacetConfig[] = [];

  // Initial filters (if any) to populate the form.
  @Input() filters: FilterModel | null = null;

  // Minimum and maximum search length constraints.
  @Input() minSearchLength?: number;
  @Input() maxSearchLength?: number;

  // EventEmitter to emit search filter when the search is initiated.
  @Output() search = new EventEmitter<FilterModel>();

  // Stores all validated facet configurations
  facetConfig: FacetConfig[] = []

  // The main form group
  searchForm!: FormGroup;

  // Reference to the error field in the template.
  @ViewChild('errorField') errorField!: ElementRef;

  FacetType = FacetType;

  // The search term entered by the user in the input field.
  searchTerm: string = '';

  // Options for minimum and maximum search length.
  minSearchLengthOption!: number;
  maxSearchLengthOption!: number;

  constructor(
    private formService: FormService,
    private dataMappingService: DataMappingService,
  ) {}

  ngOnInit() {
    // Initialize the search form with specified facets
    this.searchForm = this.formService.createSearchForm(this.facets, {
      minSearchLength: this.minSearchLength,
      maxSearchLength: this.maxSearchLength,
    })

    // Get the processed and sanitized facet configuration
    this.facetConfig = this.formService.getFacetConfig();

    // Extract sanitized options.
    this.extractSanitizedOptions(this.formService.getOptions());

    // Update filters if provided.
    this.updateFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Update filters if 'filters' input changes.
    if (changes['filters'] && this.filters) {
      this.updateFilters();
    }
  }

  /**
   * When the form is submitted, trigger the output event emitter.
   */
  handleSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      this.scrollToError();
      return;
    }

    // apply data mapping to raw filter values
    const filters = this.dataMappingService.mapRawValues(this.searchForm.value, this.facetConfig);

    // trigger the event emitter
    this.search.emit(filters);
  }

  /**
   * Reset the form to its initial state.
   */
  resetForm() {
    this.formService.resetForm(this.searchForm, this.facetConfig);
  }

  private updateFilters() {
    this.formService.updateFilters(this.searchForm, this.filters, this.facetConfig);
  }

  private scrollToError() {
    this.errorField.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.errorField.nativeElement.focus();
  }

  updateSearchTerm(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  private extractSanitizedOptions(options: FormOptions) {
    this.minSearchLengthOption = options.minSearchLength!;
    this.maxSearchLengthOption = options.maxSearchLength!;
  }
}

