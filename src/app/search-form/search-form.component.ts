import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FacetConfig,
  FacetType,
  FilterModel,
} from "./search-form.model";
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
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatSelectModule, MatCheckboxModule, MatInputModule, MatButtonModule, MatIconModule],
  providers: [FormService, DataMappingService],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit {

  @Input() facets: FacetConfig[] = [];
  @Input() minSearchLength?: number;
  @Input() maxSearchLength?: number;
  @Output() search = new EventEmitter<FilterModel>();

  // stores all validated facet configurations
  facetConfig: FacetConfig[] = []

  // the main form group
  searchForm!: FormGroup;

  @ViewChild('errorField') errorField!: ElementRef;

  FacetType = FacetType;

  searchTerm: string = '';
  minSearchLengthOption!: number;
  maxSearchLengthOption!: number;

  constructor(
    private formService: FormService,
    private dataMappingService: DataMappingService,
  ) {}

  ngOnInit() {
    this.searchForm = this.formService.createSearchForm(this.facets, {
      minSearchLength: this.minSearchLength,
      maxSearchLength: this.maxSearchLength,
    })

    // get the processed and sanitized facet configuration
    this.facetConfig = this.formService.getFacetConfig();

    this.extractSanitizedOptions(this.formService.getOptions());
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
    this.search.emit(filters);
  }

  resetForm() {
    // Reset the form here
    this.searchForm.reset({
      searchTerm: '', // Reset searchTerm to empty string
      selections: this.buildInitialSelections() // Reset selections to initial state
    });
  }

  preserveMapOrderComparator() {
    return 0;
  }

  private buildInitialSelections(): Record<string, any> {
    const selectionsGroup: Record<string, any> = {};

    this.facets.forEach(facet => {
      if (facet.type === FacetType.Checkboxes && facet.data) {
        selectionsGroup[facet.key] = Array.from(facet.data.keys()).map(() => false);
      } else {
        selectionsGroup[facet.key] = null;
      }
    });

    return selectionsGroup;
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

